const { createServer } = require('http');
const next = require('next');
const { Server: SocketIOServer } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
     const httpServer = createServer(handler);

     const io = new SocketIOServer(httpServer, {
          cors: {
               origin: "*",
               methods: ["GET", "POST"]
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

     httpServer
          .once('error', (err) => {
               console.error(err);
               process.exit(1);
          })
          .listen(port, () => {
               console.log(`> Ready on http://${hostname}:${port}`);
          });
});
