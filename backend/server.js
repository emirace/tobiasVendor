import express from "express";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import dotenv from "dotenv";
import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import uploadRouter from "./routes/UploadRoutes.js";
import session from "express-session";
import cookieSession from "cookie-session";
import conversationRouter from "./routes/conversationRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import commentRouter from "./routes/commentRoustes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import reportRouter from "./routes/reportRoutes.js";
import reportConversionRouter from "./routes/reportConversationRoutes.js";
import cors from "cors";
import addressRouter from "./routes/addressRoutes.js";
import brandRouter from "./routes/brandRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import recentViewRouter from "./routes/recentViewRoutes.js";
import nonLoginRouter from "./routes/nonLoginRoutes.js";
import couponRouter from "./routes/couponRoutes.js";
import accountRouter from "./routes/accountRoutes.js";
import bestsellerRouter from "./routes/bestsellerRoutes.js";
import returnRouter from "./routes/returnRoutes.js";
import transactionRouter from "./routes/transactionRoutes.js";
import Notification from "./models/notificationModel.js";
import cartItemRouter from "./routes/cartRoutes.js";
import locationRouter from "./routes/locationRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import User from "./models/userModel.js";
import newsletterRouter from "./routes/newsletterRoutes.js";
import { sendEmail } from "./utils.js";
import guestUserRouter from "./routes/guestUserRoutes.js";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log("the error is " + err.message);
  });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://localhost:3000",
      "http://localhost:19006",
      "http://repeddle.com",
      "http://www.repeddle.com",
      "https://repeddle.com",
      "https://www.repeddle.com",
      "http://repeddle.co.za",
      "http://www.repeddle.co.za",
      "https://repeddle.co.za",
      "https://www.repeddle.co.za",
    ],
  })
);

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000 * 30,
    keys: [process.env.COOKIE_KEY],
  })
);

app.use(session({ secret: "SECRET", resave: true, saveUninitialized: true }));

app.get("/api/keys/flutterwave", (req, res) => {
  console.log(process.env.FLW_PUBLIC_KEY);
  res.send(process.env.FLW_PUBLIC_KEY || "sb");
});

app.get("/api/keys/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});

app.use("/api/upload", uploadRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/messages", messageRouter);
app.use("/api/comments", commentRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/reports", reportRouter);
app.use("/api/addresses", addressRouter);
app.use("/api/brands", brandRouter);
app.use("/api/admins", adminRouter);
app.use("/api/recentviews", recentViewRouter);
app.use("/api/nonLogin", nonLoginRouter);
app.use("/api/coupons", couponRouter);
app.use("/api/returns", returnRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/locations", locationRouter);
app.use("/api/bestsellers", bestsellerRouter);
app.use("/api/newsletters", newsletterRouter);
app.use("/api/cartItems", cartItemRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/reportConversation", reportConversionRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/guestusers", guestUserRouter);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"))
);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;

const httpServer = http.Server(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

let users = [];

io.on("connection", (socket) => {
  console.log("user connected", socket.id);
  socket.on("disconnect", () => {
    const user = users.find((x) => x.socketId === socket.id);
    if (user) {
      users = users.filter((user) => user.socketId !== socket.id);
      console.log("offline", user.username);
      const admin = users.find((x) => x.isAdmin);
      if (admin) {
        io.to(admin.socketId).emit("updatedUser", user);
      }
    }
    io.emit("getUsers", users);
  });
  socket.on("onlogin", (user) => {
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
    const admin = users.find((x) => x.isAdmin);
    if (admin) {
      io.to(admin.socketId).emit("updatedUser", updatedUser);
    }
    if (updatedUser.isAdmin) {
      io.to(updatedUser.socketId).emit("listUsers", users);
    }
    console.log("login", updatedUser.username);
    io.emit("getUsers", users);
  });
  socket.on("onUserSelected", (user) => {
    const admin = users.find((x) => x.isAdmin);
    if (admin) {
      const existUser = users.find((x) => x._id === user._id);
      io.to(admin.socketId).emit("selectedUser", existUser);
    }
  });
  socket.on("onMessage", (message) => {
    if (message.isAdmin) {
      const user = users.find((x) => x._id === message._id);
      if (user) {
        io.to(user.socketId).emit("message", message);
        user.messages.push(message);
      }
    } else {
      const admin = users.find((x) => x.isAdmin);
      if (admin) {
        io.to(admin.socketId).emit("message", message);
        const user = users.find((x) => x._id === message._id);
        user.messages.push(message);
      } else {
        io.to(socket.id).emit("message", {
          name: "Admin",
          body: "Sorry, I am not online right now.",
        });
      }
    }
  });
  socket.on("sendMessage", ({ message, senderId, receiverId, text }) => {
    const user = users.find((x) => x._id === receiverId);
    if (user) {
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
        message,
      });
    }
  });

  socket.on("sendSupport", ({ message, senderId, receiverId, text }) => {
    const admins = users.filter((x) => x.isAdmin);
    admins.map((admin) => {
      io.to(admin.socketId).emit("getMessage", {
        senderId,
        text,
        message,
      });
    });
  });

  socket.on("sendReport", ({ report }) => {
    const user = users.find((x) => x._id === report.user);
    const admin = users.find((x) => x.isAdmin);
    if (user && report.admin) {
      io.to(user.socketId).emit("getReport", {
        report,
      });
    } else {
      if (admin) {
        io.to(admin.socketId).emit("getReport", {
          report,
        });
      }
    }
  });

  // Returning the initial  notification
  socket.on("initial_data", async ({ userId }) => {
    const notifications = await Notification.find({
      userId,
    }).sort({ createdAt: -1 });

    const user = users.find((x) => x._id === userId);
    if (user) {
      io.to(user.socketId).emit("get_data", notifications);
    }
  });

  // Add notifications
  socket.on("post_data", async (body) => {
    const { userId, notifyType, userImage, itemId, msg, link } = body;
    if (userId === "Admin") {
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
        });
        await notification.save();
        io.sockets.emit("change_data");
      });
    } else {
      const notification = new Notification({
        userId,
        notifyType,
        itemId,
        msg,
        link,
        userImage,
      });
      await notification.save();
      io.sockets.emit("change_data");
    }
  });

  // mark as read
  socket.on("remove_notifications", async (id) => {
    const notifications = await Notification.find({ itemId: id, read: false });

    notifications.forEach(async (notification) => {
      notification.read = true;
      await notification.save();
    });

    // await Notification.create(notifications)

    io.sockets.emit("change_data");
  });
  // mark as read
  socket.on("remove_id_notifications", async (id) => {
    const notification = await Notification.findById(id);

    if (notification) {
      notification.read = true;
      await notification.save();
    }

    // await Notification.create(notifications)

    io.sockets.emit("change_data");
  });
});

httpServer.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
// app.listen(port, () => {
//  console.log(`serve at http://localhost:${port}`);
//});
