'use client';

import { useEffect, useState } from 'react';

interface Reaction {
  id: string;
  emoji: string;
  userName: string;
  x: number;
  y: number;
  timestamp: number;
}

export default function OverlayVercelPage() {
  const [reactions, setReactions] = useState<Reaction[]>([]);

  useEffect(() => {
    const eventSource = new EventSource('/api/reactions');

    eventSource.onopen = () => {
      console.log('Overlay connected to SSE');
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'reaction') {
          const newReaction: Reaction = {
            id: data.id || `${Date.now()}-${Math.random()}`,
            emoji: data.emoji,
            userName: data.userName || 'Anonymous',
            x: Math.random() * (window.innerWidth - 200), // Leave space for name
            y: window.innerHeight - 100, // Start from bottom
            timestamp: data.timestamp
          };

          setReactions(prev => [...prev, newReaction]);

          // Remove reaction after animation duration
          setTimeout(() => {
            setReactions(prev => prev.filter(r => r.id !== newReaction.id));
          }, 7000);
        }
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {reactions.map((reaction) => (
          <div
            key={reaction.id}
            className="absolute flex flex-col items-center pointer-events-none select-none"
            style={{
              left: `${reaction.x}px`,
              top: `${reaction.y}px`,
              animation: 'float-up-with-name 7s ease-out forwards',
            }}
          >
            <div className="text-6xl mb-2" style={{ 
              filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)' 
            }}>
              {reaction.emoji}
            </div>
            <div className="text-white text-sm font-semibold px-2 py-1 bg-black/50 rounded-full backdrop-blur-sm border border-white/20">
              {reaction.userName}
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes float-up-with-name {
          0% {
            transform: translateY(0) rotate(0deg) scale(0.3);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: translateY(-80px) rotate(3deg) scale(1);
          }
          50% {
            transform: translateY(-350px) rotate(-2deg) scale(1.1);
            opacity: 1;
          }
          100% {
            transform: translateY(-600px) rotate(5deg) scale(0.8);
            opacity: 0;
          }
        }

        body {
          margin: 0;
          padding: 0;
          background: transparent !important;
          overflow: hidden;
        }

        html {
          background: transparent !important;
        }
      `}</style>
    </>
  );
}
