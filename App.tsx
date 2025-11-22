import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PostCard } from './components/PostCard';
import { Sidebar } from './components/Sidebar';
import { ProfileHeader } from './components/ProfileHeader';
import { GroupHeader } from './components/GroupHeader';
import { Loader } from './components/Loader';
import { Messenger } from './components/Messenger';
import { SearchResultsPage } from './components/SearchResultsPage';
import { AuthPage } from './components/AuthPage';
import { ImageIcon } from 'lucide-react';
import { api } from './api';
import { User, Post, Group } from './types';

const App: React.FC = () => {
    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // Data State
    const [groups, setGroups] = useState<Group[]>([]);
    const [recentUsers, setRecentUsers] = useState<User[]>([]);
    const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);

    // View Context State
    const [activeGroup, setActiveGroup] = useState<Group | null>(null);
    const [activeUserProfile, setActiveUserProfile] = useState<User | null>(null);

    // UI State
    const [isLoading, setIsLoading] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [currentView, setCurrentView] = useState<'feed' | 'group' | 'profile' | 'chats' | 'search'>('feed');
    const [activeEntityId, setActiveEntityId] = useState<string | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Post Input
    const [postContent, setPostContent] = useState('');

    // 1. Initial Auth Check
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('radiy_token');
            if (token) {
                try {
                    const user = await api.auth.getMe();
                    setCurrentUser(user);
                    setIsAuthenticated(true);
                    await loadInitialData();
                } catch (e) {
                    console.error("Auth failed", e);
                    localStorage.removeItem('radiy_token');
                    setIsAuthenticated(false);
                }
            }
        };
        checkAuth();
    }, []);

    const setDisplayedPostsCustom = (posts) => {
        posts.sort(function (a: Post, b: Post): any {
            return new Date(b.creation_datetime) - new Date(a.creation_datetime);
        });

        setDisplayedPosts(posts)
    }

    // 2. Load Initial Data (Sidebar, etc)
    const loadInitialData = async () => {
        try {
            const [fetchedGroups, fetchedRecentUsers] = await Promise.all([
                api.communities.getAll(),
                api.users.getFollowers()
            ]);
            setGroups(fetchedGroups);
            setRecentUsers(fetchedRecentUsers);
            // Load initial feed
            const posts = await api.posts.getAll();
            setDisplayedPostsCustom(posts);
        } catch (e) {
            console.error("Failed loading initial data", e);
        }
    };

    const handleLoginSuccess = async (access_token: string, refresh_token: string) => {
        setIsLoading(true);
        localStorage.setItem('jwt_access_radiy_token', access_token);
        localStorage.setItem('jwt_refresh_radiy_token', refresh_token);

        try {
            const user = await api.auth.getMe();
            setCurrentUser(user);
            setIsAuthenticated(true);
            setCurrentView('feed');
            await loadInitialData();
        } catch (e) {
            console.error(e);
        } finally {
            setTimeout(() => setIsLoading(false), 1000); // Atom fade out
        }
    };

    const handleLogout = () => {
        api.auth.logout();
        setIsAuthenticated(false);
        setCurrentUser(null);
    };

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    // Main Navigation Handler with API Calls
    const handleNavigation = async (view: 'feed' | 'group' | 'profile' | 'chats' | 'search', idOrQuery?: string) => {
        // Prevent reload on same view
        if (view === currentView && idOrQuery === activeEntityId && view !== 'search') return;

        setIsLoading(true);
        setCurrentView(view);

        // Reset specific view data
        setActiveGroup(null);
        setActiveUserProfile(null);

        try {
            if (view === 'feed') {
                const posts = await api.posts.getAll();
                setDisplayedPostsCustom(posts);
                setActiveEntityId(undefined);
            }
            else if (view === 'profile' && idOrQuery) {
                setActiveEntityId(idOrQuery);
                // Parallel fetch user and their posts
                const [user, posts] = await Promise.all([
                    api.users.getById(idOrQuery),
                    api.posts.getByUser(idOrQuery)
                ]);
                setActiveUserProfile(user);
                setDisplayedPostsCustom(posts);
            }
            else if (view === 'group' && idOrQuery) {
                setActiveEntityId(idOrQuery);
                // Parallel fetch group and posts
                const [group, posts] = await Promise.all([
                    api.communities.getById(idOrQuery),
                    api.posts.getByCommunity(idOrQuery)
                ]);
                setActiveGroup(group);
                setDisplayedPostsCustom(posts);
            }
            else if (view === 'search') {
                setSearchQuery(idOrQuery || '');
                setActiveEntityId(undefined);
                // Search results are handled inside SearchResultsPage component
            }
            else if (view === 'chats') {
                setActiveEntityId(undefined);
            }
        } catch (error) {
            console.error("Navigation Data Fetch Error", error);
            // Fallback or error state could be added here
        } finally {
            window.scrollTo({ top: 0, behavior: 'auto' });
            setTimeout(() => setIsLoading(false), 700);
        }
    };

    // Helpers
    const onNavigateToProfile = (userId: string) => handleNavigation('profile', userId);
    const onNavigateToGroup = (groupId: string) => handleNavigation('group', groupId);
    const onNavigateToFeed = () => handleNavigation('feed');
    const onNavigateToChats = () => handleNavigation('chats');
    const onNavigateToSearch = (query: string) => handleNavigation('search', query);

    // Post Creation
    const handleCreatePost = async () => {
        if (!postContent.trim() || !currentUser) return;

        setIsLoading(true); // Show quick loader for interaction feedback
        try {
            const groupId = currentView === 'group' ? activeEntityId : undefined;
            const newPost = await api.posts.create(postContent, undefined, groupId);

            setDisplayedPostsCustom([newPost, ...displayedPosts]);
            setPostContent('');
        } catch (e) {
            console.error("Create post error", e);
        } finally {
            setIsLoading(false);
        }
    }

    const showPostInput =
        currentView === 'feed' ||
        currentView === 'group' ||
        (currentView === 'profile' && activeEntityId === currentUser?.username);

    // Render Auth
    if (!isAuthenticated || !currentUser) {
        return (
            <>
                <Loader visible={isLoading} />
                <AuthPage onLoginSuccess={handleLoginSuccess} />
            </>
        );
    }

    return (
        <div className="min-h-screen bg-radiy-bg pb-20 selection:bg-radiy-mint selection:text-radiy-bg">

            <Loader visible={isLoading} />

            <Navbar
                onToggleChat={toggleChat}
                isChatOpen={isChatOpen}
                onNavigateToProfile={onNavigateToProfile}
                onNavigateToGroup={onNavigateToGroup}
                onNavigateToFeed={onNavigateToFeed}
                onNavigateToChats={onNavigateToChats}
                onNavigateToSearch={onNavigateToSearch}
                currentUser={currentUser}
                recentUsers={recentUsers}
            />

            {/* Main Layout Container */}
            <div className="w-full pl-4 md:pl-10 lg:pl-24 pt-20 md:pt-24 flex gap-8 lg:gap-12 items-start justify-start">

                {/* Sidebar */}
                <div className="hidden lg:block w-64 shrink-0 sticky top-24">
                    <Sidebar
                        onNavigate={(view, id) => handleNavigation(view, id)}
                        activeView={currentView === 'chats' || currentView === 'search' ? 'feed' : currentView}
                        activeEntityId={activeEntityId}
                        onLogout={handleLogout}
                        groups={groups}
                        currentUserId={currentUser.username}
                    />
                </div>

                {/* Main Content */}
                <main
                    key={currentView + (activeEntityId || '') + searchQuery}
                    className="flex-1 max-w-[800px] xl:max-w-[950px] pr-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-backwards"
                >
                    {currentView === 'chats' && (
                        <Messenger onNavigateToProfile={onNavigateToProfile} currentUser={currentUser} />
                    )}

                    {currentView === 'search' && (
                        <SearchResultsPage
                            searchQuery={searchQuery}
                            onNavigateToProfile={onNavigateToProfile}
                            onNavigateToGroup={onNavigateToGroup}
                        />
                    )}

                    {(currentView === 'feed' || currentView === 'group' || currentView === 'profile') && (
                        <>
                            {/* Headers */}
                            {activeGroup ? (
                                <GroupHeader group={activeGroup} onNavigateToProfile={onNavigateToProfile} />
                            ) : activeUserProfile ? (
                                <ProfileHeader user={activeUserProfile} />
                            ) : null}

                            {/* New Post Input */}
                            {showPostInput && (
                                <div className="bg-radiy-card rounded-none sm:rounded-3xl p-5 border-b sm:border border-radiy-border/50 mb-8 shadow-lg hover:border-radiy-mint/30 transition-colors group">
                                    <div className="flex gap-4">
                                        <div
                                            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-radiy-mint to-teal-200 p-[2px] shadow-glow cursor-pointer hover:scale-105 transition-transform"
                                            onClick={() => onNavigateToProfile(currentUser.username)}
                                        >
                                            <img src={currentUser.avatar_url} alt="Me" className="w-full h-full rounded-2xl object-cover bg-radiy-card" />
                                        </div>
                                        <div className="flex-1 pt-1">
                                            <textarea
                                                value={postContent}
                                                onChange={(e) => setPostContent(e.target.value)}
                                                placeholder={currentView === 'group' ? `Написать в ${activeGroup?.name}...` : "Что у вас нового?"}
                                                className="w-full bg-transparent text-radiy-text text-base resize-none focus:outline-none min-h-[60px] placeholder-radiy-muted/60"
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-2 pt-2">
                                        <div className="flex gap-2">
                                            <button className="p-2.5 rounded-xl hover:bg-radiy-bg text-radiy-mint transition-all hover:scale-105 hover:shadow-glow bg-radiy-bg/30">
                                                <ImageIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={handleCreatePost}
                                            disabled={!postContent.trim()}
                                            className={`px-6 py-2.5 font-bold text-sm rounded-xl transition-all shadow-glow hover:shadow-glow-hover transform active:scale-95 ${!postContent.trim() ? 'bg-radiy-muted/30 text-radiy-muted cursor-not-allowed shadow-none' : 'bg-radiy-mint text-radiy-bg hover:bg-radiy-mintHover'}`}
                                        >
                                            Опубликовать
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Posts Feed */}
                            <div className="space-y-6">
                                {displayedPosts.length > 0 ? (
                                    displayedPosts.map(post => (
                                        <PostCard key={post.id} post={post} onNavigateToProfile={onNavigateToProfile} />
                                    ))
                                ) : (
                                    <div className="text-center py-10 text-radiy-muted">
                                        {currentView === 'profile' ? 'Пользователь еще ничего не опубликовал.' : 'Здесь пока нет записей.'}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default App;