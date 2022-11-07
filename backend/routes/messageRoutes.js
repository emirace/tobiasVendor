import express from "express";
import Message from "../models/messageModel.js";
import expressAsyncHandler from "express-async-handler";
import { isAuth } from "../utils.js";
import Conversation from "../models/conversationModel.js";

const messageRouter = express.Router();

messageRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const conversation = await Conversation.findById(req.body.conversationId);
      if (conversation) {
        conversation.needRespond = req.user.isAdmin ? false : true;
        conversation.updatedAt = Date.now();
        await conversation.save();
        console.log("conversation", conversation);
        const newmessage = new Message({
          conversationId: req.body.conversationId,
          sender: req.user._id,
          text: req.body.text,
          image: req.body.image,
        });
        const savedmessage = await newmessage.save();
        res
          .status(200)
          .send({ messages: "message sent", message: savedmessage });
      } else {
        res.status(500).send({
          message: "Conversation not Found",
          err: { message: "Conversation not Found" },
        });
      }
    } catch (err) {
      res.status(500).send({ message: "message sending failed", err });
    }
  })
);

messageRouter.post(
  "/support",
  expressAsyncHandler(async (req, res) => {
    try {
      console.log("hello");
      const conversation = await Conversation.findById(req.body.conversationId);
      if (conversation) {
        console.log("hello2");
        conversation.needRespond = req.body.senderId.isAdmin ? false : true;
        conversation.updatedAt = Date.now();
        console.log("hello2a");
        await conversation.save();
        const newmessage = new Message({
          conversationId: req.body.conversationId,
          sender: req.body.senderId,
          text: req.body.text,
        });
        console.log("hello3");
        const savedmessage = await newmessage.save();
        res
          .status(200)
          .send({ messages: "message sent", message: savedmessage });
      } else {
        res.status(500).send({
          message: "Conversation not Found",
          err: { message: "Conversation not Found" },
        });
      }
    } catch (err) {
      res.status(500).send({ message: "message sending failed", err });
    }
  })
);

messageRouter.get(
  "/:conversationId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const messages = await Message.find({
        conversationId: req.params.conversationId,
      });
      if (messages) {
        res.status(200).send({ message: "message fetch successful", messages });
      } else {
        res.status(404).send("no messages found");
      }
    } catch (err) {
      res.status(500).send({ message: "failed to fetch message", err });
    }
  })
);
messageRouter.get(
  "/support/:conversationId",
  expressAsyncHandler(async (req, res) => {
    try {
      const messages = await Message.find({
        conversationId: req.params.conversationId,
      });
      if (messages) {
        res.status(200).send({ message: "message fetch successful", messages });
      } else {
        res.status(404).send("no messages found");
      }
    } catch (err) {
      res.status(500).send({ message: "failed to fetch message", err });
    }
  })
);

export default messageRouter;
