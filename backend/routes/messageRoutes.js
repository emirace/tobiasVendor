import express from 'express';
import Message from '../models/messageModel.js';
import expressAsyncHandler from 'express-async-handler';
import { isAuth } from '../utils.js';

const messageRouter = express.Router();

messageRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newmessage = new Message({
      conversationId: req.body.conversationId,
      sender: req.user._id,
      text: req.body.text,
    });
    try {
      const savedmessage = await newmessage.save();
      res.status(200).send({ messages: 'message sent', message: savedmessage });
    } catch (err) {
      res.status(500).send({ message: 'message sending failed', err });
    }
  })
);

messageRouter.get(
  '/:conversationId',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const messages = await Message.find({
        conversationId: req.params.conversationId,
      });
      res.status(200).send({ message: 'message fetch successful', messages });
    } catch (err) {
      res.status(500).send({ message: 'failed to fetch message', err });
    }
  })
);

export default messageRouter;
