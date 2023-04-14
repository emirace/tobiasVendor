import express from "express";
import expressAsyncHandler from "express-async-handler";
import ExpoPushToken from "../models/expoPushTokenModel.js";
import { isAdmin, isAuth } from "../utils.js";
import { sendPushNotification } from "../utils/notification.js";

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

expoPushTokenRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const { receiverId, message } = req.body;
      const expoPushToken = await ExpoPushToken.findOne({ userId: receiverId });
      if (expoPushToken) {
        console.log(expoPushToken.token);
        sendPushNotification(message, [expoPushToken.token]);
      }
      res.status(200).send({ success: true });
    } catch (error) {
      console.log(error);
    }
  })
);

export default expoPushTokenRouter;
