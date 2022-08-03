import express from "express";
import expressAsyncHandler from "express-async-handler";
import Conversation from "../models/conversationModel.js";
import { isAdmin, isAuth } from "../utils.js";

const conversationRouter = express.Router();

conversationRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const conversations = await Conversation.find()
      .populate("productId", "username image")
      .populate("userId", "username image");
    if (conversations) {
      res.status(200).send(conversations);
    } else {
      res.status(200).send("no conversations found");
    }
  })
);

conversationRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (req.user._id === req.body.recieverId) {
      throw { message: "you cannot message yourself" };
    }
    const existConversation = await Conversation.findOne({
      members: { $all: [req.user._id, req.body.recieverId] },
      $or: [{ productId: req.body.productId }, { userId: req.body.productId }],
      conversationType: req.body.type,
    });
    if (existConversation) {
      console.log("b4", req.body);
      res.status(200).send(existConversation);
      return;
    }
    console.log("after", req.body);

    const newConversation =
      req.body.type === "product"
        ? new Conversation({
            members: [req.user._id, req.body.recieverId],
            productId: req.body.productId,
            conversationType: req.body.type,
          })
        : req.body.type === "user"
        ? new Conversation({
            members: [req.user._id, req.body.recieverId],
            userId: req.body.productId,
            conversationType: req.body.type,
          })
        : req.body.type === "reportProduct"
        ? new Conversation({
            members: [req.user._id],
            productId: req.body.productId,
            conversationType: req.body.type,
          })
        : req.body.type === "reportUser"
        ? new Conversation({
            members: [req.user._id],
            userId: req.body.recieverId,
            conversationType: req.body.type,
          })
        : "";
    const savedConversation = await newConversation.save();
    res.status(200).send(savedConversation);
  })
);

conversationRouter.get(
  "/user",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const conversations = await Conversation.find({
      members: { $in: [req.user._id] },
    }).sort({ createdAt: -1 });
    if (conversations) {
      res
        .status(200)
        .send({ message: "conversation fetch successful", conversations });
    } else {
      res.status(500).send("Fail to fetch conversation");
    }
  })
);

conversationRouter.get(
  "/find/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const conversation = await Conversation.findById(req.params.id);
    if (conversation) {
      res.send(conversation);
    } else {
      res.status(500).send({ message: "", err });
    }
  })
);
conversationRouter.get(
  "/reports",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const report = await Conversation.find({
      conversationType: { $in: ["reportUser", "reportProduct"] },
    });
    if (report) {
      res.status(200).send(report);
    } else {
      res.status(404).send("No report Found");
    }
  })
);

export default conversationRouter;
