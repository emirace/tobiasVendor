import express from "express";
import {
  creditAccount,
  debitAccount,
  isAdmin,
  isAuth,
  isAuthOrNot,
  sendEmail,
} from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import Transaction from "../models/transactionModel.js";
import { v4 } from "uuid";
import Account from "../models/accountModel.js";
import axios from "axios";
import dotenv from "dotenv";
import Flutterwave from "flutterwave-node-v3";
import User from "../models/userModel.js";
import Return from "../models/returnModel.js";
import Order from "../models/orderModel.js";

dotenv.config();
const flw = new Flutterwave(
  process.env.FLW_PUBLIC_KEY,
  process.env.FLW_SECRET_KEY
);
const accountRouter = express.Router();

accountRouter.get(
  "/balance",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const account = await Account.findOne({ userId: req.user._id });
    if (account) {
      res.status(200).send(account);
    } else {
      res.status(404).send("account not found");
    }
  })
);

accountRouter.get(
  "/balance/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const account = await Account.findOne({ userId: req.params.id });
    if (account) {
      res.status(200).send(account);
    } else {
      res.status(404).send("account not found");
    }
  })
);

accountRouter.get(
  "/finduser/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const account = await Account.findById(req.params.id);
    if (account) {
      const user = await User.findById(account.userId);
      if (user) {
        res.send({
          username: user.username,
          image: user.image,
          firstName: user.firstName,
          lastName: user.lastName,
        });
      } else {
        res.status(404).send("user not found");
      }
    } else {
      res.status(404).send("account not found");
    }
  })
);

accountRouter.post(
  "/deposit",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    var account;
    if (req.body.userId === "Admin") {
      const admin = await User.findOne({
        email: "admin@example.com",
        isAdmin: true,
      });
      account = await Account.findOne({ userId: admin._id });
    } else {
      account = await Account.findOne({ userId: req.body.userId });
    }
    const accountId = account._id;
    const { amount } = req.body;
    const transaction_id = v4();

    if (accountId && amount > 0) {
      try {
        const creditResult = await creditAccount({
          accountId,
          amount,
          purpose: "deposit",
          metadata: {
            transaction_id,
            purpose: req.body.purpose,
          },
        });

        if (!creditResult.success) {
          throw creditResult;
        }
        if (
          req.body.purpose === "Order Completed" ||
          req.body.purpose === "Return Completed"
        ) {
          const user = await User.findById(req.body.userId);
          const order = await Order.findById(req.body.orderId);

          if (req.body.purpose === "Order Completed") {
            sendEmail({
              to: user.email,
              subject: "ORDER COMPLETED",
              template: "ordercCompleted",
              context: {
                username: user.username,
                url: user.region === "NGN" ? "com" : "co.za",
                orderItems: order.orderItems,
              },
            });
          }
          if (req.body.purpose === "Return Completed") {
            const returned = await Return.findOne({ orderId: order._id });
            if (returned) {
              console.log("gddddfg return complete 222");
              sendEmail({
                to: user.email,
                subject: "RETURN REFUNDED",
                template: "returnRefunded",
                context: {
                  username: user.username,
                  url: user.region === "NGN" ? "com" : "co.za",
                  orderItems: order.orderItems,
                  returnId: returned?._id,
                  amount: returned.amount,
                },
              });
            } else {
              throw {
                success: false,
                error: "return not found",
              };
            }
          }
        }
        res.status(200).send({
          success: true,
          message: "deposit successful",
        });
      } catch (error) {
        res.status(500).send({
          success: false,
          error: error,
        });
      }
    } else {
      res.status(500).send({
        success: false,
        error: "enter valid credentials",
      });
    }
  })
);

accountRouter.post(
  "/withdraw",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    var account;
    if (req.body.userId === "Admin") {
      const admin = await User.findOne({
        email: "admin@example.com",
        isAdmin: true,
      });
      account = await Account.findOne({ userId: admin._id });
    } else {
      account = await Account.findOne({ userId: req.body.userId });
    }
    const accountId = account._id;
    const { amount } = req.body;
    const transaction_id = v4();
    if (accountId && amount >= 0) {
      try {
        const creditResult = await debitAccount({
          accountId,
          amount,
          purpose: "withdrawal",
          metadata: {
            transaction_id,
            purpose: req.body.purpose,
          },
        });

        if (!creditResult.success) {
          return res.send(creditResult);
        }

        res.status(200).send({
          success: true,
          message: "withdrawal successful",
          transaction_id,
        });
      } catch (error) {
        res.status(500).send({
          success: false,
          error: error,
        });
      }
    } else {
      res.status(500).send({
        success: false,
        error: "enter valid credentials",
      });
    }
  })
);

