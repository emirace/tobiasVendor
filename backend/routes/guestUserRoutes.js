import express from "express";
import { isAdmin, isAuth } from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import GuestUser from "../models/guestUser.js";

const guestUserRouter = express.Router();

// get all guestUsers

guestUserRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const guestUsers = await GuestUser.find();
    res.send(guestUsers);
  })
);

// get a guestUsers

guestUserRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const guestUser = await GuestUser.findOne();
    res.status(200).send(guestUser);
  })
);

// add a guestUser

guestUserRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await GuestUser.findOne({ email: req.body.email });
      if (user) {
        res.status(200).send(user);
      } else {
        const guestUser = new GuestUser({
          username: req.body.username,
          email: req.body.email,
          guest: true,
        });
        const newGuestUser = await guestUser.save();
        res.status(201).send(newGuestUser);
      }
    } catch (error) {}
  })
);

export default guestUserRouter;
