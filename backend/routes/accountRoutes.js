import express from "express";
import {
  creditAccount,
  debitAccount,
  fillEmailContent,
  isAdmin,
  isAuth,
  isAuthOrNot,
  sendEmail,
  sendEmailMessage,
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
import paystack from "paystack";
import Payment from "../models/paymentModel.js";

dotenv.config();

const secretKey = process.env.PAYSTACK_SECRET_KEY;
const paystackInstance = paystack(secretKey);

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

accountRouter.get(
  "/bank/:country",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const { country } = req.params;
      const banks = await getBank(country);
      res.status(200).send({ banks });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Internal server error",
      });
    }
  })
);

accountRouter.post(
  "/:region/bankaccount/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const { bankName, accountNumber, accountName } = req.body;
      const { region, id } = req.params;

      const user = await User.findById(id);

      console.log(!user.bankName, req.user.isAdmin);
      if (!user.bankName || req.user.isAdmin) {
        user.bankName = bankName.name;
        user.accountNumber = accountNumber;
        user.accountName = accountName;

        const recipient = await transferRecipient({
          region,
          accountName,
          accountNumber,
          bank_code: bankName.code,
        });

        user.recipientCode = recipient;

        const newUser = await user.save();

        res.status(200).send({
          message: "Bank account details updated successfully.",
        });
      } else {
        res.status(400).send({
          message: "You are not allowed to update your account again.",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Internal server error. Please try again later.",
      });
    }
  })
);

accountRouter.post(
  "/:region/deposit",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const io = req.app.get("io");
    var account;
    if (req.body.userId === "Admin") {
      const admin = await User.findOne({
        email:
          req.params.region === "ZAR"
            ? "tobiasrepeddle@gmail.com"
            : "repeddleng@gmail.com",
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
            const content = {
              io,
              receiverId: user._id,
              senderId: req.user._id,
              title: "Order Payment Received.",
              emailMessages: fillEmailContent("Order Payment Received.", {
                USERNAME: user.username,
                EMAIL: user.email,
              }),
            };
            sendEmailMessage(content);
          }
          if (req.body.purpose === "Return Completed") {
            const returned = await Return.findOne({ orderId: order._id });
            if (returned) {
              sendEmail({
                to: user.email,
                subject: "RETURN REFUNDED",
                template: "returnRefunded",
                context: {
                  username: user.username,
                  url: user.region === "NGN" ? "com" : "co.za",
                  orderItems: order.orderItems,
                  returnId: returned?._id,
                  amount,
                },
              });
              const content = {
                io,
                receiverId: user._id,
                senderId: req.user._id,
                title: "Return Refunded.",
                emailMessages: fillEmailContent("Return Refunded.", {
                  USERNAME: user.username,
                  EMAIL: user.email,
                  RETURNID: returned._id,
                  AMOUNT: amount,
                }),
              };
              sendEmailMessage(content);
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
  "/:region/withdraw",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    var account;
    if (req.body.userId === "Admin") {
      const admin = await User.findOne({
        email:
          req.params.region === "ZAR"
            ? "tobiasrepeddle@gmail.com"
            : "repeddleng@gmail.com",
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
  "/:region/transfer",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const senderId = await Account.findOne({ userId: req.user._id });
    const admin = await User.findOne({
      email:
        req.params.region === "ZAR"
          ? "tobiasrepeddle@gmail.com"
          : "repeddleng@gmail.com",
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
  "/:region/fundwallet",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const { transaction_id, type } = req.body;

      var response;
      if (type === "flutterwave") {
        response = await flw.Transaction.verify({ id: transaction_id });
      } else if (type === "paystack") {
        response = await paystackInstance.transaction.verify(transaction_id);
      }
      if (
        response?.data?.status === "successful" ||
        response?.data?.status === "success"
      ) {
        const recipientId = await Account.findOne({ userId: req.user._id });
        const admin = await User.findOne({
          email:
            req.params.region === "ZAR"
              ? "tobiasrepeddle@gmail.com"
              : "repeddleng@gmail.com",
          isAdmin: true,
        });
        const senderId = await Account.findOne({ userId: admin._id });
        const { amount } = response.data;
        // const transaction_id = v4();
        if (senderId && recipientId && amount > 0) {
          const purpose = "transfer";
          const debitResult = await debitAccount({
            amount: type === "paystack" ? amount / 100 : amount,
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
              amount: type === "paystack" ? amount / 100 : amount,
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
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: error.error,
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
      account_number: `${req.body.accountNumber}`,
      // account_number: "3091906691",
      // account_number: "3091906691",
      // amount: 100,
      amount: req.body.amount,
      currency: "NGN",
      narration: "Withdrawal request",
      reference: v4(),
      // reference: "dfs23fhr7ntg0293039_PMCKDU_1",
    };
    if (req.params.region === "NGN") {
      flw.Transfer.initiate(details).then(console.log).catch(console.log);
    }
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
  "/:region/paystack/payaccount",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const { paymentId } = req.body;
      const { region } = req.params;

      const payment = await Payment.findById(paymentId);

      if (!payment) {
        return res.status(404).send({ message: "Payment not found " });
      }

      const user = await User.findById(payment.userId._id);

      if (!user.recipientCode) {
        const banks = await getBank(
          region === "ZAR" ? "south africa" : "nigeria"
        );
        const bank_code = banks.data.find(
          (bank) => bank.name === user.bankName
        );
        if (!bank_code) {
          return res.status(404).send({ message: "Bank code not found" });
        }
        const recipient = await transferRecipient({
          region,
          accountName: user.accountName,
          accountNumber: user.accountNumber.toString(),
          bank_code: bank_code.code,
        });
        user.recipientCode = recipient;

        await user.save();
      }

      const params = {
        source: "balance",
        reason: "Withdrawal Request",
        amount: payment.amount * 100,
        reference: v4(),
        recipient: user.recipientCode,
      };

      const options = {
        method: "post",
        url: "https://api.paystack.co/transfer",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        data: params,
      };

      const response = await axios(options);

      payment.status = "Approved";
      const newpayment = await payment.save();
      res.status(200).send(newpayment);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: error.message,
      });
    }
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

export const transferRecipient = async ({
  region,
  accountName,
  accountNumber,
  bank_code,
}) => {
  const params = {
    type: region === "ZAR" ? "basa" : "nuban",
    name: accountName,
    account_number: accountNumber,
    bank_code,
    currency: region,
  };

  const options = {
    method: "post",
    url: "https://api.paystack.co/transferrecipient",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    data: params,
  };

  const response = await axios(options);

  return response.data.data.recipient_code;
};

export const getBank = async (country) => {
  const options = {
    method: "get",
    url: `https://api.paystack.co/bank?country=${country}`,
    headers: {
      Authorization: `Bearer ${secretKey}`,
    },
  };

  const response = await axios(options);
  return response.data;
};
