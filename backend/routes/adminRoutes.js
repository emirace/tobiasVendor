import express from "express";
import { isAdmin, isAuth } from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import Address from "../models/addressModel.js";
import Product from "../models/productModel.js";

const adminRouter = express.Router();

adminRouter.get(
  "/products",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const products = await Product.find()
      .populate("seller", "seller._id")
      .sort({ createdAt: -1 });

    res.send(products);
  })
);

adminRouter.get(
  "/soldproducts",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const products = await Product.find({ countInStock: 0 })
      .populate("seller", "seller._id")
      .sort({ updatedAt: -1 });

    res.send(products);
  })
);

export default adminRouter;
