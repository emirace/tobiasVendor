import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import dotenv from 'dotenv';
import cron from 'node-cron';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import uploadRouter from './routes/UploadRoutes.js';
import session from 'express-session';
import cookieSession from 'cookie-session';
import conversationRouter from './routes/conversationRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import commentRouter from './routes/commentRoustes.js';
import categoryRouter from './routes/categoryRoutes.js';
import reportRouter from './routes/reportRoutes.js';
import reportConversionRouter from './routes/reportConversationRoutes.js';
import cors from 'cors';
import addressRouter from './routes/addressRoutes.js';
import brandRouter from './routes/brandRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import recentViewRouter from './routes/recentViewRoutes.js';
import nonLoginRouter from './routes/nonLoginRoutes.js';
import couponRouter from './routes/couponRoutes.js';
import accountRouter from './routes/accountRoutes.js';
import bestsellerRouter from './routes/bestsellerRoutes.js';
import returnRouter from './routes/returnRoutes.js';
import transactionRouter from './routes/transactionRoutes.js';
import Notification from './models/notificationModel.js';
import cartItemRouter from './routes/cartRoutes.js';
import locationRouter from './routes/locationRoutes.js';
import paymentRouter from './routes/paymentRoutes.js';
import User from './models/userModel.js';
import newsletterRouter from './routes/newsletterRoutes.js';
import { sendEmail, sendWeeklyMail } from './utils.js';
import guestUserRouter from './routes/guestUserRoutes.js';
import redirectRouter from './routes/redirectRoutes.js';
import rebundleSellerRouter from './routes/rebundleSellerRoutes.js.js';
import expoPushTokenRouter from './routes/expoPushTokenRoutes.js';
import gigRouter from './routes/gigRoutes.js';
import otherBrandRouter from './routes/otherBrandRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import Product from './models/productModel.js';
import fs from 'fs';
import articleRouter from './routes/articleRoutes.js';
import Mixpanel from 'mixpanel';
import contactRouter from './routes/contactRoutes.js';
import Order from './models/orderModel.js';
import Payment from './models/paymentModel.js';
import Category from './models/categoryModel.js';

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

var mixpanel = Mixpanel.init(process.env.MIXPANEL);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://localhost:3000',
      'http://localhost:19006',
      'http://repeddle.com',
      'http://www.repeddle.com',
      'https://repeddle.com',
      'https://www.repeddle.com',
      'http://repeddle.co.za',
      'http://www.repeddle.co.za',
      'https://repeddle.co.za',
      'https://www.repeddle.co.za',
    ],
  })
);
function textfuncion() {
  console.log('running cron');
}

cron.schedule('0 12 * * 1', sendWeeklyMail);

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000 * 30,
    keys: [process.env.COOKIE_KEY],
  })
);

app.use(session({ secret: 'SECRET', resave: true, saveUninitialized: true }));

app.get('/api/keys/flutterwave', (req, res) => {
  res.send(process.env.FLW_PUBLIC_KEY || 'sb');
});

app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

// const changeBrand = async () => {
//   // Define a regular expression pattern to match non-alphabet characters
//   const nonAlphabetPattern = { alpha: { $not: { $regex: /[A-Za-z]/ } } };
//   console.log("started,,,,,,");
//   // Update the "alpha" field for each matching brand to 'other'
//   const updateResult = await Brand.updateMany(nonAlphabetPattern, {
//     $set: { alpha: "other" },
//   });

//   // `updateResult` contains information about the update operation (number of documents updated, etc.)

//   console.log("Number of brands updated:", updateResult.nModified);
// };

// changeBrand();

// const deleteUserProduct = async () => {
//   const products = await Product.find({ sellerName: 'QUALITY SECONDS' });
//   console.log('total', products.length);
//   var n = 1;
//   for (const p of products) {
//     console.log('on', n);
//     await Product.findByIdAndDelete(p._id);

//     console.log(n, p.sellerName, p.name);
//     n += 1;
//   }
//   console.log('done');
// };

// deleteUserProduct();

