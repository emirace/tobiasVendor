import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Conversation from '../models/conversationModel.js';
import { isAuth } from '../utils.js';

const conversationRouter = express.Router();

conversationRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (req.user._id === req.body.recieverId) {
      throw { message: 'you cannot message yourself' };
    }
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

conversationRouter.get(
  '/find/:firstUser/:secondUser',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const conversation = await Conversation.findOne({
        members: { $all: [req.params.firstUser, req.params.secondUser] },
      });
      res.send(conversation);
    } catch (err) {
      res.status(500).send({ message: '', err });
    }
  })
);

export default conversationRouter;
