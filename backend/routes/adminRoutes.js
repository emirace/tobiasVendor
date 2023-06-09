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

adminRouter.put(
  "/soldAll/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    console.log("Marking as sold");
    const { id } = req.params;

    try {
      const product = await Product.findById(id).populate("seller", "username");

      if (!product) {
        return res.status(404).send({ error: "Product not found" });
      }

      product.soldAll = true;
      product.countInStock = 0;
      product.sizes = [];
      product.sold = true;
      const updatedProduct = await product.save();

      res.status(200).send(updatedProduct);
    } catch (error) {
      res
        .status(500)
        .send({ error: "An error occurred while updating the product" });
    }
  })
);

export default adminRouter;
