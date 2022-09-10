import express from "express";
import { isAdmin, isAuth } from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import Address from "../models/addressModel.js";

const addressRouter = express.Router();

// get all addresses

addressRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const addresses = await Address.find();
    res.send(addresses);
  })
);

// add a address

addressRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const address = new Address({
      userId: req.user._id,
      meta: req.body.meta,
    });

    const newAddress = await address.save();
    res.status(201).send(newAddress);
  })
);

// update a address

addressRouter.post(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const address = await Address.findById(req.params.id);
    if (address.userId !== req.user._id) {
      if (address) {
        address.meta = req.body.meta;
        const newaddress = await address.save();
        res.status(200).send(newaddress);
      } else {
        res.status(404).send("address not found");
      }
    } else {
      res.send("Can't edit address");
    }
  })
);

// delete a address

addressRouter.delete(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const address = await Address.findById(req.params.id);
    if (address) {
      await address.remove();
      res.send("Adress deleted");
    } else {
      res.status(404).send("Address not found");
    }
  })
);

// get a address

addressRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const address = await Address.find({ userId: req.params.id });
    if (address) {
      res.status(201).send(address);
    } else {
      res.status(404).send("address not found");
    }
  })
);

export default addressRouter;
