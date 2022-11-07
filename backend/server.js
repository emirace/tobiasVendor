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
app.use("/api/email", async (req, res) => {
  const url = "com";
  const returned = {
    _id: "6344e35552987aee285f54cd",
    orderId: {
      _id: "6344dd023d8dcc41550b13da",
      orderItems: [
        {
          _id: "6311c79762d17b63ee0171ea",
          name: "Black Sleeveless Turtleneck Top",
          sellerName: "text",
          seller: {
            _id: "6311bbb008a7269433b575d5",
            username: "text",
            image:
              "https://res.cloudinary.com/emirace/image/upload/v1662106705/hovxuvpllq2kqkx0hqkq.jpg",
            sold: [
              "6311c79762d17b63ee0171ea",
              "6311c79762d17b63ee0171ea",
              "6311c79762d17b63ee0171ea",
              "6311c79762d17b63ee0171ea",
              "6311c79762d17b63ee0171ea",
              "6311c79762d17b63ee0171ea",
              "6311c79762d17b63ee0171ea",
              "6311c79762d17b63ee0171ea",
              "6311c79762d17b63ee0171ea",
              "6311c79762d17b63ee0171ea",
              "6311c79762d17b63ee0171ea",
              "6311c79762d17b63ee0171ea",
              "6311c79762d17b63ee0171ea",
              "6311c79762d17b63ee0171ea",
              "6311c79762d17b63ee0171ea",
              "6311c79762d17b63ee0171ea",
              "6311c79762d17b63ee0171ea",
              "6311c79762d17b63ee0171ea",
              "6311c79762d17b63ee0171ea",
              "6311c79762d17b63ee0171ea",
              "6311c79762d17b63ee0171ea",
              "6311c79762d17b63ee0171ea",
              "6311c79762d17b63ee0171ea",
              "6311c79762d17b63ee0171ea",
              "6311c79762d17b63ee0171ea",
              "6311c79762d17b63ee0171ea",
              "6311c79762d17b63ee0171ea",
              "6311c79762d17b63ee0171ea",
            ],
            rating: 3,
            numReviews: 1,
          },
          slug: "black-sleeveless-turtleneck-top",
          image:
            "https://res.cloudinary.com/emirace/image/upload/v1662109438/e2ylfar3gh585hok6zth.jpg",
          images: ["", "", ""],
          tags: ["black"],
          brand: "A Fine Mess",
          color: "black",
          category: "CLOTHING",
          product: "6311c79762d17b63ee0171ea",
          subCategory: "Tops",
          material: "Cotton",
          description: "khvyy",
          sizes: [
            {
              size: "S",
              value: "02",
            },
          ],
          deliveryOption: [
            {
              name: "Pick up from Seller",
              value: 1,
            },
            {
              name: "Paxi PEP store",
              value: "59.95",
            },
            {
              name: "PUDO Locker-to-Locker",
              value: "40",
            },
            {
              name: "PostNet-to-PostNet",
              value: "99.99",
            },
            {
              name: "Aramex Store-to-Door",
              value: "99.99",
            },
          ],
          condition: "New with Tags",
          shippingLocation: "South African",
          keyFeatures: "Camo",
          specification: "ihgjkh",
          price: 180,
          actualPrice: 171,
          rating: 2.6666666666666665,
          currency: "R ",
          numReviews: 3,
          likes: ["631312ac6ac50ac8cf472968"],
          sold: true,
          active: true,
          vintage: false,
          luxury: false,
          countInStock: 9,
          region: "ZAR",
          createdAt: "2022-09-02T09:06:31.704Z",
          updatedAt: "2022-10-10T23:45:01.303Z",
          __v: 22,
          shares: ["631312ac6ac50ac8cf472968", "6311bbb008a7269433b575d5"],
          reviews: [
            {
              name: "631312ac6ac50ac8cf472968",
              comment: "good",
              rating: 2,
              like: "yes",
              _id: "6338a70535e25a4de61746bc",
              createdAt: "2022-10-01T20:45:57.621Z",
              updatedAt: "2022-10-01T20:45:57.621Z",
            },
            {
              name: "631312ac6ac50ac8cf472968",
              comment: "the ",
              rating: 3,
              like: "yes",
              _id: "633a14a44235ce83c9c37711",
              createdAt: "2022-10-02T22:45:56.192Z",
              updatedAt: "2022-10-02T22:45:56.192Z",
            },
            {
              user: "631312ac6ac50ac8cf472968",
              name: "emirace",
              comment: "ihgh",
              rating: 3,
              like: "no",
              _id: "633a16720ff7c70f11d380f0",
              createdAt: "2022-10-02T22:53:39.055Z",
              updatedAt: "2022-10-02T22:53:39.055Z",
            },
          ],
          quantity: 1,
          selectSize: "S",
          deliverySelect: {
            "delivery Option": "Aramex Store-to-Door",
            cost: "99.99",
            name: "Emmanuel Ikechukwu Akwuba",
            phone: "+2349036168775",
            email: "emmanuelakwuba57@gmail.com",
            address:
              "7 1st Avenue off Christ mary. 1 obaze lane, off upper mission Rd.",
            suburb: "Benin",
            city: "Benin",
            postalcode: "300271",
            province: "Edo",
          },
          deliveryStatus: "Return Approved",
          deliveredAt: 1665459086860,
        },
      ],
      user: {
        _id: "631312ac6ac50ac8cf472968",
        username: "emirace",
        image: "/images/pimage.png",
        email: "emmanuelakwuba57@gmail.com",
      },
    },
    productId: {
      _id: "6311c79762d17b63ee0171ea",
      name: "Black Sleeveless Turtleneck Top",
      seller: {
        _id: "6311bbb008a7269433b575d5",
        username: "text",
        email: "emiracegroup@gmail.com",
        image:
          "https://res.cloudinary.com/emirace/image/upload/v1662106705/hovxuvpllq2kqkx0hqkq.jpg",
      },
      image:
        "https://res.cloudinary.com/emirace/image/upload/v1662109438/e2ylfar3gh585hok6zth.jpg",
      actualPrice: 171,
    },
    sellerId: "6311bbb008a7269433b575d5",
    reason: "Product condition is significantly not as described",
    sending: {
      deliveryOption: "Aramex Store-to-Door",
      cost: "99.99",
      name: "Emmanuel Ikechukwu Akwuba",
      phone: "+2349036168775",
      email: "emmanuelakwuba57@gmail.com",
      address:
        "7 1st Avenue off Christ mary. 1 obaze lane, off upper mission Rd.",
      suburb: "Benin",
      city: "Benin",
      postalcode: "300271",
      province: "Edo",
    },
    refund: "Refund to my original payment method",
    image: "",
    others: "hgfy",
    region: "ZAR",
    comfirmDelivery: null,
    status: "Approve",
    createdAt: "2022-10-11T03:30:29.738Z",
    updatedAt: "2022-10-11T03:31:26.151Z",
    __v: 0,
  };

  try {
    switch ("Decline") {
      case "Decline":
        sendEmail({
          to: returned.orderId.user.email,
          subject: "ORDER RETURN DECLINED",
          template: "returnDeclineBuyer",
          context: {
            username: returned.orderId.user.username,
            orderId: returned.orderId._id,
            returnId: returned._id,
            declineReason: req.body.adminReason,
            url,
          },
        });
        break;
      case "Approve":
        sendEmail({
          to: returned.orderId.user.email,
          subject: "ORDER RETURN APPROVED",
          template: "returnAppoveBuyer",
          context: {
            username: returned.orderId.user.username,
            orderId: returned.orderId._id,
            returnId: returned._id,
            url,
          },
        });

        sendEmail({
          to: returned.productId.seller.email,
          subject: "ORDER RETURN APPROVED",
          template: "returnAppoveSeller",
          context: {
            username: returned.productId.seller.username,
            orderId: returned.orderId._id,
            returnId: returned._id,
            reason: returned.reason,
            url,
          },
        });
        break;

      default:
        break;
    }
    res.send("Email sent");
  } catch (error) {
    console.log(error);
    res.send("Email not sent");
  }
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
    const notifications = await Notification.find({ itemId: id });

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
