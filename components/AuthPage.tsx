import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from './Icon';
import { api } from '../api';

interface AuthPageProps {
    onLoginSuccess: (token: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form States
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            let response;
            if (isLogin) {
                response = await api.auth.login(username, password);
            } else {
                const visible_name = name;
                response = await api.auth.register({ username, password, visible_name });
            }

            if (response && response.access && response.refresh) {
                onLoginSuccess(response.access, response.refresh);
            } else {
                throw new Error("Login failed due invalid server response")
            }
        } catch (err) {
            console.error(err);
            setError('Ошибка авторизации. Проверьте данные.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-radiy-bg flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-radiy-mint/5 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-teal-900/10 rounded-full blur-[100px]"></div>

            <div className="w-full max-w-md bg-radiy-card/50 backdrop-blur-xl border border-radiy-border/50 shadow-2xl rounded-3xl p-8 relative z-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-radiy-bg border border-radiy-border flex items-center justify-center rounded-2xl mx-auto mb-4 shadow-lg shadow-radiy-mint/10">
                        <span className="text-radiy-mint font-bold text-3xl text-glow">R</span>
                    </div>
                    <h1 className="text-2xl font-bold text-radiy-text mb-2">
                        {isLogin ? 'С возвращением!' : 'Создать аккаунт'}
                    </h1>
                    <p className="text-radiy-muted text-sm">
                        {isLogin ? 'Введите свои данные для входа' : 'Присоединяйтесь к сообществу Radiy'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl text-center">
                            {error}
                        </div>
                    )}

                    {!isLogin && (
                        <div className="space-y-1 animate-in slide-in-from-top-2 duration-300">
                            <label className="text-xs font-bold text-radiy-muted uppercase ml-1">Имя</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Алексей Смирнов"
                                className="w-full bg-radiy-bg border border-radiy-border rounded-xl px-4 py-3 text-radiy-text focus:border-radiy-mint focus:outline-none focus:ring-1 focus:ring-radiy-mint/50 transition-all placeholder-radiy-muted/30"
                                required
                            />
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-radiy-muted uppercase ml-1">Юзернейм</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full bg-radiy-bg border border-radiy-border rounded-xl px-4 py-3 text-radiy-text focus:border-radiy-mint focus:outline-none focus:ring-1 focus:ring-radiy-mint/50 transition-all placeholder-radiy-muted/30"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-radiy-muted uppercase ml-1">Пароль</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-radiy-bg border border-radiy-border rounded-xl px-4 py-3 text-radiy-text focus:border-radiy-mint focus:outline-none focus:ring-1 focus:ring-radiy-mint/50 transition-all placeholder-radiy-muted/30"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-radiy-muted hover:text-radiy-text transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-radiy-mint text-radiy-bg font-bold rounded-xl py-3.5 mt-6 hover:bg-radiy-mintHover transition-all shadow-glow hover:shadow-glow-hover transform active:scale-95 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <span className="w-5 h-5 border-2 border-radiy-bg border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            <>
                                {isLogin ? 'Войти' : 'Зарегистрироваться'}
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-radiy-muted">
                        {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="ml-2 text-radiy-mint font-bold hover:text-glow transition-all hover:underline"
                        >
                            {isLogin ? 'Регистрация' : 'Войти'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};