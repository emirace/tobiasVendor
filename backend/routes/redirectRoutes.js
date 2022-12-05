import express from "express";
import expressAsyncHandler from "express-async-handler";
import Redirect from "../models/redirectModel.js";
import { isAdmin, isAuth } from "../utils.js";
import crypto from "crypto";

const redirectRouter = express.Router();

redirectRouter.put(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { token } = req.body;
    const redirect = await Redirect.findOne({ owner: req.user._id });
    if (redirect) {
      if (redirect.compareToken(token)) {
        res.status(200).send({ success: true });
      } else {
        res
          .status(200)
          .send({ success: false, message: "Invalid redirect token" });
      }
    } else {
      res.status(200).send({ success: false, message: "no redirect token" });
    }
  })
);

redirectRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const redirectToken = crypto.randomBytes(20).toString("hex");
    const exist = await Redirect.findOne({ owner: req.user._id });
    if (exist) {
      exist.token = redirectToken;
      const saveredirect = await exist.save();
      res.status(200).send({ token: redirectToken, success: true });
    } else {
      const redirect = new Redirect({
        owner: req.user._id,
        token: redirectToken,
      });
      const saveredirect = await redirect.save();
      res.status(200).send({ token: redirectToken, success: true });
    }
  })
);

export default redirectRouter;
