import express from "express";
import {
  confirmPayfast,
  creditAccount,
  debitAccount,
  isAdmin,
  isAuth,
  sendEmail,
} from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import Transaction from "../models/transactionModel.js";
import crypto from "crypto";
import axios from "axios";
import Account from "../models/accountModel.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import RebundleSeller from "../models/rebuldleSellerModel.js";
import User from "../models/userModel.js";
import { v4 } from "uuid";

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

// get all user transaction

transactionRouter.get(
  "/users",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const searchQuery = query.q;
    const account = await Account.findOne({ userId: req.user._id });
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
    const transactions = await Transaction.find({
      ...queryFilter,
      accountId: account._id,
    }).sort({
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
    const order = await Order.findById(req.body["item_name"]).populate({
      path: "user",
      select: "email username",
    });
    const confirm = await confirmPayfast(req, order.totalPrice);
    if (confirm) {
      try {
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

            p.sizes = p.sizes.map((size) => {
              return size.size === selectedSize
                ? { ...size, value: `${Number(size.value) - newQuantity}` }
                : size;
            });
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

          sendEmail({
            to: order.user.email,
            subject: "PROCESSING YOUR ORDER",
            template: "processingOrder",
            context: {
              username: order.user.username,
              url: "co.za",
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
                url: "co.za",
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
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("payment failed");
    }
    res.status(200).send("done");
  })
);

transactionRouter.post(
  "/payfund",
  expressAsyncHandler(async (req, res) => {
    console.log(req.body);
    const confirm = await confirmPayfast(req, req.body["amount_gross"]);
    if (confirm) {
      try {
        console.log("payment is successful");
        const user = await User.findOne({ email: req.body["email_address"] });
        console.log(user._id);

        const recipientId = await Account.findOne({ userId: user._id });
        console.log(recipientId, user._id);

        const admin = await User.findOne({
          email: "tobiasrepeddle@gmail.com",
          isAdmin: true,
        });
        const senderId = await Account.findOne({ userId: admin._id });
        const amount = req.body["amount_gross"];
        const transaction_id = v4();

        if (senderId && recipientId && amount > 0) {
          try {
            const purpose = "transfer";

            const debitResult = await debitAccount({
              amount,
              accountId: senderId._id,
              purpose,
              metadata: {
                recipientId: recipientId._id,
                transaction_id,
                purpose: "Fund wallet",
              },
            });
            if (debitResult.success) {
              await creditAccount({
                amount,
                accountId: recipientId._id,
                purpose,
                metadata: {
                  senderId: senderId._id,
                  purpose: "Fund wallet",
                },
              });
            } else {
              throw debitResult;
            }
            console.log("funded");
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log("enter valid credentials");
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("payment failed");
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

    // const passPhrase = "jt7NOE43FZPn";
    const passPhrase = "Re01thriftpeddle";

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
        .post(`https://www.payfast.co.za/onsite/process`, pfParamString)
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
  expressAsyncHandler(async (req, res) => {
    const account = await Account.findOne({ userId: req.user._id });
    const transaction = await Transaction.findById(req.params.id);
    if (transaction) {
      console.log(
        account._id.toString() === transaction.accountId.toString(),
        req.user.isAdmin
      );
      if (
        req.user.isAdmin ||
        account._id.toString() === transaction.accountId.toString()
      ) {
        res.status(200).send(transaction);
      } else {
        res.status(404).send("transaction not found");
      }
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
