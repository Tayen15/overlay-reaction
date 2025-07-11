'use client';

import { useState } from 'react';

export default function ControlVercelPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastReaction, setLastReaction] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const sendReaction = async (emoji: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setConnectionStatus('sending');
    
    try {
      const response = await fetch('/api/reactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emoji,
          timestamp: Date.now(),
          id: Math.random().toString(36).substring(7)
        }),
      });

      if (response.ok) {
        setLastReaction(emoji);
        setConnectionStatus('success');
        console.log(`Sent reaction: ${emoji}`);
        
        // Reset status after 1 second
        setTimeout(() => setConnectionStatus('idle'), 1000);
      } else {
        throw new Error('Failed to send reaction');
      }
    } catch (error) {
      console.error('Error sending reaction:', error);
      setConnectionStatus('error');
      
      // Reset status after 2 seconds
      setTimeout(() => setConnectionStatus('idle'), 2000);
    } finally {
      setIsLoading(false);
    }
  };

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

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'sending': return 'bg-blue-500';
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'sending': return 'Mengirim...';
      case 'success': return 'Berhasil!';
      case 'error': return 'Error!';
      default: return 'Siap';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Kontrol Reaksi Stream
            <span className="block text-sm font-normal text-gray-500">
              (Vercel Version)
            </span>
          </h1>
          
          <div className="flex items-center justify-center mb-4">
            <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor()}`}></div>
            <span className={`font-medium ${
              connectionStatus === 'success' ? 'text-green-600' : 
              connectionStatus === 'error' ? 'text-red-600' : 
              connectionStatus === 'sending' ? 'text-blue-600' : 'text-gray-600'
            }`}>
              {getStatusText()}
            </span>
          </div>

          {lastReaction && (
            <div className="mb-4 p-3 bg-gray-100 rounded-lg text-center">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Reaksi Terakhir:</h3>
              <div className="text-3xl">{lastReaction}</div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {reactionButtons.map((reaction) => (
            <button
              key={reaction.emoji}
              onClick={() => sendReaction(reaction.emoji)}
              disabled={isLoading}
              className="bg-white rounded-lg shadow-lg p-6 text-center transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-4xl mb-2">{reaction.emoji}</div>
              <div className="text-sm font-medium text-gray-600">{reaction.label}</div>
            </button>
          ))}
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Cara Penggunaan (Vercel):</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Menggunakan Server-Sent Events (SSE)</li>
            <li>• Kompatibel dengan deployment Vercel</li>
            <li>• Tekan tombol untuk mengirim reaksi</li>
            <li>• Reaksi akan muncul di overlay</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
