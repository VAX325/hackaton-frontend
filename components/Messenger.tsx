import React, { useState, useEffect } from 'react';
import { User, ChatMessage } from '../types';
import { api } from '../api';
import { Send, MoreHorizontal, Phone, Video, Search, Check } from 'lucide-react';

interface MessengerProps {
    onNavigateToProfile: (userId: string) => void;
    currentUser: User;
}

export const Messenger: React.FC<MessengerProps> = ({ onNavigateToProfile, currentUser }) => {
    const [recentUsers, setRecentUsers] = useState<User[]>([]);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                const users = await api.users.getFollowers();
                setRecentUsers(users);
                if (users.length > 0) {
                    setSelectedChatId(users[0].username);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        init();
    }, []);

    useEffect(() => {
        if (!selectedChatId) return;

        const fetchHistory = async () => {
            try {
                const history = await api.chat.getHistory(selectedChatId);
                setMessages(history);
            } catch (e) {
                console.error(e);
            }
        };
        fetchHistory();
    }, [selectedChatId]);

    const handleSendMessage = async () => {
        if (!selectedChatId || !inputText.trim()) return;
        try {
            const newMsg = await api.chat.sendMessage(selectedChatId, inputText);
            setMessages([...messages, newMsg]);
            setInputText('');
        } catch (e) {
            console.error(e);
        }
    };

    const activeUser = recentUsers.find(u => u.username === selectedChatId);

    if (isLoading) return <div className="text-center p-10 text-radiy-mint animate-pulse">Загрузка чатов...</div>;

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
                    {recentUsers.map(user => (
                        <div
                            key={user.username}
                            onClick={() => setSelectedChatId(user.username)}
                            className={`p-4 flex gap-3 cursor-pointer transition-colors hover:bg-radiy-bg/50 ${selectedChatId === user.username ? 'bg-radiy-mint/10 border-l-2 border-radiy-mint' : 'border-l-2 border-transparent'}`}
                        >
                            <div className="relative">
                                <img src={user.avatar_url} alt={user.visible_name} className="w-12 h-12 rounded-xl object-cover" />
                                {user.status === 'online' && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-radiy-mint rounded-full border-2 border-radiy-card shadow-glow"></div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className={`font-medium text-sm truncate ${selectedChatId === user.username ? 'text-radiy-mint' : 'text-radiy-text'}`}>
                                        {user.visible_name}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-radiy-muted truncate max-w-[140px]">
                                        Открыть чат
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Active Chat Area */}
            <div className="flex-1 flex flex-col bg-radiy-bg/10">
                {activeUser ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-16 px-6 border-b border-radiy-border/50 flex justify-between items-center bg-radiy-card/50 backdrop-blur-sm">
                            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigateToProfile(activeUser.username)}>
                                <img src={activeUser.avatar_url} alt={activeUser.visible_name} className="w-10 h-10 rounded-xl group-hover:opacity-80 transition-opacity" />
                                <div>
                                    <h3 className="font-bold text-sm text-radiy-text group-hover:text-radiy-mint transition-colors">{activeUser.visible_name}</h3>
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
                            {messages.length > 0 ? (
                                messages.map(msg => (
                                    <div key={msg.id} className={`flex gap-3 ${msg.senderId === currentUser.username ? 'flex-row-reverse' : ''}`}>
                                        <img
                                            src={msg.senderId === currentUser.username ? currentUser.avatar_url : activeUser.avatar_url}
                                            className="w-8 h-8 rounded-xl self-end mb-1"
                                        />
                                        <div className={`max-w-[70%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.senderId === currentUser.username
                                            ? 'bg-radiy-mint text-radiy-bg rounded-tr-none shadow-glow-hover'
                                            : 'bg-radiy-card border border-radiy-border/50 text-radiy-text rounded-tl-none'
                                            }`}>
                                            {msg.text}
                                            <div className={`text-[9px] text-right mt-1 opacity-70 ${msg.senderId === currentUser.username ? 'text-radiy-bg' : 'text-radiy-muted'}`}>
                                                {msg.timestamp}
                                                {msg.senderId === currentUser.username && <Check className="w-3 h-3 inline ml-1" />}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-radiy-muted text-sm py-10 opacity-50">
                                    Нет сообщений. Начните общение!
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
                                <button
                                    onClick={handleSendMessage}
                                    className="p-2 rounded-xl bg-radiy-mint text-radiy-bg hover:bg-radiy-mintHover transition-all shadow-glow hover:shadow-glow-hover active:scale-95 mb-0.5"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-radiy-muted">Выберите чат</div>
                )}
            </div>
        </div>
    );
};