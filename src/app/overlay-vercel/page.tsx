'use client';

import { useEffect, useState } from 'react';

interface Reaction {
  id: string;
  emoji: string;
  x: number;
  y: number;
  timestamp: number;
}

export default function OverlayVercelPage() {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let eventSource: EventSource;

    const connectSSE = () => {
      eventSource = new EventSource('/api/reactions');
      
      eventSource.onopen = () => {
        setIsConnected(true);
        console.log('SSE connection opened');
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'reaction') {
            const newReaction: Reaction = {
              id: data.id || Date.now().toString(),
              emoji: data.emoji,
              x: Math.random() * (window.innerWidth - 100),
              y: window.innerHeight + 50,
              timestamp: Date.now()
            };
            
            setReactions((prev) => [...prev, newReaction]);

            // Remove reaction after animation completes
            setTimeout(() => {
              setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
            }, 6000);
          }
        } catch (error) {
          console.error('Error parsing SSE data:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE error:', error);
        setIsConnected(false);
        
        // Reconnect after 3 seconds
        setTimeout(() => {
          if (eventSource.readyState === EventSource.CLOSED) {
            connectSSE();
          }
        }, 3000);
      };
    };

    connectSSE();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Connection indicator (only visible in dev) */}
        {process.env.NODE_ENV === 'development' && (
          <div className={`fixed top-4 right-4 px-3 py-1 rounded text-sm ${
            isConnected ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        )}
        
        {reactions.map((reaction) => (
          <div
            key={reaction.id}
            className="absolute text-6xl animate-float-up pointer-events-none select-none"
            style={{
              left: `${reaction.x}px`,
              bottom: '-100px',
              animationDuration: '6s',
              animationTimingFunction: 'ease-out',
              animationFillMode: 'forwards',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            {reaction.emoji}
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) rotate(0deg) scale(0.5);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: translateY(-50px) rotate(5deg) scale(1);
          }
          50% {
            transform: translateY(-300px) rotate(-5deg) scale(1.1);
            opacity: 1;
          }
          100% {
            transform: translateY(-500px) rotate(10deg) scale(0.8);
            opacity: 0;
          }
        }

        .animate-float-up {
          animation: float-up 6s ease-out forwards;
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
