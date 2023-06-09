import express from "express";
import { isAdmin, isAuth } from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import CartItem from "../models/cartItemModel.js";

const cartItemRouter = express.Router();

// get all cartItems

cartItemRouter.get(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const cartItems = await CartItem.find({ userId: req.user._id });
    res.send(cartItems);
  })
);

// add a cartItem

cartItemRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newItem = {
      ...req.body,
    };
    const cartItem = new CartItem({
      userId: req.user._id,
      item: newItem,
    });
    const existItem = CartItem.findOne({ "item._id": newItem._id });
    if (existItem) {
      await existItem.remove();
    }
    const newCartItem = await cartItem.save();
    res.status(201).send(newCartItem);
  })
);

// update a cartItem

cartItemRouter.post(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const cartItem = await CartItem.findById(req.params.id);
    if (cartItem.userId !== req.user._id) {
      if (cartItem) {
        cartItem.item = req.body.meta;
        const newCart = await cartItem.save();
        res.status(200).send(newCart);
      } else {
        res.status(404).send("cartItem not found");
      }
    } else {
      res.send("Can't edit cartItem");
    }
  })
);

// delete a cartItem

cartItemRouter.delete(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const cartItem = await CartItem.findOne({ "item._id": req.params.id });
    if (cartItem) {
      await cartItem.remove();
      res.send("cartItem deleted");
    } else {
      res.status(404).send("CartItem not found");
    }
  })
);

//clear cart

cartItemRouter.delete(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const cartItem = await CartItem.deleteMany({ userId: req.user._id });
    res.status(200).send({ message: "Cart cleared" });
  })
);

// get a cartItem

cartItemRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const cartItem = await CartItem.find({ userId: req.params.id });
    if (cartItem) {
      res.status(201).send(cartItem);
    } else {
      res.status(404).send("cartItem not found");
    }
  })
);

export default cartItemRouter;
