import express from "express";
import { creditAccount, debitAccount, isAdmin, isAuth } from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import Transaction from "../models/transactionModel.js";
import { v4 } from "uuid";
import Account from "../models/accountModel.js";

const accountRouter = express.Router();

accountRouter.post(
  "/deposit",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const account = await Account.findOne({ userId: req.user._id });
    const accountId = account._id;
    const { amount } = req.body;
    if (accountId && amount > 0) {
      try {
        const creditResult = await creditAccount({
          accountId,
          amount,
          purpose: "deposit",
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
    const senderId = Account.findOne({ userId: req.user._id });
    const recipientId = Account.findOne({ userId: req.body.recipient });
    const { amount } = req.body;
    if (senderId && recipientId && amount > 0) {
      try {
        const purpose = "transfer";

        const debitResult = await debitAccount({
          amount,
          accountId: senderId,
          purpose,
          metadata: {
            recipientId,
          },
        });
        if (debitResult.success) {
          await creditAccount({
            amount,
            accountId: recipientId,
            purpose,
            metadata: {
              senderId,
            },
          });
        } else {
          return res.status(500).send({ debitResult, k: "lll" });
        }

        res.status(200).send({
          success: true,
          message: "transfer successful",
        });
      } catch (error) {
        res.status(500).send({
          success: false,
          error: "network error",
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
