import express from "express";
import { isAdmin, isAuth } from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import Address from "../models/addressModel.js";
import Product from "../models/productModel.js";

const adminRouter = express.Router();

adminRouter.get(
  "/:region/products",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { region } = req.params;
    const products = await Product.find({ region })
      .populate("seller", "seller._id")
      .sort({ createdAt: -1 });

    res.send(products);
  })
);

adminRouter.get(
  "/:region/soldproducts",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { region } = req.params;
    const products = await Product.find({ countInStock: 0, region })
      .populate("seller", "seller._id")
      .sort({ updatedAt: -1 });

    res.send(products);
  })
);

export default adminRouter;
