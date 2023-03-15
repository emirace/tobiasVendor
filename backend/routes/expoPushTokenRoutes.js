import express from "express";
import expressAsyncHandler from "express-async-handler";
import ExpoPushToken from "../models/expoPushTokenModel.js";
import { isAdmin, isAuth } from "../utils.js";

const expoPushTokenRouter = express.Router();

expoPushTokenRouter.put(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { token } = req.body;
    const expoPushToken = await ExpoPushToken.findOne({ userId: req.user._id });
    if (expoPushToken) {
      expoPushToken.token = token;
      await expoPushToken.save();
      res.status(200).send({ success: true });
    } else {
      const newToken = new ExpoPushToken({
        userId: req.user._id,
        token,
      });
      await newToken.save();
      res.status(200).send({ success: true });
    }
  })
);

export default expoPushTokenRouter;
