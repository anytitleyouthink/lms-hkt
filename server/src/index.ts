import express from 'express';
import databaseService from './services/database.services';
import cookieParser from 'cookie-parser'
import { defaultErrorHandler } from './middlewares/error.middlewares';
import cors from 'cors'
import rootRouter from './routes/index.routes';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { setupChatSocket } from './sockets/chat.sockets';

const app = express()
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' } // Allow all origins for the socket. Adjust in production
});
const port = 4000
app.use(cors())
app.use(cookieParser())
app.use(express.json())
databaseService.connect().then(() => {
  databaseService.setupAllIndexes()
})
app.use("/", rootRouter)
app.use(defaultErrorHandler);

setupChatSocket(io);

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port} with Socket.io`)
})
