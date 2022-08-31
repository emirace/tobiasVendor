import express from "express";
import {
  creditAccount,
  debitAccount,
  isAdmin,
  isAuth,
  isAuthOrNot,
} from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import Transaction from "../models/transactionModel.js";
import { v4 } from "uuid";
import Account from "../models/accountModel.js";
import axios from "axios";
import dotenv from "dotenv";
import Flutterwave from "flutterwave-node-v3";
import User from "../models/userModel.js";

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
    console.log(account);
    if (account) {
      res.status(200).send({ balance: account.balance });
    } else {
      res.status(404).send("account not found");
    }
  })
);

accountRouter.post(
  "/deposit",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { transaction_id } = req.body;

    const response = await flw.Transaction.verify({ id: transaction_id });

    if (response.data.status === "successful") {
      const account = await Account.findOne({ userId: req.user._id });
      const accountId = account._id;
      const { amount } = req.body;
      if (accountId && amount > 0) {
        try {
          const creditResult = await creditAccount({
            accountId,
            amount,
            purpose: "deposit",
            metadata: { purpose: req.body.purpose },
          });

          if (!creditResult.success) {
            throw creditResult;
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
    } else {
      res.send("error making payment");
    }
  })
);

accountRouter.post(
  "/withdraw",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const account = await Account.findOne({ userId: req.user._id });
    const accountId = account._id;
    const { amount } = req.body;
    if (accountId && amount > 0) {
      try {
        const creditResult = await debitAccount({
          accountId,
          amount,
          purpose: "withdrawal",
        });

        if (!creditResult.success) {
          throw creditResult;
        }

        res.status(200).send({
          success: true,
          message: "withdrawal successful",
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
    console.log(req.user);
    const senderId = await Account.findOne({ userId: req.user._id });
    const admin = await User.findOne({
      email: "admin@example.com",
      isAdmin: true,
    });
    console.log(admin);
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
