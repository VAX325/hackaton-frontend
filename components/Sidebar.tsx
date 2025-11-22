import React, { useState } from 'react';
import { Home, Bell, Bookmark, Users, ChevronDown, ChevronRight, User as UserIcon, LogOut } from 'lucide-react';
import { Group } from '../types';

interface SidebarProps {
    onNavigate: (view: 'feed' | 'group' | 'profile', id?: string) => void;
    activeView: 'feed' | 'group' | 'profile';
    activeEntityId?: string;
    onLogout: () => void;
    groups: Group[];
    currentUserId: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate, activeView, activeEntityId, onLogout, groups, currentUserId }) => {
    const [isGroupsExpanded, setIsGroupsExpanded] = useState(false);

    const handleGroupsClick = () => {
        setIsGroupsExpanded(!isGroupsExpanded);
    };

    const isMyProfileActive = activeView === 'profile' && activeEntityId === currentUserId;

    return (
        <div className="bg-radiy-card rounded-3xl p-6 border border-radiy-border/50 shadow-xl h-auto flex flex-col min-h-[calc(100vh-120px)]">
            <div className="flex-1">
                <h2 className="text-radiy-muted text-xs uppercase font-bold mb-6 px-2 tracking-wider opacity-60">Навигация</h2>
                <ul className="space-y-3">

                    {/* My Profile */}
                    <li>
                        <button
                            onClick={() => onNavigate('profile', currentUserId)}
                            className={`w-full flex items-center gap-5 px-5 py-4 rounded-2xl transition-all duration-300 group ${isMyProfileActive ? 'bg-radiy-mint text-radiy-bg font-bold shadow-glow transform scale-105' : 'text-radiy-text hover:bg-radiy-bg hover:shadow-lg'}`}
                        >
                            <UserIcon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isMyProfileActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                            <span className="text-sm">Моя страница</span>
                        </button>
                    </li>

                    {/* Feed (Home) */}
                    <li>
                        <button
                            onClick={() => onNavigate('feed')}
                            className={`w-full flex items-center gap-5 px-5 py-4 rounded-2xl transition-all duration-300 group ${activeView === 'feed' ? 'bg-radiy-mint text-radiy-bg font-bold shadow-glow transform scale-105' : 'text-radiy-text hover:bg-radiy-bg hover:shadow-lg'}`}
                        >
                            <Home className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeView === 'feed' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                            <span className="text-sm">Лента</span>
                        </button>
                    </li>

                    {/* Groups Accordion */}
                    <li>
                        <button
                            onClick={handleGroupsClick}
                            className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group ${isGroupsExpanded || activeView === 'group' ? 'bg-radiy-bg border border-radiy-border/50 text-radiy-mint' : 'text-radiy-text hover:bg-radiy-bg'}`}
                        >
                            <div className="flex items-center gap-5">
                                <Users className={`w-5 h-5 transition-transform group-hover:scale-110 ${(isGroupsExpanded || activeView === 'group') ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                                <span className="text-sm font-medium">Группы</span>
                            </div>
                            {isGroupsExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>

                        {/* Nested Groups List */}
                        {isGroupsExpanded && (
                            <div className="mt-2 ml-4 space-y-1 border-l-2 border-radiy-border/50 pl-3 animate-in slide-in-from-top-2 duration-200">
                                {groups.length > 0 ? (
                                    groups.map(group => (
                                        <button
                                            key={group.id}
                                            onClick={() => onNavigate('group', group.id)}
                                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-left transition-colors ${activeView === 'group' && activeEntityId === group.id ? 'text-radiy-mint bg-radiy-mint/10 font-medium' : 'text-radiy-muted hover:text-radiy-text hover:bg-radiy-bg/50'}`}
                                        >
                                            <img src={group.avatar_url} alt={group.name} className="w-6 h-6 rounded-lg object-cover" />
                                            <span className="truncate">{group.name}</span>
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-3 py-2 text-xs text-radiy-muted">Нет групп</div>
                                )}
                            </div>
                        )}
                    </li>

                    {/* Notifications */}
                    <li>
                        <button className="w-full flex items-center gap-5 px-5 py-4 rounded-2xl transition-all duration-300 group text-radiy-text hover:bg-radiy-bg hover:shadow-lg">
                            <Bell className="w-5 h-5 transition-transform group-hover:scale-110 stroke-2" />
                            <span className="text-sm">Уведомления</span>
                        </button>
                    </li>

                    {/* Bookmarks */}
                    <li>
                        <button className="w-full flex items-center gap-5 px-5 py-4 rounded-2xl transition-all duration-300 group text-radiy-text hover:bg-radiy-bg hover:shadow-lg">
                            <Bookmark className="w-5 h-5 transition-transform group-hover:scale-110 stroke-2" />
                            <span className="text-sm">Закладки</span>
                        </button>
                    </li>
                </ul>
            </div>

            {/* Logout Button */}
            <div className="mt-4 border-t border-radiy-border/30 pt-4">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-4 px-5 py-3 rounded-2xl text-radiy-muted hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group"
                >
                    <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    <span className="text-sm font-medium">Выйти</span>
                </button>
            </div>

            <footer className="mt-6 text-[10px] text-radiy-muted px-4 opacity-50">
                <p>© 2024 Radiy Social.</p>
                <div className="flex gap-3 mt-2 flex-wrap">
                    <a href="#" className="hover:text-radiy-mint transition-colors hover:text-glow">О нас</a>
                    <a href="#" className="hover:text-radiy-mint transition-colors hover:text-glow">Правила</a>
                </div>
            </footer>
        </div>
    );
};