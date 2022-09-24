import express from "express";
import { isAdmin, isAuth } from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import Return from "../models/returnModel.js";
import Product from "../models/productModel.js";

const returnRouter = express.Router();

// get all returns

returnRouter.get(
  "/:region/admin",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { region } = req.params;
    const returns = await Return.find({ region })
      .sort({ createdAt: -1 })
      .populate("productId")
      .populate({
        path: "orderId",
        select: "user",
        populate: [{ path: "user", select: "username" }],
      });
    res.send(returns);
  })
);

// get returns for a user
returnRouter.get(
  "/user",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    console.log("user returns");
    const returns = await Return.find({ sellerId: req.user._id })
      .sort({ createdAt: -1 })
      .populate("productId")
      .populate({
        path: "orderId",
        select: "user",
        populate: [{ path: "user", select: "username" }],
      });
    res.send(returns);
  })
);

// add a returned

returnRouter.post(
  "/:region",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { region } = req.params;
    const product = await Product.findById(req.body.productId);
    const returned = new Return({
      orderId: req.body.orderId,
      productId: req.body.productId,
      sellerId: product.seller,
      reason: req.body.reason,
      resolution: req.body.resolution,
      sending: req.body.sending,
      refund: req.body.refund,
      image: req.body.image,
      region,
      others: req.body.others,
    });
    const newReturn = await returned.save();
    res.status(201).send(newReturn);
  })
);

// update a returned by admin
returnRouter.put(
  "/admin/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const returned = await Return.findById(req.params.id)
      .populate({
        path: "orderId",
        select: "user",
        populate: {
          path: "user",
          select: "image",
        },
      })
      .populate({
        path: "productId",
        select: "seller",
        populate: { path: "seller", select: "image" },
      });
    if (returned) {
      returned.adminReason = req.body.adminReason;
      returned.status = req.body.status;
      const newReturn = await returned.save();
      res.status(200).send(newReturn);
    } else {
      res.status(404).send("returned not found");
    }
  })
);
returnRouter.put(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const returned = await Return.findById(req.params.id)
      .populate({
        path: "orderId",
        select: "user",
        populate: {
          path: "user",
          select: "image",
        },
      })
      .populate({
        path: "productId",
        select: "seller",
        populate: { path: "seller", select: "image" },
      });
    if (returned) {
      const product = await Product.findById(returned.productId);
      console.log(product.seller.toString(), req.user._id);
      if (product.seller.toString() === req.user._id) {
        returned.returnDelivery = req.body.meta;
        const newReturn = await returned.save();
        res.status(200).send(newReturn);
      }
    } else {
      res.status(404).send("returned not found");
    }
  })
);

// delete a returned

returnRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const returned = await Return.findById(req.params.id);
    if (returned) {
      await returned.remove();
      res.send("Adress deleted");
    } else {
      res.status(404).send("Return not found");
    }
  })
);

// get a returned

returnRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const returned = await Return.findById(req.params.id)
      .populate({
        path: "orderId",
        select: "user",
        populate: {
          path: "user",
          select: "image",
        },
      })
      .populate({
        path: "productId",
        select: "seller",
        populate: { path: "seller", select: "image" },
      });
    if (returned) {
      res.status(201).send(returned);
    } else {
      res.status(404).send("returned not found");
    }
  })
);

export default returnRouter;