app.use('/api/upload', uploadRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/conversations', conversationRouter);
app.use('/api/messages', messageRouter);
app.use('/api/comments', commentRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/reports', reportRouter);
app.use('/api/addresses', addressRouter);
app.use('/api/brands', brandRouter);
app.use('/api/admins', adminRouter);
app.use('/api/recentviews', recentViewRouter);
app.use('/api/nonLogin', nonLoginRouter);
app.use('/api/coupons', couponRouter);
app.use('/api/returns', returnRouter);
app.use('/api/accounts', accountRouter);
app.use('/api/locations', locationRouter);
app.use('/api/bestsellers', bestsellerRouter);
app.use('/api/newsletters', newsletterRouter);
app.use('/api/cartItems', cartItemRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/reportConversation', reportConversionRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/guestusers', guestUserRouter);
app.use('/api/redirects', redirectRouter);
app.use('/api/rebundleSellers', rebundleSellerRouter);
app.use('/api/expopushtoken', expoPushTokenRouter);
app.use('/api/gigs', gigRouter);
app.use('/api/otherbrands', otherBrandRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/articles', articleRouter);
app.use('/api/contacts', contactRouter);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('/product/:slug', async (req, res) => {
  const slug = req.params.slug;

  try {
    const product = await Product.findOne({ slug });

    if (!product) {
      return res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
    }

    const filePath = path.join(__dirname, '../frontend/build/index.html');
    let htmlData = await fs.promises.readFile(filePath, 'utf8');

    // Append meta tags to the existing header
    const metaTags = `
      <meta name="og:title" content="${product.name}" />
      <meta name="og:description" content="${product.description}" />
      <meta name="og:image" content="${product.image}" />
    `;
    const modifiedHtmlData = htmlData.replace('</head>', `${metaTags}</head>`);

    return res.send(modifiedHtmlData);
  } catch (error) {
    console.error('Error during file reading or database query:', error);
    return res.status(500).end();
  }
});

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;

const httpServer = http.Server(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000'],
  },
});

let users = [];

// Make the 'io' object available globally
app.set('io', io);

io.on('connection', (socket) => {
  console.log('user connected', socket.id);

  socket.on('disconnect', () => {
    const user = users.find((x) => x.socketId === socket.id);
    if (user) {
      mixpanel.track('User Disconnected', {
        distinct_id: user._id,
      });
      users = users.filter((user) => user.socketId !== socket.id);
      console.log('offline', user.username);
      const admin = users.find((x) => x.isAdmin);
      if (admin) {
        io.to(admin.socketId).emit('updatedUser', user);
      }
    }
    io.emit('getUsers', users);
  });
  socket.on('initialUsers', () => {
    io.emit('loadUsers', users);
    console.log('sending');
  });
  socket.on('onlogin', (user) => {
    const updatedUser = {
      ...user,
      socketId: socket.id,
    };
    mixpanel.track('User Connected', {
      distinct_id: user._id,
    });
    const existUser = users.find((x) => x._id === updatedUser._id);
    if (existUser) {
      existUser.socketId = socket.id;
    } else {
      users.push(updatedUser);
    }
    const admin = users.find((x) => x.isAdmin);
    if (admin) {
      io.to(admin.socketId).emit('updatedUser', updatedUser);
    }
    if (updatedUser.isAdmin) {
      io.to(updatedUser.socketId).emit('listUsers', users);
    }
    console.log('login', updatedUser.username);
    io.emit('getUsers', users);
  });
  socket.on('onUserSelected', (user) => {
    const admin = users.find((x) => x.isAdmin);
    if (admin) {
      const existUser = users.find((x) => x._id === user._id);
      io.to(admin.socketId).emit('selectedUser', existUser);
    }
  });
  socket.on('onMessage', (message) => {
    if (message.isAdmin) {
      const user = users.find((x) => x._id === message._id);
      if (user) {
        io.to(user.socketId).emit('message', message);
        user.messages.push(message);
      }
    } else {
      const admin = users.find((x) => x.isAdmin);
      if (admin) {
        io.to(admin.socketId).emit('message', message);
        const user = users.find((x) => x._id === message._id);
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

  socket.on('sendSupport', ({ message, senderId, receiverId, text }) => {
    const admins = users.filter((x) => x.isAdmin);
    admins.map((admin) => {
      io.to(admin.socketId).emit('getMessage', {
        senderId,
        text,
        message,
      });
    });
  });

  socket.on('sendReport', ({ report }) => {
    const user = users.find((x) => x._id === report.user);
    const admin = users.find((x) => x.isAdmin);
    if (user && report.admin) {
      io.to(user.socketId).emit('getReport', {
        report,
      });
    } else {
      if (admin) {
        io.to(admin.socketId).emit('getReport', {
          report,
        });
      }
    }
  });

  // Returning the initial  notification
  socket.on('initial_data', async ({ userId }) => {
    const notifications = await Notification.find({
      userId,
      createdAt: { $lt: new Date() },
    }).sort({ createdAt: -1 });

    const user = users.find((x) => x._id === userId);
    if (user) {
      io.to(user.socketId).emit('get_data', notifications);
    }
  });

  // Add notifications
  socket.on('post_data', async (body) => {
    const { userId, notifyType, userImage, itemId, msg, link, mobile } = body;
    if (userId === 'Admin') {
      const admins = await User.find({
        isAdmin: true,
      });
      admins.map(async (admin) => {
        const notification = new Notification({
          userId: admin._id,
          notifyType,
          itemId,
          msg,
          link,
          userImage,
          mobile,
        });
        await notification.save();
        io.sockets.emit('change_data');
      });
    } else {
      const notification = new Notification({
        userId,
        notifyType,
        itemId,
        msg,
        link,
        userImage,
        mobile,
      });
      await notification.save();
      io.sockets.emit('change_data');
    }
  });

  // mark as read
  socket.on('remove_notifications', async (id) => {
    const currentDateTime = new Date();
    const notifications = await Notification.find({
      itemId: id,
      read: false,
      createdAt: { $lte: currentDateTime },
    });

    notifications.forEach(async (notification) => {
      notification.read = true;
      await notification.save();
    });

    io.sockets.emit('change_data');
  });
  // mark as read
  socket.on('remove_id_notifications', async (id) => {
    const currentDateTime = new Date();
    const notification = await Notification.findOne({
      _id: id,
      createdAt: { $lte: currentDateTime },
    });

    if (notification) {
      notification.read = true;
      await notification.save();
    }

    io.sockets.emit('change_data');
  });
});

httpServer.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
// app.listen(port, () => {
//  console.log(`serve at http://localhost:${port}`);
//});
