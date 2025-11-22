import React from 'react';
import { SEARCH_RESULTS } from '../constants';
import { SearchResult } from '../types';
import { Users, UserIcon } from 'lucide-react';

interface SearchResultsPageProps {
    searchQuery: string;
    onNavigateToProfile: (userId: string) => void;
    onNavigateToGroup: (groupId: string) => void;
}

export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ searchQuery, onNavigateToProfile, onNavigateToGroup }) => {

    const handleResultClick = (result: SearchResult) => {
        if (result.type === 'user' && result.entityId) {
            onNavigateToProfile(result.entityId);
        } else if (result.type === 'community' && result.entityId) {
            onNavigateToGroup(result.entityId);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-radiy-card rounded-3xl border border-radiy-border/50 p-6 mb-6 shadow-lg">
                <h1 className="text-2xl font-bold text-radiy-text mb-2">Результаты поиска</h1>
                <p className="text-radiy-muted">По запросу: <span className="text-radiy-mint font-medium">"{searchQuery || 'Все'}"</span></p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {SEARCH_RESULTS.length > 0 ? (
                    SEARCH_RESULTS.map(result => (
                        <div
                            key={result.id}
                            className="bg-radiy-card p-4 rounded-2xl border border-radiy-border/30 hover:border-radiy-mint/50 transition-all cursor-pointer flex items-center gap-4 group hover:shadow-lg"
                            onClick={() => handleResultClick(result)}
                        >
                            <div className="relative">
                                <img src={result.image} alt={result.title} className="w-16 h-16 rounded-2xl object-cover" />
                                <div className="absolute -bottom-2 -right-2 bg-radiy-bg p-1.5 rounded-xl border border-radiy-border/50">
                                    {result.type === 'community' ? (
                                        <Users className="w-3.5 h-3.5 text-radiy-mint" />
                                    ) : (
                                        <UserIcon className="w-3.5 h-3.5 text-radiy-mint" />
                                    )}
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-radiy-text group-hover:text-radiy-mint transition-colors group-hover:text-glow">{result.title}</h3>
                                <p className="text-sm text-radiy-muted capitalize">
                                    {result.type === 'community' ? 'Сообщество' : 'Пользователь'}
                                </p>
                            </div>
                            <button className="bg-radiy-bg border border-radiy-border text-radiy-text px-4 py-2 rounded-xl text-sm font-medium hover:bg-radiy-mint hover:text-radiy-bg hover:border-radiy-mint transition-all">
                                Перейти
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-radiy-muted">
                        Ничего не найдено
                    </div>
                )}
            </div>
        </div>
    );
};