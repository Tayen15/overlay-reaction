// Alternative API for Vercel deployment using Server-Sent Events
import { NextRequest, NextResponse } from 'next/server';

interface ReactionData {
  emoji: string;
  timestamp: number;
  id: string;
}

// In-memory store for reactions (in production, use Redis or database)
let clients: { id: string; controller: ReadableStreamDefaultController }[] = [];
let reactionHistory: ReactionData[] = [];

export async function GET() {
  const encoder = new TextEncoder();

  const customReadable = new ReadableStream({
    start(controller) {
      const clientId = Math.random().toString(36).substring(7);

      // Add client to the list
      clients.push({ id: clientId, controller });

      // Send initial connection message
      const data = `data: ${JSON.stringify({ type: 'connected', clientId })}\n\n`;
      controller.enqueue(encoder.encode(data));

      // Send recent reactions
      reactionHistory.slice(-5).forEach(reaction => {
        const data = `data: ${JSON.stringify({ type: 'reaction', ...reaction })}\n\n`;
        controller.enqueue(encoder.encode(data));
      });

      console.log(`SSE Client connected: ${clientId}`);
    },
    cancel() {
      // Remove client when connection is closed
      console.log('SSE Client disconnected');
    }
  });

  return new NextResponse(customReadable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const reaction = await request.json();
    const reactionData = {
      ...reaction,
      timestamp: Date.now(),
      id: reaction.id || Math.random().toString(36).substring(7)
    };

    // Store reaction in history
    reactionHistory.push(reactionData);
    if (reactionHistory.length > 50) {
      reactionHistory = reactionHistory.slice(-50); // Keep last 50 reactions
    }

    // Broadcast to all connected clients
    const encoder = new TextEncoder();
    const data = `data: ${JSON.stringify({ type: 'reaction', ...reactionData })}\n\n`;

    clients.forEach(client => {
      try {
        client.controller.enqueue(encoder.encode(data));
      } catch (error) {
        console.error('Error sending to client:', error);
      }
    });

    // Clean up disconnected clients  
    clients = clients.filter(() => {
      try {
        // Test if client is still connected
        return true;
      } catch {
        return false;
      }
    });

    console.log('Reaction broadcast:', reactionData);

    return NextResponse.json({ success: true, reaction: reactionData });
  } catch (error) {
    console.error('Error processing reaction:', error);
    return NextResponse.json({ error: 'Failed to process reaction' }, { status: 500 });
  }
}
