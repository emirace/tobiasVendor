import express from "express";
import { isAdmin, isAuth } from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import Brand from "../models/brandModel.js";

const brandRouter = express.Router();

// get all brands
const pageSize = 100;
brandRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const { q, page } = req.query;

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
              {
                alpha: {
                  $regex: q,
                  $options: "i",
                },
              },
            ],
          }
        : {};
    const brands = await Brand.find({ ...queryFilter })
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    res.send(brands);
  })
);

brandRouter.get(
  "/search",
  expressAsyncHandler(async (req, res) => {
    const { q } = req.query;
    const brands = await Brand.find({
      name: { $regex: q.toLowerCase() },
      $options: "i",
    }).limit(10);
    res.send(brands);
  })
);

// add a brand

brandRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    const exist = await Brand.findOne({ name: req.body.name });
    if (exist) return res.status(200).send("Done");
    const brand = new Brand({
      name: req.body.name,
      alpha: req.body.alpha,
    });
    const newbrand = await brand.save();
    res.status(200).send("Done");
  })
);

// update a brand

brandRouter.put(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const brand = await Brand.findById(req.params.id);
    if (brand.userId !== req.user._id) {
      if (brand) {
        brand.name = req.body.name;
        brand.alpha = req.body.alpha;
        const newbrand = await brand.save();
        res.status(200).send(newbrand);
      } else {
        res.status(404).send("brand not found");
      }
    } else {
      res.send("Can't edit brand");
    }
  })
);

// delete a brand

brandRouter.delete(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const brand = await Brand.findById(req.params.id);
    if (brand) {
      await brand.remove();
      res.send("Brand deleted");
    } else {
      res.status(404).send("Brand not found");
    }
  })
);

// get a brand

brandRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const brand = await Brand.find({ userId: req.params.id });
    if (brand) {
      res.status(201).send(brand);
    } else {
      res.status(404).send("brand not found");
    }
  })
);

export default brandRouter;
