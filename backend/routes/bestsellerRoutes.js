import express from "express";
import { isAuthOrNot } from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import BestSeller from "../models/bestSellerModel.js";

const bestsellerRouter = express.Router();

const factor = 0.9;
bestsellerRouter.put(
  "/:region/:userId",
  isAuthOrNot,
  expressAsyncHandler(async (req, res) => {
    const { userId, region } = req.params;
    const view = await BestSeller.findOne({ userId: userId });
    if (view) {
      view.score = view.score + factor;
      view.numViews = view.numViews + 1;
      const saveview = await view.save();
    } else {
      const newView = new BestSeller({
        score: factor,
        numViews: 1,
        userId,
        region,
      });
      await newView.save();
    }
    const views = await BestSeller.find();
    if (views) {
      views.map(async (v) => {
        if (userId !== v.userId.toString()) {
          v.score = v.score * factor;
          const c = await v.save();
        }
      });
    }
    res.status(201).send("Done");
  })
);

bestsellerRouter.get(
  "/:region",
  expressAsyncHandler(async (req, res) => {
    const { region } = req.params;
    const views = await BestSeller.find({ region })
      .populate("userId", "name image sold username ")
      .sort({ score: -1 });
    res.status(201).send(views);
  })
);

export default bestsellerRouter;
