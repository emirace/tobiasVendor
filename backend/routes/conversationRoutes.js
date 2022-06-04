import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Conversation from '../models/conversationModel.js';
import { isAuth } from '../utils.js';

const conversationRouter = express.Router();

conversationRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newConversation = new Conversation({
      members: [req.user._id, req.body.recieverId],
    });
    try {
      const savedConversation = await newConversation.save();
      res.status(200).send({ message: 'message sent', savedConversation });
    } catch (err) {
      res.status(500).send({ message: 'message sending failed', err });
    }
  })
);

conversationRouter.get(
  '/user',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const conversations = await Conversation.find({
        members: { $in: [req.user._id] },
      });
      res
        .status(200)
        .send({ message: 'conversation fetch successful', conversations });
    } catch (err) {
      res.status(500).send({ message: 'failed to fetch Conversation', err });
    }
  })
);

export default conversationRouter;
