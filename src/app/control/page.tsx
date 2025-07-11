'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket;

export default function ControlPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [reactions, setReactions] = useState<string[]>([]);

  useEffect(() => {
    const socketInitializer = async () => {
      // Initialize socket connection directly to server
      socket = io();

      socket.on('connect', () => {
        setIsConnected(true);
        console.log('Connected to socket');
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
        console.log('Disconnected from socket');
      });

      socket.on('reaction', (data: { emoji: string } | string) => {
        console.log('Reaction received on control page:', data);
        const emoji = typeof data === 'string' ? data : data.emoji;
        setReactions(prev => [...prev.slice(-4), emoji]); // Keep last 5 reactions
      });
    };

    if (!socket) {
      socketInitializer();
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const sendReaction = (emoji: string) => {
    if (socket && isConnected) {
      socket.emit('reaction', {
        emoji,
        timestamp: Date.now(),
        id: Math.random().toString(36).substring(7)
      });
      console.log(`Sent reaction: ${emoji}`);
    } else {
      console.log('Socket not connected.');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Kontrol Reaksi Stream
          </h1>
          
          <div className="flex items-center justify-center mb-4">
            <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? 'Terhubung' : 'Tidak Terhubung'}
            </span>
          </div>

          {reactions.length > 0 && (
            <div className="mb-4 p-3 bg-gray-100 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Reaksi Terakhir:</h3>
              <div className="flex space-x-2">
                {reactions.map((reaction, index) => (
                  <span key={index} className="text-2xl">{reaction}</span>
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
              disabled={!isConnected}
              className="bg-white rounded-lg shadow-lg p-6 text-center transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-4xl mb-2">{reaction.emoji}</div>
              <div className="text-sm font-medium text-gray-600">{reaction.label}</div>
            </button>
          ))}
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Cara Penggunaan:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Pastikan terhubung ke internet</li>
            <li>• Tekan tombol reaksi untuk mengirim ke stream</li>
            <li>• Reaksi akan muncul di overlay OBS</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
