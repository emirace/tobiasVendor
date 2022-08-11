import express from "express";
import { isAdmin, isAuth, isAuthOrNot } from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import BestSeller from "../models/BestSellerModel.js";

const bestsellerRouter = express.Router();

const factor = 0.9;
bestsellerRouter.put(
  "/:userId",
  isAuthOrNot,
  expressAsyncHandler(async (req, res) => {
    const { userId } = req.params;
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
  "/",
  expressAsyncHandler(async (req, res) => {
    const views = await BestSeller.find()
      .populate("userId", "name image sold username ")
      .sort({ score: -1 });
    res.status(201).send(views);
  })
);

export default bestsellerRouter;
