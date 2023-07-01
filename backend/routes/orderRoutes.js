import express from "express";
import {
  isAuth,
  isAdmin,
  isSellerOrAdmin,
  isAuthOrNot,
  sendEmail,
  confirmPayfast,
  payShippingFee,
  checkStatus,
  setTimer,
} from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import mongoose from "mongoose";
import moment from "moment";
import axios from "axios";
import dotenv from "dotenv";
import Flutterwave from "flutterwave-node-v3";
import Transaction from "../models/transactionModel.js";
import Return from "../models/returnModel.js";
import RebundleSeller from "../models/rebuldleSellerModel.js";
import crypto from "crypto";

dotenv.config();
const flw = new Flutterwave(
  process.env.FLW_PUBLIC_KEY,
  process.env.FLW_SECRET_KEY
);

const today = moment().startOf("day");

const orderRouter = express.Router();

orderRouter.get(
  "/:region/admin",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { region } = req.params;
    const { query } = req;
    const searchQuery = query.q;
    const sort = query.sort;

    const queryFilter =
      searchQuery && searchQuery !== "all"
        ? {
            orderId: {
              $regex: searchQuery,
              $options: "i",
            },
          }
        : {};
    const sortFilter =
      sort && sort !== "all"
        ? sort === "Progress"
          ? {
              $or: [
                { deliveryStatus: "Dispatch" },
                { deliveryStatus: "In transit" },
                { deliveryStatus: "Not yet Dispatched" },
              ],
            }
          : {
              deliveryStatus: sort,
            }
        : {};
    const orders = await Order.find({ ...queryFilter, ...sortFilter, region })
      .sort({ createdAt: -1 })
      .populate("user", "username")
      .populate("seller", "username");
    res.send(orders);
  })
);

orderRouter.get(
  "/seller/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const { from, to } = query;
    const searchQuery = query.q;
    const queryFilter =
      searchQuery && searchQuery !== "all"
        ? {
            orderId: {
              $regex: searchQuery,
              $options: "i",
            },
          }
        : {};

    const seller = req.params.id;

    const orders = await Order.find({
      seller: { $in: [seller] },
      ...queryFilter,
      isPaid: true,
      createdAt: { $gte: new Date(from), $lte: new Date(to) },
    })
      .sort({ createdAt: -1 })
      .populate("user", "username");
    res.send(orders);
  })
);

orderRouter.post(
  "/:region",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { region } = req.params;
    var seller = [];
    req.body.orderItems.map((i) => {
      seller = [...new Set([...seller, i.seller])];
    });
    const newOrder = new Order({
      seller,
      orderItems: req.body.orderItems.map((x) => ({
        ...x,
        product: x._id,
        deliveryStatus: "Pending",
        deliveredAt: Date.now(),
      })),
      deliveryStatus: "Pending",
      deliveryMethod: req.body.deliveryMethod,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
      region,
    });
    const order = await newOrder.save();
    order.orderId = order._id.toString();
    const neworder = await order.save();
    res.status(201).send({ message: "New Order Created", order });
  })
);

