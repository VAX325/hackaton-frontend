import React, { useState } from 'react';
import { RECENT_USERS, CURRENT_USER, MOCK_CHAT_HISTORY } from '../constants';
import { Send, MoreHorizontal, Phone, Video, Search, Check } from 'lucide-react';

interface MessengerProps {
    onNavigateToProfile: (userId: string) => void;
}

export const Messenger: React.FC<MessengerProps> = ({ onNavigateToProfile }) => {
    const [selectedChatId, setSelectedChatId] = useState<string>(RECENT_USERS[0].id);
    const [inputText, setInputText] = useState('');

    const activeUser = RECENT_USERS.find(u => u.id === selectedChatId) || RECENT_USERS[0];

    return (
        <div className="bg-radiy-card rounded-3xl border border-radiy-border/50 shadow-lg h-[calc(100vh-140px)] flex overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Chat List Sidebar */}
            <div className="w-80 border-r border-radiy-border/50 flex flex-col bg-radiy-bg/30 hidden md:flex">
                <div className="p-4 border-b border-radiy-border/50">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Поиск диалогов..."
                            className="w-full bg-radiy-bg border border-radiy-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-radiy-mint transition-colors placeholder-radiy-muted/50"
                        />
                        <Search className="w-4 h-4 text-radiy-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {RECENT_USERS.map(user => (
                        <div
                            key={user.id}
                            onClick={() => setSelectedChatId(user.id)}
                            className={`p-4 flex gap-3 cursor-pointer transition-colors hover:bg-radiy-bg/50 ${selectedChatId === user.id ? 'bg-radiy-mint/10 border-l-2 border-radiy-mint' : 'border-l-2 border-transparent'}`}
                        >
                            <div className="relative">
                                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-xl object-cover" />
                                {user.status === 'online' && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-radiy-mint rounded-full border-2 border-radiy-card shadow-glow"></div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className={`font-medium text-sm truncate ${selectedChatId === user.id ? 'text-radiy-mint' : 'text-radiy-text'}`}>
                                        {user.name}
                                    </span>
                                    <span className="text-[10px] text-radiy-muted">10:42</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-radiy-muted truncate max-w-[140px]">
                                        {user.id === 'u1' ? 'Рада слышать! Скоро выкатим обновление.' : 'Привет! Как дела?'}
                                    </p>
                                    {user.id === 'u1' && (
                                        <div className="w-4 h-4 bg-radiy-mint rounded-full flex items-center justify-center text-[9px] font-bold text-radiy-bg shadow-glow">2</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Active Chat Area */}
            <div className="flex-1 flex flex-col bg-radiy-bg/10">
                {/* Chat Header */}
                <div className="h-16 px-6 border-b border-radiy-border/50 flex justify-between items-center bg-radiy-card/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigateToProfile(activeUser.id)}>
                        <img src={activeUser.avatar} alt={activeUser.name} className="w-10 h-10 rounded-xl group-hover:opacity-80 transition-opacity" />
                        <div>
                            <h3 className="font-bold text-sm text-radiy-text group-hover:text-radiy-mint transition-colors">{activeUser.name}</h3>
                            <span className={`text-xs ${activeUser.status === 'online' ? 'text-radiy-mint text-glow' : 'text-radiy-muted'}`}>
                                {activeUser.status === 'online' ? 'Online' : 'Был(а) недавно'}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-4 text-radiy-muted">
                        <Phone className="w-5 h-5 hover:text-radiy-mint cursor-pointer transition-colors" />
                        <Video className="w-5 h-5 hover:text-radiy-mint cursor-pointer transition-colors" />
                        <MoreHorizontal className="w-5 h-5 hover:text-radiy-text cursor-pointer transition-colors" />
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
                    <div className="flex justify-center">
                        <span className="text-xs text-radiy-muted bg-radiy-bg/50 px-3 py-1 rounded-full border border-radiy-border/30">Сегодня</span>
                    </div>

                    {/* Mock History - Dynamic based on selected user (simplified logic) */}
                    {activeUser.id === 'u1' ? (
                        <>
                            {MOCK_CHAT_HISTORY.map(msg => (
                                <div key={msg.id} className={`flex gap-3 ${msg.senderId === 'me' ? 'flex-row-reverse' : ''}`}>
                                    <img
                                        src={msg.senderId === 'me' ? CURRENT_USER.avatar : activeUser.avatar}
                                        className="w-8 h-8 rounded-xl self-end mb-1"
                                    />
                                    <div className={`max-w-[70%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.senderId === 'me'
                                            ? 'bg-radiy-mint text-radiy-bg rounded-tr-none shadow-glow-hover'
                                            : 'bg-radiy-card border border-radiy-border/50 text-radiy-text rounded-tl-none'
                                        }`}>
                                        {msg.text}
                                        <div className={`text-[9px] text-right mt-1 opacity-70 ${msg.senderId === 'me' ? 'text-radiy-bg' : 'text-radiy-muted'}`}>
                                            {msg.timestamp}
                                            {msg.senderId === 'me' && <Check className="w-3 h-3 inline ml-1" />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="text-center text-radiy-muted text-sm py-10 opacity-50">
                            Здесь будет история переписки с пользователем {activeUser.name}
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-radiy-card border-t border-radiy-border/50">
                    <div className="flex gap-3 relative items-end bg-radiy-bg border border-radiy-border rounded-2xl p-2 focus-within:border-radiy-mint/50 focus-within:ring-1 focus-within:ring-radiy-mint/30 transition-all">
                        <textarea
                            placeholder="Напишите сообщение..."
                            className="w-full bg-transparent text-sm text-radiy-text resize-none focus:outline-none px-3 py-2 max-h-32 min-h-[40px] custom-scrollbar"
                            rows={1}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        />
                        <button className="p-2 rounded-xl bg-radiy-mint text-radiy-bg hover:bg-radiy-mintHover transition-all shadow-glow hover:shadow-glow-hover active:scale-95 mb-0.5">
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};