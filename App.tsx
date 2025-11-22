import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PostCard } from './components/PostCard';
import { Sidebar } from './components/Sidebar';
import { ProfileHeader } from './components/ProfileHeader';
import { GroupHeader } from './components/GroupHeader';
import { Loader } from './components/Loader';
import { Messenger } from './components/Messenger';
import { SearchResultsPage } from './components/SearchResultsPage';
import { MOCK_POSTS, CURRENT_USER, MOCK_GROUPS, MOCK_GROUP_POSTS, RECENT_USERS } from './constants';
import { ImageIcon } from 'lucide-react';

const App: React.FC = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Navigation State
    // 'feed' = News Feed (Mixed posts, no header)
    // 'group' = Group View
    // 'profile' = User Profile (Header + User posts)
    // 'chats' = All Chats View
    // 'search' = Search Results View
    const [currentView, setCurrentView] = useState<'feed' | 'group' | 'profile' | 'chats' | 'search'>('feed');
    const [activeEntityId, setActiveEntityId] = useState<string | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        // Initial load
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    // Modified to accept generic string for ID or Query
    const handleNavigation = (view: 'feed' | 'group' | 'profile' | 'chats' | 'search', idOrQuery?: string) => {
        // Prevent reloading if already on the view
        if (view === currentView && idOrQuery === activeEntityId && view !== 'search') return;
        if (view === 'search' && idOrQuery === searchQuery && currentView === 'search') return;

        // Trigger Loading State
        setIsLoading(true);
        setCurrentView(view);

        if (view === 'search') {
            setSearchQuery(idOrQuery || '');
            setActiveEntityId(undefined);
        } else {
            setActiveEntityId(idOrQuery);
        }

        // Scroll to top immediately
        window.scrollTo({ top: 0, behavior: 'auto' });

        // Fade out loader after a delay
        setTimeout(() => {
            setIsLoading(false);
        }, 1200);
    };

    // Helpers for Navigation
    const onNavigateToProfile = (userId: string) => handleNavigation('profile', userId);
    const onNavigateToGroup = (groupId: string) => handleNavigation('group', groupId);
    const onNavigateToFeed = () => handleNavigation('feed');
    const onNavigateToChats = () => handleNavigation('chats');
    const onNavigateToSearch = (query: string) => handleNavigation('search', query);


    // Determine content based on view
    let activeGroup = null;
    let activeUserProfile = null;
    let displayedPosts = MOCK_POSTS; // Default (used for Feed)

    if (currentView === 'group' && activeEntityId) {
        activeGroup = MOCK_GROUPS.find(g => g.id === activeEntityId);
        displayedPosts = MOCK_GROUP_POSTS[activeEntityId] || [];
    } else if (currentView === 'profile' && activeEntityId) {
        if (activeEntityId === CURRENT_USER.id) {
            activeUserProfile = CURRENT_USER;
        } else {
            activeUserProfile = RECENT_USERS.find(u => u.id === activeEntityId);
        }
        displayedPosts = MOCK_POSTS.filter(p => p.author.id === activeEntityId);
    } else if (currentView === 'feed') {
        displayedPosts = MOCK_POSTS;
    }

    // Logic to hide "New Post" input
    // Show on Feed, Groups, and Own Profile. Hide on Other's Profile, Chats, Search.
    const showPostInput =
        currentView === 'feed' ||
        currentView === 'group' ||
        (currentView === 'profile' && activeEntityId === CURRENT_USER.id);

    return (
        <div className="min-h-screen bg-radiy-bg pb-20 selection:bg-radiy-mint selection:text-radiy-bg">

            {/* Loader handles the atom animation and overlay */}
            <Loader visible={isLoading} />

            <Navbar
                onToggleChat={toggleChat}
                isChatOpen={isChatOpen}
                onNavigateToProfile={onNavigateToProfile}
                onNavigateToGroup={onNavigateToGroup}
                onNavigateToFeed={onNavigateToFeed}
                onNavigateToChats={onNavigateToChats}
                onNavigateToSearch={onNavigateToSearch}
            />

            {/* Main Layout Container */}
            <div className="w-full pl-4 md:pl-10 lg:pl-24 pt-20 md:pt-24 flex gap-8 lg:gap-12 items-start justify-start">

                {/* Sidebar (Left Navigation) */}
                <div className="hidden lg:block w-64 shrink-0 sticky top-24">
                    <Sidebar
                        onNavigate={(view, id) => handleNavigation(view, id)}
                        activeView={currentView === 'chats' || currentView === 'search' ? 'feed' : currentView}
                        activeEntityId={activeEntityId}
                    />
                </div>

                {/* Main Content Column */}
                {/* Key prop ensures the component re-mounts and re-triggers animations when view changes */}
                <main
                    key={currentView + (activeEntityId || '') + searchQuery}
                    className="flex-1 max-w-[800px] xl:max-w-[950px] pr-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-backwards"
                >

                    {/* --- Conditional Rendering based on Views --- */}

                    {/* 1. Chats View */}
                    {currentView === 'chats' && (
                        <Messenger onNavigateToProfile={onNavigateToProfile} />
                    )}

                    {/* 2. Search View */}
                    {currentView === 'search' && (
                        <SearchResultsPage
                            searchQuery={searchQuery}
                            onNavigateToProfile={onNavigateToProfile}
                            onNavigateToGroup={onNavigateToGroup}
                        />
                    )}

                    {/* 3. Content Feed Views (Feed, Group, Profile) */}
                    {(currentView === 'feed' || currentView === 'group' || currentView === 'profile') && (
                        <>
                            {/* Dynamic Header */}
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
                                            onClick={() => onNavigateToProfile(CURRENT_USER.id)}
                                        >
                                            <img src={CURRENT_USER.avatar} alt="Me" className="w-full h-full rounded-2xl object-cover bg-radiy-card" />
                                        </div>
                                        <div className="flex-1 pt-1">
                                            <textarea
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
                                        <button className="px-6 py-2.5 bg-radiy-mint text-radiy-bg font-bold text-sm rounded-xl hover:bg-radiy-mintHover transition-all shadow-glow hover:shadow-glow-hover transform active:scale-95">
                                            Опубликовать
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Posts List */}
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

                {/* Right side empty */}
            </div>
        </div>
    );
};

export default App;