import express from "express";
import { isAdmin, isAuth } from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import Coupon from "../models/couponModel.js";

const couponRouter = express.Router();

// get all coupons

couponRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const coupons = await Coupon.find();
    res.send(coupons);
  })
);

// get a coupon

couponRouter.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const code = req.params.id;
    const coupon = await Coupon.find({ code });
    if (coupon) {
      res.status(201).send(coupon);
    } else {
      res.status(404).send("Invalid coupon code, please try again");
    }
  })
);

couponRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const coupon = new Coupon({
      code: "abc123",
      type: "fixed",
      value: 30,
    });
    coupon.save();
    res.send(coupon);
  })
);

couponRouter.delete(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const code = req.params.id;
    const coupon = await Coupon.find({ code });
    if (coupon) {
      coupon.remove();
      res.status(201).send("Coupon deleted Successfully");
    }
  })
);

export default couponRouter;
