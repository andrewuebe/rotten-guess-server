import { Server as SocketServer, Socket as BaseSocket } from 'socket.io';
import jwt from 'jsonwebtoken';
import logger from './config/logger';


interface Socket extends BaseSocket {
  user: any; // Replace "any" with the type of your user object
}

const socketOptions = {
  cors: {
    origin: "http://localhost:8081", // replace with your frontend's origin
    methods: ["GET", "POST"],
    credentials: true
  }
};

export let io: SocketServer;
const socketsMap = new Map<string, Socket>(); // Save the socket objects in this map

export const initSocket = (server) => {
  io = new SocketServer(server, socketOptions);
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      return next(new Error("Invalid token"));
    }
    socket.user = decodedToken;
    socketsMap.set(socket.user.id, socket); // Add the socket object to the map
    next();
  });

  io.on('connection', (socket: Socket) => {
    logger.info('SOCKET_USER_CONNECTED', { userId: socket.user.id, lobbyToken: socket.user.lobby_token })
    socket.join(socket.user.lobby_token);

    // Emit to everyone in the room except for the user who just joined
    socket.broadcast.to(socket.user.lobby_token).emit('user-connected', socket.user);
  });

  return io;
}

export const getSocket = (userId: string): Socket => {
  if (!io) {
    throw new Error("Must call initSocket before getSocket");
  }

  const socket = socketsMap.get(userId); // Retrieve the socket object from the map
  if (!socket) {
    throw new Error(`Socket not found for user ${userId}`);
  }

  return socket;
};