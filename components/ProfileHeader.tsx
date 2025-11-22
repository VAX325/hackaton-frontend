
import React from 'react';
import { User } from '../types';
import { MapPin, Link, Calendar, Edit3, MessageCircle, UserPlus } from 'lucide-react';
import { CURRENT_USER } from '../constants';

interface ProfileHeaderProps {
    user: User;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
    const isCurrentUser = user.username === CURRENT_USER.username;

    return (
        <div className="bg-radiy-card rounded-none sm:rounded-3xl border border-radiy-border/50 shadow-lg mb-8 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Cover Image */}
            <div className="h-48 w-full relative group">
                <img
                    src={user.cover_image}
                    alt="Cover"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-radiy-card/80 via-transparent to-transparent"></div>
                {isCurrentUser && (
                    <button className="absolute top-4 right-4 bg-black/40 hover:bg-radiy-mint/20 text-white p-2 rounded-xl backdrop-blur-sm transition-all border border-white/10 hover:border-radiy-mint/50 hover:text-radiy-mint hover:shadow-glow">
                        <Edit3 className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Profile Info Bar */}
            <div className="px-6 pb-6 relative">

                <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-12 mb-4 gap-4">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-32 h-32 rounded-3xl border-4 border-radiy-card bg-radiy-card p-1 shadow-2xl">
                            <img
                                src={user.avatar_url}
                                alt={user.name}
                                className="w-full h-full rounded-2xl object-cover"
                            />
                        </div>
                        <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-radiy-card shadow-glow ${user.status === 'online' ? 'bg-radiy-mint' : 'bg-radiy-muted'}`}></div>
                    </div>

                    {/* Name and Bio actions */}
                    <div className="flex-1 pt-2 sm:pt-0 sm:mb-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <h1 className="text-2xl font-bold text-radiy-text hover:text-radiy-mint transition-colors hover:text-glow">{user.name}</h1>
                                <p className="text-radiy-mint text-sm font-medium opacity-80">{user.username}</p>
                            </div>
                            <div className="flex gap-2">
                                {isCurrentUser ? (
                                    <button className="bg-radiy-border/30 hover:bg-radiy-mint hover:text-radiy-bg text-radiy-text border border-radiy-border px-6 py-2.5 rounded-xl font-medium transition-all hover:shadow-glow text-sm flex items-center gap-2">
                                        <Edit3 className="w-4 h-4" />
                                        Редактировать
                                    </button>
                                ) : (
                                    <>
                                        <button className="bg-radiy-mint text-radiy-bg px-6 py-2.5 rounded-xl font-medium transition-all shadow-glow hover:shadow-glow-hover text-sm flex items-center gap-2 hover:scale-105">
                                            <UserPlus className="w-4 h-4" />
                                            Добавить
                                        </button>
                                        <button className="bg-radiy-bg border border-radiy-border text-radiy-text hover:text-radiy-mint hover:border-radiy-mint px-4 py-2.5 rounded-xl font-medium transition-all text-sm flex items-center gap-2">
                                            <MessageCircle className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bio and Details */}
                <div className="mt-4 space-y-4">
                    {user.bio && (
                        <p className="text-radiy-text/90 text-sm leading-relaxed max-w-2xl">
                            {user.bio}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-6 text-xs text-radiy-muted font-medium">
                        <div className="flex items-center gap-1.5 hover:text-radiy-mint transition-colors cursor-pointer">
                            <MapPin className="w-4 h-4" />
                            <span>Москва, Россия</span>
                        </div>
                        <div className="flex items-center gap-1.5 hover:text-radiy-mint transition-colors cursor-pointer">
                            <Link className="w-4 h-4" />
                            <span>radiy.social/{user.username.replace('@', '')}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>В сети с 2023</span>
                        </div>
                    </div>
                </div>

                {/* Stats Divider */}
                <div className="mt-6 pt-4 border-t border-radiy-border/40 flex gap-8">
                    <div className="flex flex-col group cursor-pointer">
                        <span className="font-bold text-lg text-radiy-text group-hover:text-radiy-mint group-hover:text-glow transition-all">{user.stats?.posts}</span>
                        <span className="text-xs text-radiy-muted group-hover:text-radiy-text">Публикаций</span>
                    </div>
                    <div className="flex flex-col group cursor-pointer">
                        <span className="font-bold text-lg text-radiy-text group-hover:text-radiy-mint group-hover:text-glow transition-all">{user.stats?.followers}</span>
                        <span className="text-xs text-radiy-muted group-hover:text-radiy-text">Подписчиков</span>
                    </div>
                    <div className="flex flex-col group cursor-pointer">
                        <span className="font-bold text-lg text-radiy-text group-hover:text-radiy-mint group-hover:text-glow transition-all">{user.stats?.friends}</span>
                        <span className="text-xs text-radiy-muted group-hover:text-radiy-text">Друзей</span>
                    </div>
                </div>

            </div>
        </div>
    );
};
