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

app.get("/api/keys/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});
// app.use("/api/email", async (req, res) => {
//   const url = "com";
//   const order = {
//     _id: "63691020a10ea54d5d767c8c",
//     orderItems: [
//       {
//         _id: "631318516ac50ac8cf4729bf",
//         name: "Young Men Short Sleeve",
//         sellerName: "emirace",
//         seller: {
//           address: {
//             apartment: "plot",
//             street: "3 Bee road",
//             state: "Free State",
//             zipcode: 2,
//           },
//           _id: "631312ac6ac50ac8cf472968",
//           username: "emirace",
//           image: "/images/pimage.png",
//           email: "emmanuelakwuba57@gmail.com",
//           sold: [
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "63235a1a3c9ca3ee9d815b46",
//             "631318516ac50ac8cf4729bf",
//             "63235a1a3c9ca3ee9d815b46",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "63235a1a3c9ca3ee9d815b46",
//             "631318516ac50ac8cf4729bf",
//             "63235a1a3c9ca3ee9d815b46",
//             "63235a1a3c9ca3ee9d815b46",
//             "63235a1a3c9ca3ee9d815b46",
//             "63235a1a3c9ca3ee9d815b46",
//             "63235a1a3c9ca3ee9d815b46",
//             "63235a1a3c9ca3ee9d815b46",
//             "63235a1a3c9ca3ee9d815b46",
//             "63235a1a3c9ca3ee9d815b46",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "63235a1a3c9ca3ee9d815b46",
//             "63235a1a3c9ca3ee9d815b46",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "63235a1a3c9ca3ee9d815b46",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "63235a1a3c9ca3ee9d815b46",
//             "631318516ac50ac8cf4729bf",
//             "63235a1a3c9ca3ee9d815b46",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "63235a1a3c9ca3ee9d815b46",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "63519848365e3ca273e98633",
//             "63519848365e3ca273e98633",
//             "63519848365e3ca273e98633",
//             "63519848365e3ca273e98633",
//             "63519848365e3ca273e98633",
//             "63519848365e3ca273e98633",
//             "63519848365e3ca273e98633",
//             "63401c4b6a327648e2caba12",
//             "63401c4b6a327648e2caba12",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//             "631318516ac50ac8cf4729bf",
//           ],
//           rating: 3,
//           numReviews: 3,
//           region: "NGN",
//         },
//         slug: "young-men-short-sleeve",
//         image:
//           "https://res.cloudinary.com/emirace/image/upload/v1662195583/srjzwaihbid5oxh0tfh6.webp",
//         images: ["", "", ""],
//         tags: ["jean"],
//         brand: "A Is For Audrey",
//         color: "blue",
//         category: "CLOTHING",
//         product: "631318516ac50ac8cf4729bf",
//         subCategory: "Tops",
//         material: "Cloth",
//         description:
//           "The color of the actual jacket may be different from the picture because of different monitors and color rendering modes.",
//         sizes: [
//           {
//             size: "M",
//             value: "04",
//           },
//         ],
//         deliveryOption: [
//           {
//             name: "Pick up from Seller",
//             value: 1,
//           },
//           {
//             name: "Paxi PEP store",
//             value: "59.95",
//           },
//           {
//             name: "PUDO Locker-to-Locker",
//             value: "40",
//           },
//           {
//             name: "PostNet-to-PostNet",
//             value: "99.99",
//           },
//           {
//             name: "Aramex Store-to-Door",
//             value: "99.99",
//           },
//         ],
//         condition: "New with Tags",
//         shippingLocation: "Nigeria",
//         keyFeatures: "Plain",
//         specification:
//           "The color of the actual jacket may be different from the picture because of different monitors and color rendering modes.",
//         price: 210,
//         actualPrice: 199.5,
//         rating: 4,
//         currency: "N ",
//         numReviews: 1,
//         likes: [
//           "6317459789dfae6cedc8e90b",
//           "6317459789dfae6cedc8e90b",
//           "6321809eb09887ad99b3ceaa",
//         ],
//         sold: true,
//         active: true,
//         vintage: false,
//         luxury: false,
//         countInStock: 9,
//         region: "NGN",
//         reviews: [
//           {
//             name: "Emmanuel_757865",
//             comment: "came in as seen",
//             rating: 4,
//             like: "yes",
//             _id: "6325780047754d5f14086b1e",
//             createdAt: "2022-09-17T07:32:16.353Z",
//             updatedAt: "2022-09-17T07:32:16.353Z",
//           },
//         ],
//         createdAt: "2022-09-03T09:03:13.981Z",
//         updatedAt: "2022-11-06T18:29:10.050Z",
//         __v: 20,
//         shares: [
//           "6321809eb09887ad99b3ceaa",
//           "632165b19849f6b85993af77",
//           "631312ac6ac50ac8cf472968",
//         ],
//         userBuy: [
//           "632165b19849f6b85993af77",
//           "632165b19849f6b85993af77",
//           "6363826861111a4610e98372",
//           "6311bbb008a7269433b575d5",
//           "6311bbb008a7269433b575d5",
//         ],
//         quantity: 1,
//         selectSize: "M",
//         deliverySelect: {
//           "delivery Option": "Aramex Store-to-Door",
//           cost: "99.99",
//           name: "Emmanuel Ikechukwu Akwuba",
//           phone: "+2349036168775",
//           email: "emmanuelakwuba57@gmail.com",
//           address:
//             "7 1st Avenue off Christ mary. 1 obaze lane, off upper mission Rd.",
//           suburb: "Benin",
//           city: "Benin",
//           postalcode: "300271",
//           province: "x",
//         },
//         deliveryStatus: "Delivered",
//         deliveredAt: 1667834744020,
//         trackingNumber: "23455678976",
//       },
//     ],
//     paymentMethod: "Credit/Debit card",
//     itemsPrice: 199.5,
//     shippingPrice: 99.99,
//     taxPrice: 0,
//     totalPrice: 299.49,
//     seller: ["631312ac6ac50ac8cf472968"],
//     user: {
//       _id: "6369000a669d9bf87182b631",
//       username: "joe",
//       image: "/images/pimage.png",
//       email: "emirace@mail.com",
//     },
//     isPaid: true,
//     deliveryStatus: "Delivered",
//     region: "NGN",
//     createdAt: "2022-11-07T14:03:12.567Z",
//     updatedAt: "2022-11-07T15:25:44.026Z",
//     __v: 4,
//     orderId: "63691020a10ea54d5d767c8c",
//     paidAt: "2022-11-07T14:03:13.329Z",
//   };

//   try {
//     order.orderItems.map((x) => {
//       if (x._id === "631318516ac50ac8cf4729bf") {
//         const address =
//           x.deliverySelect["delivery Option"] === "Paxi PEP store"
//             ? x.deliverySelect["shortName"]
//             : x.deliverySelect["delivery Option"] === "PUDO Locker-to-Locker"
//             ? `${x.deliverySelect["shortName"]},${x.deliverySelect["province"]}`
//             : x.deliverySelect["delivery Option"] === "PostNet-to-PostNet"
//             ? `${x.deliverySelect["pickUp"]},${x.deliverySelect["province"]}`
//             : x.deliverySelect["address"];
//         return sendEmail({
//           to: order.user.email,
//           subject: "ORDER DELIVERED ",
//           template: "orderDelivered",
//           context: {
//             username: order.user.username,
//             url,
//             orderId: order._id,
//             address,
//             deliveryMethod: x.deliverySelect["delivery Option"],
//             orderItems: order.orderItems,
//           },
//         });
//       }
//     });
//     res.send("Email sent");
//   } catch (error) {
//     console.log(error);
//     res.send("Email not sent");
//   }
// });
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
    console.log("i am here");
    admins.map((admin) => {
      console.log("admin");
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
