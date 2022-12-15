import express from "express";
import { isAuth } from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import RebundleSeller from "../models/rebuldleSellerModel.js";

const rebundleSellerRouter = express.Router();

rebundleSellerRouter.get(
  "/checkbundle/:seller",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    console.log("rebundle", req.params.seller);
    const rebundleSeller = await RebundleSeller.findOne({
      userId: req.user._id,
      sellerId: req.params.seller,
      count: { $gte: 1 },
    });
    console.log("rebundle", req.user._id, req.params.seller);
    console.log("rebundle", rebundleSeller);
    if (rebundleSeller) {
      console.log(rebundleSeller);
      res.status(200).send({ success: true, seller: rebundleSeller });
    } else {
      res.send({ success: false });
    }
  })
);

export default rebundleSellerRouter;
