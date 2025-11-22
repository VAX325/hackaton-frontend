import React, { useState, useRef, useEffect } from 'react';
import { Search, Settings, Send } from 'lucide-react';
import { User, SearchResult } from '../types';
import { api } from '../api';

interface NavbarProps {
  onToggleChat: () => void;
  isChatOpen: boolean;
  onNavigateToProfile: (userId: string) => void;
  onNavigateToGroup: (groupId: string) => void;
  onNavigateToFeed: () => void;
  onNavigateToChats: () => void;
  onNavigateToSearch: (query: string) => void;
  currentUser: User | null;
  recentUsers: User[];
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleChat,
  isChatOpen,
  onNavigateToProfile,
  onNavigateToGroup,
  onNavigateToFeed,
  onNavigateToChats,
  onNavigateToSearch,
  currentUser,
  recentUsers
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search Debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 1) {
        try {
          const results = await api.search.query(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error("Search error", error);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearchResultClick = (result: SearchResult) => {
    setIsSearchFocused(false);
    setSearchQuery('');

    if (result.type === 'user' && result.entityId) {
      onNavigateToProfile(result.entityId);
    } else if (result.type === 'community' && result.entityId) {
      onNavigateToGroup(result.entityId);
    }
  };

  const handleShowAllResults = () => {
    setIsSearchFocused(false);
    onNavigateToSearch(searchQuery);
  };

  if (!currentUser) return null;

  return (
    <nav className="h-20 bg-radiy-card/95 backdrop-blur-md border-b border-radiy-border flex items-center px-4 md:px-8 fixed top-0 w-full z-50 shadow-sm">
      {/* Left: Logo */}
      <div className="flex items-center mr-12">
        <div className="w-12 h-12 bg-radiy-bg border border-radiy-border/50 flex items-center justify-center rounded-2xl cursor-pointer hover:border-radiy-mint transition-colors group shadow-lg hover:shadow-glow" onClick={onNavigateToFeed}>
          <span className="text-radiy-mint font-bold text-xl group-hover:scale-110 transition-transform drop-shadow-md">R</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative flex-1 max-w-lg mr-auto" ref={searchRef}>
        <div className="relative group">
          <input
            type="text"
            placeholder="Поиск..."
            className="w-full bg-radiy-bg border border-radiy-border text-radiy-text rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:border-radiy-mint focus:ring-1 focus:ring-radiy-mint/50 transition-all placeholder-radiy-muted/50 text-sm group-hover:border-radiy-border/80 shadow-inner"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleShowAllResults();
            }}
          />
          <Search className="w-5 h-5 text-radiy-muted absolute left-4 top-1/2 -translate-y-1/2 group-hover:text-radiy-text transition-colors" />
        </div>

        {/* Search Dropdown */}
        {isSearchFocused && searchQuery.length > 1 && (
          <div className="absolute top-full left-0 w-full bg-radiy-card border border-radiy-border rounded-2xl mt-2 shadow-2xl shadow-black/50 overflow-hidden z-50">
            <div className="p-2">
              <div className="text-[10px] text-radiy-muted uppercase font-bold mb-2 px-3 mt-2 tracking-wider">Результаты</div>
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center p-2 hover:bg-radiy-bg rounded-xl cursor-pointer transition-colors group"
                    onClick={() => handleSearchResultClick(result)}
                  >
                    <img src={result.image} alt={result.title} className="w-9 h-9 rounded-xl object-cover mr-3" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-radiy-text group-hover:text-radiy-mint transition-colors">{result.title}</div>
                      <div className="text-xs text-radiy-muted capitalize">{result.type === 'community' ? 'Сообщество' : 'Пользователь'}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-xs text-radiy-muted text-center">Нет результатов</div>
              )}

              {/* Show All Results Button */}
              <div
                className="p-3 text-center text-xs font-bold text-radiy-mint cursor-pointer hover:bg-radiy-mint/10 rounded-xl mt-1 transition-colors"
                onClick={handleShowAllResults}
              >
                Показать все результаты
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Area Container */}
      <div className="flex items-center gap-8 ml-6">

        {/* Recent Users (Chat Trigger) - Expanded */}
        <div className="relative hidden md:block group">
          <div
            className="flex items-center gap-4 bg-radiy-bg px-4 py-2.5 rounded-2xl border border-radiy-border/50 hover:border-radiy-mint/50 transition-all cursor-pointer min-w-[260px] justify-between shadow-sm hover:shadow-glow"
            onClick={onToggleChat}
          >
            <div className="flex -space-x-2">
              {recentUsers.slice(0, 6).map((user) => (
                <img
                  key={user.username}
                  src={user.avatar_url}
                  alt={user.name}
                  className={`w-10 h-10 rounded-2xl border-[3px] border-radiy-bg transition-transform hover:translate-y-[-3px] hover:z-10 ${user.status === 'online' ? 'ring-2 ring-radiy-mint/50' : ''}`}
                  title={user.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateToProfile(user.username);
                  }}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-radiy-muted group-hover:text-radiy-mint transition-colors pr-1">Чаты</span>
          </div>

          {/* Chat Overlay - Widened */}
          {isChatOpen && (
            <div className="absolute top-full right-0 mt-4 w-[550px] bg-radiy-card border border-radiy-border rounded-3xl shadow-2xl shadow-black/50 overflow-hidden z-40 flex flex-col h-[600px] origin-top-right animate-in fade-in zoom-in-95 duration-200">
              <ChatWindow
                onNavigateToProfile={onNavigateToProfile}
                onNavigateToChats={onNavigateToChats}
                onClose={onToggleChat}
                currentUser={currentUser}
                recentUsers={recentUsers}
              />
            </div>
          )}
        </div>

        {/* Current User */}
        <div
          className="flex items-center gap-4 cursor-pointer group"
          onClick={() => onNavigateToProfile(currentUser.username)}
        >
          <div className="text-right hidden lg:block">
            <div className="text-sm font-bold text-radiy-text group-hover:text-radiy-mint transition-colors drop-shadow-sm">{currentUser.name}</div>
            <div className="text-xs text-radiy-mint opacity-90 text-glow">Online</div>
          </div>
          <img
            src={currentUser.avatar_url}
            alt="Me"
            className="w-12 h-12 rounded-2xl border-2 border-radiy-card shadow-lg group-hover:border-radiy-mint transition-colors group-hover:shadow-glow"
          />
        </div>

        {/* Settings */}
        <button className="w-12 h-12 rounded-2xl bg-radiy-bg border border-radiy-border/50 flex items-center justify-center text-radiy-muted hover:text-radiy-mint hover:border-radiy-mint transition-all hover:shadow-glow">
          <Settings className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
};

const ChatWindow = ({
  onNavigateToProfile,
  onNavigateToChats,
  onClose,
  currentUser,
  recentUsers
}: {
  onNavigateToProfile: (id: string) => void,
  onNavigateToChats: () => void,
  onClose: () => void,
  currentUser: User,
  recentUsers: User[]
}) => {
  const [input, setInput] = React.useState('');

  const handleAllChatsClick = () => {
    onClose(); // Close dropdown
    onNavigateToChats();
  };

  // Basic mock content for the chat window specifically, 
  // since complex chat state is handled in Messenger.tsx or full Chat view
  const chatPartner = recentUsers[0];

  return (
    <>
      <div className="p-5 border-b border-radiy-border bg-radiy-bg/80 backdrop-blur flex justify-between items-center">
        <span className="text-base font-bold text-radiy-text">Сообщения</span>
        <span
          className="text-xs font-bold text-radiy-mint cursor-pointer hover:text-white transition-colors hover:text-glow"
          onClick={handleAllChatsClick}
        >
          Все чаты
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-radiy-card scrollbar-hide">
        {chatPartner && (
          <>
            <div className="flex gap-4">
              <img
                src={chatPartner.avatar_url}
                className="w-10 h-10 rounded-2xl mt-1 cursor-pointer hover:opacity-80"
                onClick={() => onNavigateToProfile(chatPartner.username)}
              />
              <div className="bg-radiy-bg p-4 rounded-2xl rounded-tl-none text-sm text-radiy-text max-w-[75%] shadow-sm border border-radiy-border/30">
                Привет! Это тестовое сообщение из API.
              </div>
            </div>
            <div className="flex gap-4 flex-row-reverse">
              <img
                src={currentUser.avatar_url}
                className="w-10 h-10 rounded-2xl mt-1 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onNavigateToProfile(currentUser.username)}
              />
              <div className="bg-radiy-mint text-radiy-bg font-medium p-4 rounded-2xl rounded-tr-none text-sm max-w-[75%] shadow-glow">
                Привет! Система работает отлично.
              </div>
            </div>
          </>
        )}
      </div>
      <div className="p-5 bg-radiy-bg border-t border-radiy-border">
        <div className="flex gap-3 relative">
          <input
            className="flex-1 bg-radiy-card border border-radiy-border rounded-xl px-5 py-3 text-sm text-radiy-text focus:border-radiy-mint focus:outline-none transition-colors placeholder-radiy-muted/50 shadow-inner"
            placeholder="Напишите сообщение..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-radiy-mint hover:bg-radiy-mint/10 transition-colors hover:shadow-glow">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  )
}