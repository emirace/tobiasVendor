import express from "express";
import { isAdmin, isAuth } from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import Transaction from "../models/transactionModel.js";
import Account from "../models/accountModel.js";

const transactionRouter = express.Router();

// get all transactions

transactionRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const transactions = await Transaction.find();
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
