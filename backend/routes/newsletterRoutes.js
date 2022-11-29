import express from "express";
import { isAdmin, isAuth } from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import Newsletters from "../models/newslettersModel.js";

const newsletterRouter = express.Router();

// get all newsletters

newsletterRouter.get(
  "/newsletter",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newsletters = await Newsletters.find({
      emailType: "Newsletter",
    }).sort({ createdAt: -1 });
    res.send(newsletters);
  })
);

newsletterRouter.get(
  "/rebatch",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const rebatchs = await Newsletters.find({ emailType: "Rebatch" }).sort({
      createdAt: -1,
    });
    res.send(rebatchs);
  })
);

// add a newsletter

newsletterRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    const newsletter = new Newsletters({
      email: req.body.email,
      emailType: req.body.emailType,
    });

    const newNewsletter = await newsletter.save();
    res.status(201).send(newNewsletter);
  })
);

// update a newsletter

// newsletterRouter.post(
//   "/:id",
//   isAuth,
//   expressAsyncHandler(async (req, res) => {
//     const newsletter = await Newsletters.findById(req.params.id);
//     if (newsletter.userId !== req.user._id) {
//       if (newsletter) {
//         newsletter.meta = req.body.meta;
//         const newaddress = await newsletter.save();
//         res.status(200).send(newaddress);
//       } else {
//         res.status(404).send("newsletter not found");
//       }
//     } else {
//       res.send("Can't edit address");
//     }
//   })
// );

// delete a address

newsletterRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newsletter = await Newsletters.findById(req.params.id);
    if (newsletter) {
      await newsletter.remove();
      res.send("Adress deleted");
    } else {
      res.status(404).send("Newsletters not found");
    }
  })
);

// get a newsletter

newsletterRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const newsletter = await Newsletters.findById(req.params.id);
    if (newsletter) {
      res.status(201).send(newsletter);
    } else {
      res.status(404).send("newsletter not found");
    }
  })
);

export default newsletterRouter;
