import express from "express";
import { isAdmin, isAuth } from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import NonLogin from "../models/nonLoginModel.js";

const nonLoginRouter = express.Router();

// get all nonLogin

nonLoginRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const nonLogin = await NonLogin.find();
    res.send(nonLogin);
  })
);

// add a address

nonLoginRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const nonLogin = new NonLogin({
      fullName: req.body.fullName,
      country: req.body.country,
      address: req.body.address,
      city: req.body.city,
      code: req.body.code,
      email: req.body.email,
      phone: req.body.phone,
      state: req.body.state,
      postalCode: req.body.zipcode,
    });

    const newAddress = await nonLogin.save();
    res.status(201).send(newAddress);
  })
);

nonLoginRouter.get(
  "/location",
  expressAsyncHandler(async (req, res) => {
    const data = req.headers["cloudfront-viewer-country-name"];
    res.status(200).send(data);
  })
);

// update a address

nonLoginRouter.put(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const address = await NonLogin.findById(req.params.id);
    if (address) {
      address.fullName = req.body.fullName;
      address.country = req.body.country;
      address.email = req.body.email;
      address.code = req.body.code;
      address.phone = req.body.phone;
      address.address = req.body.address;
      address.city = req.body.city;
      address.state = req.body.state;
      address.postalCode = req.body.postalCode;
      const newaddress = await address.save();
      res.status(200).send(newaddress);
    } else {
      res.status(404).send("address not found");
    }
  })
);

// delete a address

nonLoginRouter.delete(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    console.log(req.params.id);
    const address = await NonLogin.findById(req.params.id);
    if (address) {
      await address.remove();
      res.send("Adress deleted");
    } else {
      res.status(404).send("Address not found");
    }
  })
);

// get a address

nonLoginRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const address = await NonLogin.find({ userId: req.params.id });
    if (address) {
      res.status(201).send(address);
    } else {
      res.status(404).send("address not found");
    }
  })
);

export default nonLoginRouter;
