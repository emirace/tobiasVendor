import express from "express";
import { isAdmin, isAuth } from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import Payment from "../models/paymentModel.js";

const paymentRouter = express.Router();

// get all payments

paymentRouter.get(
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
                paymentId: {
                  $regex: searchQuery,
                  $options: "i",
                },
              },
            ],
          }
        : {};
    const payments = await Payment.find({ ...queryFilter })
      .populate("userId", "username")
      .sort({ createdAt: -1 });
    res.send(payments);
  })
);

// add a payment

paymentRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    console.log(req.body.amount);
    const formattedAmount = parseFloat(req.body.amount).toFixed(2);
    console.log("amount", formattedAmount);
    const payment = new Payment({
      userId: req.body.userId,
      amount: formattedAmount,
      meta: req.body.meta,
    });
    payment.paymentId = payment._id.toString();

    const newPayment = await payment.save();
    res.status(200).send(newPayment);
  })
);

// update a payment

paymentRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const payment = await Payment.findById(req.params.id);
    if (payment) {
      payment.status = req.body.status;
      const newpayment = await payment.save();
      res.status(200).send(newpayment);
    } else {
      res.status(404).send("payment not found");
    }
  })
);

// delete a payment

paymentRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const payment = await Payment.findById(req.params.id);
    if (payment) {
      await payment.remove();
      res.send("Adress deleted");
    } else {
      res.status(404).send("Payment not found");
    }
  })
);

// get a payment

paymentRouter.get(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const payment = await Payment.findById(req.params.id).populate(
      "userId",
      "username image"
    );
    if (payment) {
      res.status(201).send(payment);
    } else {
      res.status(404).send("payment not found");
    }
  })
);

export default paymentRouter;
