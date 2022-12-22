import express from "express";
import { confirmPayfast, isAdmin, isAuth } from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import Transaction from "../models/transactionModel.js";
import crypto from "crypto";
import axios from "axios";
import Account from "../models/accountModel.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import RebundleSeller from "../models/rebuldleSellerModel.js";
import User from "../models/userModel.js";

const transactionRouter = express.Router();

// get all transactions

transactionRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const searchQuery = query.q;
    const queryFilter =
      searchQuery && searchQuery !== "all"
        ? {
            $or: [
              {
                returnId: {
                  $regex: searchQuery,
                  $options: "i",
                },
              },
            ],
          }
        : {};
    const transactions = await Transaction.find({ ...queryFilter }).sort({
      createdAt: -1,
    });
    res.send(transactions);
  })
);

// delete a transaction

transactionRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    console.log(req.params.id);
    const transaction = await Transaction.findById(req.params.id);
    if (transaction) {
      await transaction.remove();
      res.send("Transaction deleted");
    } else {
      res.status(404).send("Transaction not found");
    }
  })
);

// get all user transaction

transactionRouter.get(
  "/user",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { _id: accountId } = await Account.findOne({ userId: req.user._id });
    console.log("idid", accountId);
    const transaction = await Transaction.find({ accountId })
      .sort({ createdAt: -1 })
      .limit(10);
    if (transaction) {
      res.status(201).send(transaction);
    } else {
      res.status(404).send("transaction not found");
    }
  })
);

transactionRouter.post(
  "/payfastnotify",
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.body["item_name"]);
    const confirm = await confirmPayfast(req, order.totalPrice);
    if (confirm) {
      console.log("payment is successful");
      const user = await User.findOne({ email: req.body["email_address"] });
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
          p.sold = true;
          p.countInStock =
            p.countInStock -
            order.orderItems.map((x) => {
              if (p._id.toString() === x._id) return x.quantity;
            });
          p.sizes = p.sizes.map((size) =>
            size.size === p.selectSize
              ? { ...size, value: Number(size.value) - 1 }
              : size
          );
          p.userBuy.push(user._id);

          const seller = await User.findById(p.seller);
          seller.sold.push(p._id);
          seller.earnings = seller.earnings + p.actualPrice;
          await seller.save();
          await p.save();
        });

        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: req.body["pf_payment_id"],
          status: req.body["payment_status"],
          update_time: req.body.update_time,
          email_address: req.body["email_address"],
        };
        const updateOrder = await order.save();
        sellers.map(async (seller) => {
          const userSeller = await User.findById(seller);
          const exist = await RebundleSeller.findOne({
            userId: user._id,
            sellerId: seller,
          });
          if (!exist && userSeller.rebundle.status) {
            const rebundleSeller = new RebundleSeller({
              userId: user._id,
              sellerId: seller,
              createdAt: Date.now(),
              count: seller.rebundle.count,
            });
            await rebundleSeller.save();
          } else {
            exist.count -= 1;
            await exist.save();
          }
        });

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
      } else {
        res.status(404).send({ message: "Order Not Found" });
      }
    } else {
      console.log("payment failed");
      await order.remove();
    }
    res.status(200).send("done");
  })
);

transactionRouter.put(
  "/process",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { myData } = req.body;
    let myData1 = { ...myData };

    const passPhrase = "jt7NOE43FZPn";
    // const passPhrase = null;

    const dataToString = (dataArray) => {
      // Convert your data array to a string
      let pfParamString = "";
      for (let key in dataArray) {
        if (dataArray.hasOwnProperty(key)) {
          pfParamString += `${key}=${encodeURIComponent(
            dataArray[key].trim()
          ).replace(/%20/g, "+")}&`;
        }
      }
      // Remove last ampersand
      return pfParamString.slice(0, -1);
    };

    const generatePaymentIdentifier = async (pfParamString) => {
      const result = await axios
        .post(`https://sandbox.payfast.co.za/onsite/process`, pfParamString)
        .then((res) => {
          return res.data || null;
        })
        .catch((error) => {
          console.error(error);
        });
      // console.log("res.data", result);
      return result;
    };

    const generateSignature = (data, passPhrase = null) => {
      // Create parameter string
      let pfOutput = "";
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          console.log(data[key]);
          if (data[key] !== "") {
            pfOutput += `${key}=${encodeURIComponent(data[key].trim()).replace(
              /%20/g,
              "+"
            )}&`;
          }
        }
      }

      // Remove last ampersand
      let getString = pfOutput.slice(0, -1);
      if (passPhrase !== null) {
        getString += `&passphrase=${encodeURIComponent(
          passPhrase.trim()
        ).replace(/%20/g, "+")}`;
      }

      return crypto.createHash("md5").update(getString).digest("hex");
    };
    // Generate signature (see Custom Integration -> Step 2)
    myData["signature"] = generateSignature(myData, passPhrase);

    // Convert the data array to a string
    const pfParamString = dataToString(myData);

    // Generate payment identifier
    const identifier = await generatePaymentIdentifier(pfParamString);
    if (identifier) {
      res.status(200).send(identifier);
    } else {
      console.log("same issue");
      res.status(500).send("Encounter a probrem making payment");
    }
  })
);

// get a transaction admin

transactionRouter.get(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);
    if (transaction) {
      res.status(201).send(transaction);
    } else {
      res.status(404).send("transaction not found");
    }
  })
);

// get a user transaction

transactionRouter.get(
  "/user/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { _id: accountId } = await Account.find({ userId: req.user._id });
    const transaction = await Transaction.find({
      accountId,
      _id: req.params.id,
    });
    if (transaction) {
      res.status(201).send(transaction);
    } else {
      res.status(404).send("transaction not found");
    }
  })
);

export default transactionRouter;
