import express from "express";
import { isAdmin, isAuth } from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import OtherBrand from "../models/otherBrandModel.js";
import Brand from "../models/brandModel.js";

const otherBrandRouter = express.Router();

// get all brands
const pageSize = 100;
otherBrandRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { q, page, size } = req.query;

    const queryFilter =
      q && q !== "all"
        ? {
            $or: [
              {
                name: {
                  $regex: q,
                  $options: "i",
                },
              },
            ],
          }
        : {};
    const brands = await OtherBrand.find({ ...queryFilter })
      .skip(size ? size * (page - 1) : pageSize * (page - 1))
      .limit(size || pageSize);
    res.send(brands);
  })
);

// add a brand
otherBrandRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    console.log(req.body);
    const exist = await OtherBrand.findOne({ name: req.body.name });
    if (exist) return res.status(200).send("Done");
    const brand = new OtherBrand({
      name: req.body.name,
    });
    await brand.save();
    res.status(200).send("Done");
  })
);

//update a brand
otherBrandRouter.put(
  "/save/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const brand = await OtherBrand.findById(req.params.id);
    if (brand) {
      brand.isAdded = true;
      await brand.save();
      const newBrand = new Brand({
        name: brand.name,
        alpha: "",
      });
      await newBrand.save();
      res.status(200).send("brand status updated");
    } else {
      res.status(404).send("OtherBrand not found");
    }
  })
);

otherBrandRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    console.log(req.body, req.params);
    const brand = await OtherBrand.findById(req.params.id);
    if (brand) {
      brand.name = req.body.name;
      await brand.save();
      res.status(200).send("brand name updated");
    } else {
      res.status(404).send("OtherBrand not found");
    }
  })
);

// delete a brand
otherBrandRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const brand = await OtherBrand.findById(req.params.id);
    if (brand) {
      await brand.remove();
      res.status(200).send("OtherBrand deleted");
    } else {
      res.status(404).send("OtherBrand not found");
    }
  })
);

export default otherBrandRouter;