orderRouter.get(
  "/:region/summary",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { region } = req.params;
    const { query } = req;
    const { from, to } = query;
    const orders = await Order.aggregate([
      { $match: { region } },
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          numSales: { $sum: "$totalPrice" },
        },
      },
    ]);
    const earnings = await Order.aggregate([
      { $match: { region, isPaid: true } },
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          numSales: { $sum: "$totalPrice" },
        },
      },
    ]);
    const users = await User.aggregate([
      { $match: { region } },
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const products = await Product.aggregate([
      { $match: { region } },
      {
        $group: {
          _id: null,
          numProducts: { $sum: 1 },
        },
      },
    ]);
    const dailyOrders = await Order.aggregate([
      {
        $match: {
          region,
          createdAt: { $gte: new Date(from), $lte: new Date(to) },
          isPaid: true,
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          sales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories = await Product.aggregate([
      { $match: { region } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({
      users,
      orders,
      dailyOrders,
      products,
      productCategories,
      earnings,
    });
  })
);
orderRouter.get(
  "/summary/user",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const { from, to } = query;
    const seller = mongoose.Types.ObjectId(req.user._id);
    const orders = await Order.aggregate([
      { $match: { seller: seller, isPaid: true } },
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          numSales: { $sum: "$totalPrice" },
        },
      },
    ]);
    const purchases = await Order.aggregate([
      { $match: { user: seller, isPaid: true } },
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          numSales: { $sum: "$totalPrice" },
        },
      },
    ]);
    const products = await Product.aggregate([
      { $match: { seller: seller } },
      {
        $group: {
          _id: null,
          numProducts: { $sum: 1 },
        },
      },
    ]);

    const todayProducts = await Product.aggregate([
      {
        $match: {
          seller: seller,
          createdAt: {
            $gte: today.toDate(),
            $lte: moment(today).endOf("day").toDate(),
          },
        },
      },
      {
        $group: {
          _id: null,
          numProducts: { $sum: 1 },
        },
      },
    ]);
    const dailyOrders = await Order.aggregate([
      {
        $match: {
          seller: seller,
          createdAt: { $gte: new Date(from), $lte: new Date(to) },
          isPaid: true,
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          sales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const todayOrders = await Order.aggregate([
      {
        $match: {
          seller: seller,
          createdAt: {
            $gte: today.toDate(),
            $lte: moment(today).endOf("day").toDate(),
          },
          isPaid: true,
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          sales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const todayPurchases = await Order.aggregate([
      {
        $match: {
          user: seller,
          createdAt: {
            $gte: today.toDate(),
            $lte: moment(today).endOf("day").toDate(),
          },
          isPaid: true,
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          sales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const dailyPurchase = await Order.aggregate([
      {
        $match: {
          user: seller,
          createdAt: { $gte: new Date(from), $lte: new Date(to) },
          isPaid: true,
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          sales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const dailyProducts = await Product.aggregate([
      {
        $match: {
          seller: seller,
          createdAt: { $gte: new Date(from), $lte: new Date(to) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          products: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const productCategories = await Product.aggregate([
      { $match: { seller: seller } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({
      orders,
      dailyOrders,
      purchases,
      products,
      productCategories,
      dailyProducts,
      dailyPurchase,
      todayOrders,
      todayPurchases,
      todayProducts,
    });
  })
);

orderRouter.get(
  "/mine",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const searchQuery = query.q;

    const queryFilter =
      searchQuery && searchQuery !== "all"
        ? {
            orderId: {
              $regex: searchQuery,
              $options: "i",
            },
          }
        : {};

    const orders = await Order.find({ user: req.user._id, ...queryFilter })
      .sort({ createdAt: -1 })
      .populate("user", "name")
      .limit(searchQuery && searchQuery !== "all" ? 10 : "");
    res.send(orders);
  })
);

orderRouter.get(
  "/:id",

  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
      .populate("orderItems.product")
      .populate("user", "image username lastName firstName");
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

// Helper function to retrieve the address based on the delivery options
const getAddress = (orderItem) => {
  const deliveryOption = orderItem.deliverySelect["delivery Option"];
  const address = orderItem.deliverySelect.address;

  if (deliveryOption === "Paxi PEP store") {
    return orderItem.deliverySelect.shortName;
  } else if (deliveryOption === "PUDO Locker-to-Locker") {
    return `${orderItem.deliverySelect.shortName}, ${orderItem.deliverySelect.province}`;
  } else if (deliveryOption === "PostNet-to-PostNet") {
    return `${orderItem.deliverySelect.pickUp}, ${orderItem.deliverySelect.province}`;
  }

  return address;
};

orderRouter.put(
  "/:id/deliver/:productId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const orderId = req.params.id;
      const productId = req.params.productId;
      const { deliveryStatus, trackingNumber, returnTrackingNumber } = req.body;

      const order = await Order.findById(orderId)
        .populate({
          path: "user",
          select: "email username",
        })
        .populate("orderItems.product");

      if (!order) {
        return res.status(404).send({ message: "Order not found" });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).send({ message: "Product not found" });
      }

      const isValidUser =
        req.user.isAdmin ||
        req.user._id.equals(order.user._id) ||
        req.user._id.equals(product.seller);

      if (!isValidUser) {
        return res.status(403).send({ message: "Access denied" });
      }

      const orderItemIndex = order.orderItems.findIndex((x) =>
        x._id.equals(productId)
      );
      if (orderItemIndex === -1) {
        return res.status(404).send({ message: "Order item not found" });
      }

      const orderItem = order.orderItems[orderItemIndex];

      if (checkStatus(deliveryStatus, orderItem.deliveryStatus)) {
        throw new Error(`You cannot ${deliveryStatus} again`);
      }

      orderItem.deliveryStatus = deliveryStatus;
      orderItem.deliveredAt = Date.now();
      orderItem.trackingNumber = trackingNumber || orderItem.trackingNumber;
      orderItem.returnTrackingNumber =
        returnTrackingNumber || orderItem.returnTrackingNumber;

      order.orderItems[orderItemIndex] = orderItem;
      order.deliveryStatus = deliveryStatus;

      await order.save();

      console.log("Change status:", deliveryStatus);

      const emailOptions = {
        to: "",
        subject: "",
        template: "",
        context: {},
      };

      switch (deliveryStatus) {
        case "Processing":
          emailOptions.to = order.user.email;
          emailOptions.subject = "PREPARING ORDER FOR DELIVERY";
          emailOptions.template = "preparingOrder";
          emailOptions.context = {
            username: order.user.username,
            url: orderItem.region === "NGN" ? "com" : "co.za",
            orderId: order._id,
            orderItems: order.orderItems,
          };
          break;
        case "Dispatched":
          emailOptions.to = order.user.email;
          emailOptions.subject = "ORDER DISPATCHED";
          emailOptions.template = "dispatchOrder";
          emailOptions.context = {
            username: order.user.username,
            url: orderItem.region === "NGN" ? "com" : "co.za",
            orderId: order._id,
            deliveryMethod: orderItem.deliverySelect["delivery Option"],
            orderItems: order.orderItems,
            trackId: orderItem.trackingNumber,
          };
          setTimer(
            order._id,
            orderItem._id,
            7,
            "You are running out of time to deliver"
          );
          break;
        case "In Transit":
          emailOptions.to = order.user.email;
          emailOptions.subject = "ORDER IN TRANSIT";
          emailOptions.template = "transitOrder";
          emailOptions.context = {
            username: order.user.username,
            url: orderItem.region === "NGN" ? "com" : "co.za",
            orderId: order._id,
            deliveryMethod: orderItem.deliverySelect["delivery Option"],
            orderItems: order.orderItems,
          };
          break;
        case "Delivered":
          emailOptions.to = order.user.email;
          emailOptions.subject = "ORDER DELIVERED";
          emailOptions.template = "orderDelivered";
          emailOptions.context = {
            username: order.user.username,
            url: orderItem.region === "NGN" ? "com" : "co.za",
            orderId: order._id,
            address: getAddress(orderItem),
            deliveryMethod: orderItem.deliverySelect["delivery Option"],
            orderItems: order.orderItems,
          };
          break;
        case "Received":
          emailOptions.to = orderItem.seller.email;
          emailOptions.subject = "ORDER RECEIVED";
          emailOptions.template = "orderReceive";
          emailOptions.context = {
            username: orderItem.seller.username,
            url: orderItem.region === "NGN" ? "com" : "co.za",
            orderId: order._id,
            orderItems: order.orderItems,
          };
          break;
        case "Return Dispatched":
          const returned = await Return.findOne({
            productId: orderItem._id,
            orderId: order._id,
          });

          emailOptions.to = orderItem.seller.email;
          emailOptions.subject = "ORDER RETURN DISPATCHED";
          emailOptions.template = "returnDispatched";
          emailOptions.context = {
            username: orderItem.seller.username,
            url: orderItem.region === "NGN" ? "com" : "co.za",
            orderId: order._id,
            deliveryMethod: orderItem.deliverySelect["delivery Option"],
            orderItems: [orderItem],
            trackId: orderItem.returnTrackingNumber,
            returnId: returned ? returned._id : "",
          };
          break;
        case "Return Delivered":
          emailOptions.to = orderItem.seller.email;
          emailOptions.subject = "RETURN DELIVERED";
          emailOptions.template = "returnDelivered";
          emailOptions.context = {
            username: orderItem.seller.username,
            url: orderItem.region === "NGN" ? "com" : "co.za",
            orderId: order._id,
            address: getAddress(orderItem),
            deliveryMethod: orderItem.deliverySelect["delivery Option"],
            returnId: returned ? returned._id : "",
            orderItems: [orderItem],
          };
          break;
        case "Return Received":
          emailOptions.to = order.user.email;
          emailOptions.subject = "RETURN RECEIVED";
          emailOptions.template = "returnReceived";
          emailOptions.context = {
            username: order.user.username,
            url: orderItem.region === "NGN" ? "com" : "co.za",
            orderId: order._id,
            orderItems: [orderItem],
            returnId: returned ? returned._id : "",
          };
          break;
        default:
          break;
      }

      if (emailOptions.to) {
        await sendEmail(emailOptions);
      }

      res.send({ message: "Order delivery status changed" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);

// orderRouter.put(
//   "/:id/deliver/:productId",
//   isAuth,
//   expressAsyncHandler(async (req, res) => {
//     try {
//       const order = await Order.findById(req.params.id)
//         .populate({
//           path: "user",
//           select: "email username",
//         })
//         .populate("orderItems.product");
//       const product = await Product.findById(req.params.productId);
//       const isValidUser = req.user.isAdmin
//         ? true
//         : req.user._id === order.user._id
//         ? true
//         : req.user._id === product.seller
//         ? true
//         : false;
//       if (!isValidUser) {
//         return res.status(404).send({ message: "Access denied" });
//       }

//       if (order) {
//         order.orderItems = order.orderItems.map((x) => {
//           if (x._id === req.params.productId) {
//             if (checkStatus(req.body.deliveryStatus, x.deliveryStatus)) {
//               throw { message: `You cannot ${req.body.deliveryStatus} again` };
//             }
//             return {
//               ...x,
//               deliveryStatus: req.body.deliveryStatus,
//               deliveredAt: Date.now(),
//               trackingNumber: req.body.trackingNumber
//                 ? req.body.trackingNumber
//                 : x.trackingNumber,
//               returnTrackingNumber: req.body.returnTrackingNumber
//                 ? req.body.returnTrackingNumber
//                 : x.returnTrackingNumber,
//             };
//           } else {
//             return x;
//           }
//         });
//         order.deliveryStatus = req.body.deliveryStatus;
//         await order.save();
//         console.log("change status", req.body.deliveryStatus);

//         switch (req.body.deliveryStatus) {
//           case "Processing":
//             order.orderItems.map((x) => {
//               if (x._id === req.params.productId) {
//                 sendEmail({
//                   to: order.user.email,
//                   subject: "PREPARING ORDER FOR DELIVERY",
//                   template: "preparingOrder",
//                   context: {
//                     username: order.user.username,
//                     url: x.region === "NGN" ? "com" : "co.za",
//                     orderId: order._id,
//                     orderItems: order.orderItems,
//                   },
//                 });
//               }
//             });
//             break;
//           case "Dispatched":
//             order.orderItems.map((x) => {
//               if (x._id === req.params.productId) {
//                 return sendEmail({
//                   to: order.user.email,
//                   subject: "ORDER DISPATCHED",
//                   template: "dispatchOrder",
//                   context: {
//                     username: order.user.username,
//                     url: x.region === "NGN" ? "com" : "co.za",
//                     orderId: order._id,
//                     deliveryMethod: x.deliverySelect["delivery Option"],
//                     orderItems: order.orderItems,
//                     trackId: x.trackingNumber,
//                   },
//                 });
//               }
//             });

//             break;
//           case "In Transit":
//             console.log("change status to transit");
//             order.orderItems.map((x) => {
//               if (x._id === req.params.productId) {
//                 return sendEmail({
//                   to: order.user.email,
//                   subject: "ORDER IN TRANSIT ",
//                   template: "transitOrder",
//                   context: {
//                     username: order.user.username,
//                     url: x.region === "NGN" ? "com" : "co.za",
//                     orderId: order._id,
//                     deliveryMethod: x.deliverySelect["delivery Option"],
//                     orderItems: order.orderItems,
//                   },
//                 });
//               }
//             });

//             break;
//           case "Delivered":
//             console.log("change status to dilivered");
//             order.orderItems.map((x) => {
//               if (x._id === req.params.productId) {
//                 const address =
//                   x.deliverySelect["delivery Option"] === "Paxi PEP store"
//                     ? x.deliverySelect["shortName"]
//                     : x.deliverySelect["delivery Option"] ===
//                       "PUDO Locker-to-Locker"
//                     ? `${x.deliverySelect["shortName"]},${x.deliverySelect["province"]}`
//                     : x.deliverySelect["delivery Option"] ===
//                       "PostNet-to-PostNet"
//                     ? `${x.deliverySelect["pickUp"]},${x.deliverySelect["province"]}`
//                     : x.deliverySelect["address"];
//                 return sendEmail({
//                   to: order.user.email,
//                   subject: "ORDER DELIVERED ",
//                   template: "orderDelivered",
//                   context: {
//                     username: order.user.username,
//                     url: x.region === "NGN" ? "com" : "co.za",
//                     orderId: order._id,
//                     address,
//                     deliveryMethod: x.deliverySelect["delivery Option"],
//                     orderItems: order.orderItems,
//                   },
//                 });
//               }
//             });

//             break;
//           case "Received":
//             order.orderItems.map((x) => {
//               if (x._id === req.params.productId) {
//                 return sendEmail({
//                   to: x.seller.email,
//                   subject: "ORDER RECEIVED ",
//                   template: "orderReceive",
//                   context: {
//                     username: x.seller.username,
//                     url: x.region === "NGN" ? "com" : "co.za",
//                     orderId: order._id,
//                     orderItems: order.orderItems,
//                   },
//                 });
//               }
//             });

//             break;
//           case "Return Dispatched":
//             order.orderItems.map(async (x) => {
//               if (x._id === req.params.productId) {
//                 const returned = await Return.findOne({
//                   productId: x._id,
//                   orderId: order._id,
//                 });
//                 console.log("returned", returned._id);
//                 return sendEmail({
//                   to: x.seller.email,
//                   subject: "ORDER RETURN DISPATCHED",
//                   template: "returnDispatched",
//                   context: {
//                     username: x.seller.username,
//                     url: x.region === "NGN" ? "com" : "co.za",
//                     orderId: order._id,
//                     deliveryMethod: x.deliverySelect["delivery Option"],
//                     orderItems: [x],
//                     trackId: x.returnTrackingNumber,
//                     returnId: returned._id,
//                   },
//                 });
//               }
//             });
//             break;
//           case "Return Delivered":
//             order.orderItems.map(async (x) => {
//               if (x._id === req.params.productId) {
//                 const returned = await Return.findOne({
//                   productId: x._id,
//                   orderId: order._id,
//                 });
//                 console.log("returned", returned._id);
//                 const address =
//                   x.deliverySelect["delivery Option"] === "Paxi PEP store"
//                     ? x.deliverySelect["shortName"]
//                     : x.deliverySelect["delivery Option"] ===
//                       "PUDO Locker-to-Locker"
//                     ? `${x.deliverySelect["shortName"]},${x.deliverySelect["province"]}`
//                     : x.deliverySelect["delivery Option"] ===
//                       "PostNet-to-PostNet"
//                     ? `${x.deliverySelect["pickUp"]},${x.deliverySelect["province"]}`
//                     : x.deliverySelect["address"];
//                 return sendEmail({
//                   to: x.seller.email,
//                   subject: "RETURN DELIVERED ",
//                   template: "returnDelivered",
//                   context: {
//                     username: x.seller.username,
//                     url: x.region === "NGN" ? "com" : "co.za",
//                     orderId: order._id,
//                     address,
//                     deliveryMethod: x.deliverySelect["delivery Option"],
//                     returnId: returned._id,
//                     orderItems: [x],
//                   },
//                 });
//               }
//             });
//             break;
//           case "Return Received":
//             order.orderItems.map(async (x) => {
//               const returned = await Return.findOne({ productId: x._id });
//               console.log("returned", returned, returned._id);
//               if (x._id === req.params.productId) {
//                 return sendEmail({
//                   to: order.user.email,
//                   subject: "RETURN RECEIVED ",
//                   template: "returnReceived",
//                   context: {
//                     username: order.user.username,
//                     url: x.region === "NGN" ? "com" : "co.za",
//                     orderId: order._id,
//                     orderItems: [x],
//                     returnId: returned._id,
//                   },
//                 });
//               }
//             });

//             break;

//           default:
//             break;
//         }
//         res.send({ message: "Order Delivery Status changed" });
//       } else {
//         res.status(404).send({ message: "Order Not Found" });
//       }
//     } catch (error) {
//       res.status(404).send({ message: error });
//     }
//   })
// );

// orderRouter.put(
//   "/:id/status",
//   isAuth,
//   expressAsyncHandler(async (req, res) => {
//     const order = await Order.findById(req.params.id);
//     if (order && order.seller.toString() === req.user._id) {
//       order.status = "reject";
//       order.reason = req.body.reason;
//       await order.save();
//       res.send({ message: "Order Status changed" });
//     } else {
//       res.status(404).send({ message: "Order Not Found" });
//     }
//   })
// );

// orderRouter.put(
//   "/:region/:id/pay",
//   isAuth,
//   expressAsyncHandler(async (req, res) => {
//     const { region, id } = req.params;
//     const { transaction_id, method } = req.body;

//     try {
//       let response;

//       if (method === "wallet") {
//         const transaction = await Transaction.findOne({
//           "metadata.transaction_id": transaction_id,
//         });
//         response = transaction
//           ? { data: { status: "successful" } }
//           : { data: { status: "failed" } };
//       } else {
//         response = await flw.Transaction.verify({ id: transaction_id });
//       }

//       if (response?.data?.status === "successful") {
//         const order = await Order.findById(id).populate({
//           path: "user",
//           select: "email username",
//         });

//         if (order) {
//           const products = order.orderItems.map((i) => i._id);
//           const records = await Product.find({ _id: { $in: products } });
//           const sellers = Array.from(
//             new Set(order.orderItems.map((i) => i.seller))
//           );

//           for (const product of records) {
//             const orderItem = order.orderItems.find((i) =>
//               i._id.equals(product._id)
//             );
//             const newQuantity = orderItem.quantity;
//             const selectedSize = orderItem.selectSize;

//             product.sold = true;
//             product.countInStock -= newQuantity;
//             product.soldAll = product.countInStock < 1;

//             product.sizes = product.sizes.map((size) => {
//               return size.size === selectedSize
//                 ? { ...size, value: `${Number(size.value) - newQuantity}` }
//                 : size;
//             });

//             product.userBuy.push(req.user._id);

//             const seller = await User.findById(product.seller);
//             seller.sold.push(product._id);
//             seller.earnings += product.actualPrice;

//             await seller.save();
//             await product.save();
//           }

//           order.isPaid = true;
//           order.paidAt = Date.now();
//           order.paymentResult = {
//             id: req.body.id,
//             status: req.body.status,
//             update_time: req.body.update_time,
//             email_address: req.body.email_address,
//           };

//           const updateOrder = await order.save();

//           for (const seller of sellers) {
//             const userSeller = await User.findById(seller);
//             const exist = await RebundleSeller.findOne({
//               userId: req.user._id,
//               sellerId: seller,
//             });

//             if (!exist && userSeller.rebundle.status) {
//               const rebundleSeller = new RebundleSeller({
//                 userId: req.user._id,
//                 sellerId: seller,
//                 createdAt: Date.now(),
//                 count: seller.rebundle.count,
//                 deliveryMethod: order.deliveryMethod["delivery Option"],
//               });

//               await rebundleSeller.save();
//             } else if (exist) {
//               const selectedCount = order.orderItems.reduce((total, item) => {
//                 const deliveryMethod = item.deliverySelect["delivery Option"];
//                 return (
//                   total +
//                   (deliveryMethod === exist.deliveryMethod ? item.quantity : 0)
//                 );
//               }, 0);

//               exist.count = Math.max(exist.count - selectedCount, 0);
//               await exist.save();
//             }
//           }

//           await payShippingFee(order);

//           sendEmail({
//             to: order.user.email,
//             subject: "PROCESSING YOUR ORDER",
//             template: "processingOrder",
//             context: {
//               username: order.user.username,
//               url: region === "NGN" ? "com" : "co.za",
//               sellers,
//               orderId: order._id,
//               orderItems: order.orderItems,
//               sellerId: order.orderItems[0].seller._id,
//             },
//           });

//           for (const seller of sellers) {
//             sendEmail({
//               to: seller.email,
//               subject: "NEW ORDER",
//               template: "processingOrderSeller",
//               context: {
//                 username: seller.username,
//                 url: region === "NGN" ? "com" : "co.za",
//                 buyer: order.user.username,
//                 buyerId: order.user._id,
//                 orderId: order._id,
//                 sellerId: seller._id,
//                 orderItems: order.orderItems.filter(
//                   (x) => x.seller._id === seller._id
//                 ),
//                 sellerId: order.orderItems[0].seller._id,
//               },
//             });
//           }

//           res.status(200).send({ message: "Order Paid", order: updateOrder });
//         } else {
//           res.status(404).send({ message: "Order Not Found" });
//         }
//       } else {
//         res.status(400).send({ message: "Error making payment" });
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       res
//         .status(500)
//         .send({ message: "An error occurred while processing the order" });
//     }
//   })
// );

orderRouter.put(
  "/:region/:id/pay",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { region } = req.params;
    const { transaction_id } = req.body;
    const { method } = req.body;
    var response;
    try {
      if (method === "wallet") {
        const transaction = await Transaction.find({
          "metadata.transaction_id": transaction_id,
        });
        if (transaction) {
          response = { data: { status: "successful" } };
        } else {
          response = { data: { status: "failed" } };
        }
      } else {
        if (region === "N ") {
          response = await flw.Transaction.verify({ id: transaction_id });
        } else {
          response = await flw.Transaction.verify({ id: transaction_id });
        }
      }
      if (response?.data?.status === "successful") {
        const order = await Order.findById(req.params.id).populate({
          path: "user",
          select: "email username",
        });
        if (order) {
          const products = [];
          const sellers = [];
          order.orderItems.map((i) => products.push(i._id));
          const records = await Product.find({
            _id: { $in: products },
          });
          order.orderItems.forEach((element) => {
            if (!sellers.includes(element.seller)) {
              sellers.push(element.seller);
            }
          });
          records.map(async (p) => {
            var newQuantity;
            var selectedSize;
            order.orderItems.map((x) => {
              if (p._id.toString() === x._id) {
                newQuantity = x.quantity;
                selectedSize = x.selectSize;
              }
            });
            p.sold = true;
            p.countInStock = p.countInStock - newQuantity;
            product.soldAll = product.countInStock < 1;

            p.sizes = p.sizes.map((size) => {
              return size.size === selectedSize
                ? { ...size, value: `${Number(size.value) - newQuantity}` }
                : size;
            });
            p.userBuy.push(req.user._id);

            const seller = await User.findById(p.seller);
            seller.sold.push(p._id);
            seller.earnings = seller.earnings + p.actualPrice;
            await seller.save();
            await p.save();
            setTimer(
              order._id,
              p._id,
              3,
              "You are running out of time to dispatch"
            );
          });

          order.isPaid = true;
          order.paidAt = Date.now();
          order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
          };
          const updateOrder = await order.save();
          sellers.map(async (seller) => {
            const userSeller = await User.findById(seller);
            const exist = await RebundleSeller.findOne({
              userId: req.user._id,
              sellerId: seller,
            });
            if (!exist && userSeller.rebundle.status) {
              const rebundleSeller = new RebundleSeller({
                userId: req.user._id,
                sellerId: seller,
                createdAt: Date.now(),
                count: seller.rebundle.count,
                deliveryMethod: order.deliveryMethod["delivery Option"],
              });
              await rebundleSeller.save();
            } else if (exist) {
              const selectedCount = order.orderItems.reduce(
                (a, c) =>
                  a +
                  (c.deliverySelect["delivery Option"] === exist.deliveryMethod
                    ? 1 * c.quantity
                    : 0),
                0
              );
              const count = exist.count - selectedCount;
              const countAllow = count > 0 ? count : 0;
              exist.count = countAllow;
              await exist.save();
            }
          });
          const answer = await payShippingFee(order);

          sendEmail({
            to: order.user.email,
            subject: "PROCESSING YOUR ORDER",
            template: "processingOrder",
            context: {
              username: order.user.username,
              url: region === "NGN" ? "com" : "co.za",
              sellers,
              orderId: order._id,
              orderItems: order.orderItems,
              sellerId: order.orderItems[0].seller._id,
            },
          });
          sellers.map((seller) => {
            sendEmail({
              to: seller.email,
              subject: "NEW ORDER",
              template: "processingOrderSeller",
              context: {
                username: seller.username,
                url: region === "NGN" ? "com" : "co.za",
                buyer: order.user.username,
                buyerId: order.user._id,
                orderId: order._id,
                sellerId: seller._id,
                orderItems: order.orderItems.filter(
                  (x) => x.seller._id === seller._id
                ),
                sellerId: order.orderItems[0].seller._id,
              },
            });
          });
          res.send({ message: "Order Paid", order: updateOrder });
        } else {
          res.status(404).send({ message: "Order Not Found" });
        }
      } else {
        res.send("error making payment");
      }
    } catch (error) {
      console.log("error", error);
      res.status(error.status).send({ message: error.message });
    }
  })
);

orderRouter.delete(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      if (req.user._id === order.user || req.user.isAdmin) {
        await order.remove();
        res.send({ message: "Order Deleted" });
      } else {
        res.status(500).send("Cannot delete order");
      }
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

export default orderRouter;
