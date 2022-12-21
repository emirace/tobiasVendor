import express from "express";
import { isAdmin, isAuth } from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import Transaction from "../models/transactionModel.js";
import crypto from "crypto";
import axios from "axios";
import Account from "../models/accountModel.js";

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