accountRouter.post(
  "/transfer",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const senderId = await Account.findOne({ userId: req.user._id });
    const admin = await User.findOne({
      email: "admin@example.com",
      isAdmin: true,
    });
    const recipientId = await Account.findOne({ userId: admin._id });
    const { amount } = req.body;
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
            purpose: req.body.purpose,
          },
        });
        if (debitResult.success) {
          await creditAccount({
            amount,
            accountId: recipientId._id,
            purpose,
            metadata: {
              senderId: senderId._id,
              purpose: req.body.purpose,
            },
          });
        } else {
          throw debitResult;
        }

        res.status(200).send({
          success: true,
          message: "transfer successful",
          transaction_id,
        });
      } catch (error) {
        res.status(500).send({
          message: error.error,
        });
      }
    } else {
      res.status(500).send({
        success: false,
        error: "enter valid credentials",
      });
    }
  })
);
accountRouter.post(
  "/fundwallet",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { transaction_id } = req.body;

    const response = await flw.Transaction.verify({ id: transaction_id });

    if (response.data.status === "successful") {
      const recipientId = await Account.findOne({ userId: req.user._id });
      const admin = await User.findOne({
        email: "admin@example.com",
        isAdmin: true,
      });
      const senderId = await Account.findOne({ userId: admin._id });
      const { amount } = req.body;
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
              purpose: req.body.purpose,
            },
          });
          if (debitResult.success) {
            await creditAccount({
              amount,
              accountId: recipientId._id,
              purpose,
              metadata: {
                senderId: senderId._id,
                purpose: req.body.purpose,
              },
            });
          } else {
            throw debitResult;
          }

          res.status(200).send({
            success: true,
            message: "transfer successful",
            transaction_id,
          });
        } catch (error) {
          res.status(500).send({
            message: error.error,
          });
        }
      } else {
        res.status(500).send({
          success: false,
          error: "enter valid credentials",
        });
      }
    } else {
      res.status(500).send({
        success: false,
        error: "error funding account, try again later",
      });
    }
  })
);

accountRouter.post(
  "/:region/payaccount",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    console.log("pay account request");
    // const details = {
    //   account_number: "0782648292",
    //   account_bank: "044",
    // };
    // flw.Misc.verify_Account(details).then((response) => console.log(response));
    const details = {
      account_bank: req.body.bankName,
      // account_bank: "011",
      account_number: req.body.accountNumber,
      // account_number: "3091906691",
      // account_number: "3091906691",
      // amount: 100,
      amount: req.body.amount,
      currency: "NGN",
      narration: "Withdrawal request",
      reference: v4(),
      // reference: "dfs23fhr7ntg0293039_PMCKDU_1",
    };
    console.log(req.body);
    // if (req.params.region === "NGN") {
    //   flw.Transfer.initiate(details).then(console.log).catch(console.log);
    // }
    // const user = await User.findById(req.body.userId);
    // sendEmail({
    //   to: user.email,
    //   subject: "WITHDRAWAL REQUESTED",
    //   template: "withdrawalRequest",
    //   context: {
    //     username: user.username,
    //     url: user.region === "NGN" ? "com" : "co.za",
    //     amount: req.body.amount,
    //     currency: req.body.currency,
    //     bankName: req.body.bankName,
    //     accountNumber: req.body.accountNumber,
    //     accountName: req.body.accountName,
    //   },
    // });

    // flw.Transfer.initiate(details)
    //   .then(() => {
    //     sendEmail({
    //       to: user.email,
    //       subject: "WITHDRAWAL REQUESTED",
    //       template: "withdrawalRequest",
    //       context: {
    //         username: user.username,
    //         url: user.region === "NGN" ? "com" : "co.za",
    //         amount,
    //       },
    //     });
    //   })
    //   .catch(console.log);

    res.status(200).send({
      success: true,
      message: "transfer successful",
    });
  })
);

accountRouter.post(
  "/reversal",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { reference } = req.body;

    const txnReference = v4();
    const purpose = "reversal";

    try {
      const transaction = await Transaction.findOne({ reference });
      if (transaction) {
        const reversalResult =
          transaction.txnType === "debit"
            ? await creditAccount({
                amount: transaction.amount,
                accountId: transaction.accountId,
                metadata: {
                  originalReference: transaction.reference,
                },
                purpose,
                reference: txnReference,
              })
            : await debitAccount({
                amount: transaction.amount,
                accountId: transaction.accountId,
                metadata: {
                  originalReference: transaction.reference,
                },
                purpose,
                reference: txnReference,
              });

        if (!reversalResult.success) {
          res.status(500).send(reversalResult);
          return;
        }

        res.status(200).send({
          success: true,
          message: "Reversal successful",
        });
      } else {
        res.status(500).send("no transaction found");
      }
    } catch (error) {
      return {
        success: false,
        error: "Internal server error",
      };
    }
  })
);

export default accountRouter;
