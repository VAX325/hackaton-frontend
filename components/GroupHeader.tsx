
import React, { useState } from 'react';
import { Group } from '../types';
import { Info, Calendar, Shield, UserIcon, MoreHorizontal, Check } from 'lucide-react';

interface GroupHeaderProps {
    group: Group;
    onNavigateToProfile: (userId: string) => void;
}

export const GroupHeader: React.FC<GroupHeaderProps> = ({ group, onNavigateToProfile }) => {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div className="bg-radiy-card rounded-none sm:rounded-3xl border border-radiy-border/50 shadow-lg mb-8 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Cover Image */}
            <div className="h-48 w-full relative group">
                <img
                    src={group.coverImage}
                    alt="Group Cover"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-radiy-card/90 via-transparent to-transparent"></div>
            </div>

            {/* Group Info Bar */}
            <div className="px-6 pb-6 relative">

                <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-12 mb-4 gap-4">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-32 h-32 rounded-3xl border-4 border-radiy-card bg-radiy-card p-1 shadow-2xl">
                            <img
                                src={group.avatar}
                                alt={group.name}
                                className="w-full h-full rounded-2xl object-cover"
                            />
                        </div>
                    </div>

                    {/* Name and Actions */}
                    <div className="flex-1 pt-2 sm:pt-0 sm:mb-2 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <h1 className="text-2xl font-bold text-radiy-text hover:text-radiy-mint transition-colors hover:text-glow">{group.name}</h1>
                                <p className="text-radiy-muted text-sm font-medium">Публичная группа</p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    className="bg-radiy-mint text-radiy-bg px-6 py-2.5 rounded-xl font-bold transition-all shadow-glow hover:shadow-glow-hover text-sm flex items-center gap-2 hover:scale-105 active:scale-95"
                                >
                                    <Check className="w-4 h-4" />
                                    Вы подписаны
                                </button>
                                <button
                                    onClick={() => setShowDetails(!showDetails)}
                                    className={`p-2.5 rounded-xl transition-all border ${showDetails ? 'bg-radiy-mint/20 border-radiy-mint text-radiy-mint' : 'bg-radiy-bg border-radiy-border text-radiy-muted hover:text-radiy-text'}`}
                                >
                                    <Info className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="mt-4 space-y-4">
                    <p className="text-radiy-text/90 text-sm leading-relaxed max-w-2xl">
                        {group.description}
                    </p>

                    {/* Details Panel (Collapsible) */}
                    {showDetails && (
                        <div className="bg-radiy-bg/50 rounded-2xl p-4 border border-radiy-border/50 animate-in fade-in zoom-in-95 duration-200 space-y-3 mt-4">
                            <div className="flex items-center gap-2 text-sm text-radiy-muted">
                                <Calendar className="w-4 h-4 text-radiy-mint" />
                                <span>Дата создания: <span className="text-radiy-text">{group.details.createdDate}</span></span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-radiy-muted">
                                <Shield className="w-4 h-4 text-radiy-mint" />
                                <span>Администратор: <span
                                    className="text-radiy-text font-medium hover:text-radiy-mint cursor-pointer transition-colors"
                                    onClick={() => onNavigateToProfile(group.details.admin.id)}
                                >{group.details.admin.name}</span></span>
                            </div>

                            <div className="flex items-start gap-2 text-sm text-radiy-muted">
                                <UserIcon className="w-4 h-4 text-radiy-mint mt-0.5" />
                                <div>
                                    <span>Модераторы:</span>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {group.details.moderators.map(mod => (
                                            <span
                                                key={mod.id}
                                                className="bg-radiy-card border border-radiy-border px-2 py-0.5 rounded-lg text-xs text-radiy-text hover:border-radiy-mint cursor-pointer transition-colors"
                                                onClick={() => onNavigateToProfile(mod.id)}
                                            >
                                                {mod.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats Divider */}
                <div className="mt-6 pt-4 border-t border-radiy-border/40 flex gap-8">
                    <div className="flex flex-col group cursor-pointer">
                        <span className="font-bold text-lg text-radiy-text group-hover:text-radiy-mint group-hover:text-glow transition-all">{group.stats.subscribers.toLocaleString()}</span>
                        <span className="text-xs text-radiy-muted group-hover:text-radiy-text">Подписчиков</span>
                    </div>
                    <div className="flex flex-col group cursor-pointer">
                        <span className="font-bold text-lg text-radiy-text group-hover:text-radiy-mint group-hover:text-glow transition-all">{group.stats.posts.toLocaleString()}</span>
                        <span className="text-xs text-radiy-muted group-hover:text-radiy-text">Постов</span>
                    </div>
                </div>

            </div>
        </div>
    );
};
