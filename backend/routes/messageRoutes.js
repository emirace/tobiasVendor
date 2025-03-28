import express from "express";
import Message from "../models/messageModel.js";
import expressAsyncHandler from "express-async-handler";
import { isAuth, sendEmail } from "../utils.js";
import Conversation from "../models/conversationModel.js";
import User from "../models/userModel.js";

const messageRouter = express.Router();

messageRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      console.log(req.body);
      const conversation = await Conversation.findById(req.body.conversationId);
      if (conversation) {
        conversation.needRespond = req.user.isAdmin ? false : true;
        conversation.updatedAt = Date.now();
        await conversation.save();
        const newmessage = new Message({
          conversationId: req.body.conversationId,
          sender: req.user._id,
          text: req.body.text,
          image: req.body.image,
        });
        const savedmessage = await newmessage.save();
        if (conversation.conversationType === "support" && !req.body.sendMail) {
          console.log("sendMail", req.body.sendMail);

          const realUser = await User.findById(req.body.receiverId);

          sendEmail({
            to: realUser ? realUser.email : req.body.guestEmail,
            subject: "REPEDDLE SUPPORT ",
            template: "support",
            context: {
              username: realUser ? realUser.username : "Tribe",
              url: req.body.url,
              message: req.body.text,
            },
          });
        }
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
      const conversation = await Conversation.findById(req.body.conversationId);
      if (conversation) {
        conversation.needRespond = req.body.isAdmin ? false : true;
        conversation.updatedAt = Date.now();
        await conversation.save();
        const newmessage = new Message({
          conversationId: req.body.conversationId,
          sender: req.body.senderId,
          text: req.body.text,
          image: req.body.image,
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
