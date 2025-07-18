'use client';

import { useState, useEffect } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

interface ReactionData {
    id: string;
    emoji: string;
    userName: string;
    timestamp: number;
}

export default function HomePage() {
    const [userName, setUserName] = useState('');
    const [isNameSet, setIsNameSet] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [recentReactions, setRecentReactions] = useState<ReactionData[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Analytics integration
    const { isAnalyticsEnabled, trackReaction } = useAnalytics(isNameSet ? userName : null);

    const reactionButtons = [
        { emoji: '👍', label: 'Like' },
        { emoji: '❤️', label: 'Love' },
        { emoji: '😂', label: 'Laugh' },
        { emoji: '🎉', label: 'Party' },
        { emoji: '🔥', label: 'Fire' },
        { emoji: '👏', label: 'Clap' },
        { emoji: '😱', label: 'Shock' },
        { emoji: '🤔', label: 'Think' },
    ];

    useEffect(() => {
        // Load saved name from localStorage
        const savedName = localStorage.getItem('overlayUserName');
        if (savedName) {
            setUserName(savedName);
            setIsNameSet(true);
        }
    }, []);

    useEffect(() => {
        if (isNameSet) {
            // Initialize SSE connection
            const eventSource = new EventSource('/api/reactions');

            eventSource.onopen = () => {
                setIsConnected(true);
                console.log('Connected to SSE');
            };

            eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'reaction') {
                        const reaction: ReactionData = {
                            id: data.id || `${Date.now()}-${Math.random()}`,
                            emoji: data.emoji,
                            userName: data.userName,
                            timestamp: data.timestamp
                        };
                        setRecentReactions((prev: ReactionData[]) => [reaction, ...prev.slice(0, 4)]);
                    }
                } catch (error) {
                    console.error('Error parsing SSE message:', error);
                }
            };

            eventSource.onerror = () => {
                setIsConnected(false);
                console.log('SSE connection error');

                // Auto-reconnect after 3 seconds
                setTimeout(() => {
                    if (eventSource.readyState === EventSource.CLOSED) {
                        window.location.reload();
                    }
                }, 3000);
            };

            return () => {
                eventSource.close();
            };
        }
    }, [isNameSet]);

    const handleNameSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userName.trim()) {
            localStorage.setItem('overlayUserName', userName.trim());
            setIsNameSet(true);
        }
    };

    const sendReaction = async (emoji: string) => {
        if (!isConnected || !userName.trim() || isLoading) return;

        setIsLoading(true);

        try {
            const reaction = {
                emoji,
                userName: userName.trim(),
                timestamp: Date.now(),
                id: `${Date.now()}-${Math.random().toString(36).substring(7)}`
            };

            const response = await fetch('/api/reactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reaction),
            });

            if (response.ok) {
                console.log(`Sent reaction: ${emoji} from ${userName}`);

                // Track analytics if enabled
                if (isAnalyticsEnabled) {
                    await trackReaction(emoji);
                }
            }
        } catch (error) {
            console.error('Error sending reaction:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetName = () => {
        localStorage.removeItem('overlayUserName');
        setUserName('');
        setIsNameSet(false);
        setRecentReactions([]);
    };

    // Name input form
    if (!isNameSet) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                <div className="bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full">
                    <div className="text-center mb-6">
                        <div className="text-6xl mb-4">🎭</div>
                        <h1 className="text-3xl font-bold text-white mb-2">Overlay Reaction</h1>
                        <p className="text-gray-300">Masukkan nama Anda untuk mulai mengirim reaksi</p>
                    </div>

                    <form onSubmit={handleNameSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="userName" className="block text-sm font-medium text-gray-300 mb-2">
                                Nama Anda
                            </label>
                            <input
                                type="text"
                                id="userName"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                                placeholder="Masukkan nama Anda..."
                                required
                                maxLength={20}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!userName.trim()}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                        >
                            Mulai Mengirim Reaksi 🚀
                        </button>
                    </form>

                    <div className="mt-6">
                        <footer className="text-center">
                            <p className="text-sm text-gray-300">
                                Made with ❤️ by{' '}
                                <a
                                    href="https://hi.oktaa.my.id"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                                >
                                    oktaa.my.id
                                </a>
                            </p>
                        </footer>
                    </div>
                </div>
            </div>
        );
    }

    // Main control interface
    return (
        <div className="min-h-screen bg-gray-900 p-4">
            <div className="max-w-md mx-auto">
                <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                    <h1 className="text-2xl font-bold text-center text-white mb-4">
                        Kontrol Reaksi Stream
                    </h1>

                    <div className="flex items-center justify-center mb-4">
                        <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className={`font-medium ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                            {isConnected ? 'Terhubung' : 'Tidak Terhubung'}
                        </span>
                    </div>

                    <div className="flex items-center justify-center mb-4 p-3 bg-gray-700 rounded-lg">
                        <span className="text-gray-300">👤 {userName}</span>
                        <button
                            onClick={resetName}
                            className="ml-3 text-xs bg-gray-600 hover:bg-gray-500 text-gray-200 px-3 py-1 rounded transition-colors"
                        >
                            Ganti Nama
                        </button>
                    </div>

                    {recentReactions.length > 0 && (
                        <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-300 mb-2">Reaksi Terakhir:</h3>
                            <div className="flex flex-wrap gap-2">
                                {recentReactions.map((reaction: ReactionData) => (
                                    <div key={reaction.id} className="flex items-center gap-1 text-sm bg-gray-800 px-2 py-1 rounded">
                                        <span className="text-lg">{reaction.emoji}</span>
                                        <span className="text-gray-300">{reaction.userName}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {reactionButtons.map((reaction) => (
                        <button
                            key={reaction.emoji}
                            onClick={() => sendReaction(reaction.emoji)}
                            disabled={!isConnected || isLoading}
                            className="bg-gray-800 rounded-lg shadow-lg p-6 text-center transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 focus:ring-2 focus:ring-gray-600"
                        >
                            <div className="text-4xl mb-2">{reaction.emoji}</div>
                            <div className="text-sm font-medium text-gray-300">{reaction.label}</div>
                        </button>
                    ))}
                </div>

                <div className="mt-6">
                    <footer className="bg-gray-800 rounded-lg shadow-lg p-4 text-center border border-gray-700">
                        <div className="text-gray-300">
                            <p className="text-sm">
                                Made with ❤️ by{' '}
                                <a
                                    href="https://hi.oktaa.my.id"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                                >
                                    oktaa.my.id
                                </a>
                            </p>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}
