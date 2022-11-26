import express from "express";
import { isAdmin, isAuth, isAuthOrNot } from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import RecentView from "../models/recentViewModel.js";

const recentViewRouter = express.Router();

const factor = 0.9;
recentViewRouter.put(
  "/:region/:productId",
  isAuthOrNot,
  expressAsyncHandler(async (req, res) => {
    const { productId, region } = req.params;
    const view = await RecentView.findOne({ productId: productId });
    if (view) {
      view.score = view.score + factor;
      view.numViews = view.numViews + 1;
      const saveview = await view.save();
    } else {
      const newView = new RecentView({
        score: factor,
        numViews: 1,
        productId,
        region,
      });
      await newView.save();
    }
    const views = await RecentView.find();
    if (views) {
      views.map(async (v) => {
        if (productId !== v.productId.toString()) {
          v.score = v.score * factor;
          const c = await v.save();
        }
      });
    }
    res.status(201).send("Done");
  })
);

recentViewRouter.get(
  "/:region",
  expressAsyncHandler(async (req, res) => {
    const { region } = req.params;
    const views = await RecentView.find({ region })
      .populate("productId", "name image slug ")
      .sort({ score: -1 });
    res.status(201).send(views);
  })
);

export default recentViewRouter;
