'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket;

interface Reaction {
  id: string;
  emoji: string;
  x: number;
  y: number;
  timestamp: number;
}

interface ReactionData {
  id?: string;
  emoji: string;
  timestamp?: number;
}

export default function OverlayPage() {
  const [reactions, setReactions] = useState<Reaction[]>([]);

  useEffect(() => {
    const socketInitializer = async () => {
      // Initialize socket connection directly to server
      socket = io();

      socket.on('connect', () => {
        console.log('Overlay connected to socket');
      });

      socket.on('disconnect', () => {
        console.log('Overlay disconnected from socket');
      });

      socket.on('reaction', (data: ReactionData | string) => {
        const newReaction: Reaction = {
          id: typeof data === 'string' ? Date.now().toString() : (data.id || Date.now().toString()),
          emoji: typeof data === 'string' ? data : data.emoji,
          x: Math.random() * (window.innerWidth - 100), // Leave space for emoji
          y: window.innerHeight + 50, // Start below screen
          timestamp: Date.now()
        };
        
        setReactions((prev) => [...prev, newReaction]);

        // Remove reaction after animation completes
        setTimeout(() => {
          setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
        }, 6000); // 6 seconds for complete animation
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

  return (
    <>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {reactions.map((reaction) => (
          <div
            key={reaction.id}
            className="absolute text-6xl animate-float-up pointer-events-none select-none"
            style={{
              left: `${reaction.x}px`,
              bottom: '-100px', // Start from bottom
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
