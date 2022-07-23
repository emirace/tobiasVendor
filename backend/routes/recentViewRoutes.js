import express from "express";
import { isAdmin, isAuth, isAuthOrNot } from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import RecentView from "../models/recentViewModel.js";

const recentViewRouter = express.Router();

const factor = 0.9;
recentViewRouter.put(
  "/:productId",
  isAuthOrNot,
  expressAsyncHandler(async (req, res) => {
    const { productId } = req.params;
    const view = await RecentView.findOne({ productId: productId });
    console.log(productId);
    if (view) {
      view.score = view.score + factor;
      view.numViews = view.numViews + 1;
      const saveview = await view.save();
      console.log("old", saveview);
    } else {
      const newView = new RecentView({
        score: factor,
        numViews: 1,
        productId,
      });
      await newView.save();
      console.log("new");
    }
    const views = await RecentView.find();
    if (views) {
      views.map(async (v) => {
        console.log(
          productId !== v.productId.toString(),
          productId,
          v.productId.toString()
        );
        if (productId !== v.productId.toString()) {
          v.score = v.score * factor;
          const c = await v.save();
          console.log("c", v, c);
        }
      });
    }
    res.status(201).send("Done");
  })
);

recentViewRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const views = await RecentView.find()
      .populate("productId", "name image slug ")
      .sort({ score: -1 });
    res.status(201).send(views);
  })
);

export default recentViewRouter;
