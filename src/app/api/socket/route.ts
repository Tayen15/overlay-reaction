import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

interface SocketServerResponse extends Response {
     socket?: {
          server?: HTTPServer & {
               io?: SocketIOServer;
          };
     };
}

export async function GET() {
     const res = new Response() as SocketServerResponse;

     if (!res.socket?.server?.io) {
          console.log('*First use, starting socket.io');

          const httpServer = res.socket?.server as HTTPServer;
          const io = new SocketIOServer(httpServer, {
               path: '/api/socketio',
               addTrailingSlash: false,
               cors: {
                    origin: '*',
                    methods: ['GET', 'POST']
               }
          });

          io.on('connection', (socket) => {
               console.log('A user connected:', socket.id);

               socket.on('reaction', (data) => {
                    console.log('Reaction received:', data);
                    // Broadcast reaction to all connected clients (including OBS)
                    io.emit('reaction', data);
               });

               socket.on('disconnect', () => {
                    console.log('User disconnected:', socket.id);
               });
          });

          if (res.socket?.server) {
               res.socket.server.io = io;
          }
     } else {
          console.log('socket.io already running');
     }

     return new Response('Socket is running', { status: 200 });
}
