import express from "express";
import expressAsyncHandler from "express-async-handler";
import Gig from "../models/gigModel.js";
import { isAdmin, isAuth } from "../utils.js";

const gigRouter = express.Router();

gigRouter.get(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const gig = await Gig.findById(req.params.id).populate("orderId");
    if (gig) {
      res.status(200).send(gig);
    } else {
      res.status(404).send("gig not found");
    }
  })
);

gigRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const gig = await Gig.findById(req.params.id).populate("orderId");
    if (gig) {
      gig.status = req.body.status || true;
      await gig.save();
      res.status(200).send("gig status changed");
    } else {
      res.status(404).send("gig not found");
    }
  })
);

export default gigRouter;
