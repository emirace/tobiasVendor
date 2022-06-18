import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import dotenv from 'dotenv';
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import uploadRouter from './routes/UploadRoutes.js';
import session from 'express-session';
import cookieSession from 'cookie-session';
import conversationRouter from './routes/conversationRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import commentRouter from './routes/commentRoustes.js';

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.log('the error is ' + err.message);
  });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000 * 30,
    keys: [process.env.COOKIE_KEY],
  })
);

app.use(session({ secret: 'SECRET', resave: true, saveUninitialized: true }));

app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

app.use('/api/upload', uploadRouter);
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/conversations', conversationRouter);
app.use('/api/messages', messageRouter);
app.use('/api/comments', commentRouter);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;

const httpServer = http.Server(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
  },
});
let users = [];

io.on('connection', (socket) => {
  console.log('user connected');
  socket.on('disconnect', () => {
    const user = users.find((x) => x.socketId === socket.id);
    if (user) {
      users = users.filter((user) => user.socketId !== socket.id);
      console.log('offline', user.name);
      const admin = users.find((x) => x.isAdmin && x.online);
      if (admin) {
        io.to(admin.socketId).emit('updatedUser', user);
      }
    }
    io.emit('getUsers', users);
  });
  socket.on('onlogin', (user) => {
    const updatedUser = {
      ...user,
      socketId: socket.id,
    };
    const existUser = users.find((x) => x._id === updatedUser._id);
    if (existUser) {
      existUser.socketId = socket.id;
    } else {
      users.push(updatedUser);
    }
    console.log('Online', user.name);
    const admin = users.find((x) => x.isAdmin && x.online);
    if (admin) {
      io.to(admin.socketId).emit('updatedUser', updatedUser);
    }
    if (updatedUser.isAdmin) {
      io.to(updatedUser.socketId).emit('listUsers', users);
    }
    io.emit('getUsers', users);
  });
  socket.on('onUserSelected', (user) => {
    const admin = users.find((x) => x.isAdmin && x.online);
    if (admin) {
      const existUser = users.find((x) => x._id === user._id);
      io.to(admin.socketId).emit('selectedUser', existUser);
    }
  });
  socket.on('onMessage', (message) => {
    if (message.isAdmin) {
      const user = users.find((x) => x._id === message._id && x.online);
      if (user) {
        io.to(user.socketId).emit('message', message);
        user.messages.push(message);
      }
    } else {
      const admin = users.find((x) => x.isAdmin && x.online);
      if (admin) {
        io.to(admin.socketId).emit('message', message);
        const user = users.find((x) => x._id === message._id && x.online);
        user.messages.push(message);
      } else {
        io.to(socket.id).emit('message', {
          name: 'Admin',
          body: 'Sorry, I am not online right now.',
        });
      }
    }
  });
  socket.on('sendMessage', ({ message, senderId, receiverId, text }) => {
    const user = users.find((x) => x._id === receiverId);
    if (user) {
      io.to(user.socketId).emit('getMessage', {
        senderId,
        text,
        message,
      });
    }
  });
});

httpServer.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
// app.listen(port, () => {
//  console.log(`serve at http://localhost:${port}`);
//});
