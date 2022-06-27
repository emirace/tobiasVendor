import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import ReportConversation from '../models/reportConversation.js';
import { isAdmin, isAuth } from '../utils.js';

const reportConversationRouter = express.Router();

reportConversationRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const existConversation = await ReportConversation.findOne({
      user: req.user._id,
    });
    if (existConversation) {
      res
        .status(200)
        .send({ message: 'conversation continue', existConversation });
      return;
    }
    const newConversation = new ReportConversation({
      user: req.user._id,
    });
    try {
      const savedConversation = await newConversation.save();
      res
        .status(200)
        .send({ message: 'conversation started', savedConversation });
    } catch (err) {
      res.status(500).send({ message: 'conversation failed', err });
    }
  })
);

reportConversationRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const conversations = await ReportConversation.find();
      res
        .status(200)
        .send({ message: 'conversation fetch successful', conversations });
    } catch (err) {
      res.status(500).send({ message: 'failed to fetch Conversation', err });
    }
  })
);

export default reportConversationRouter;
