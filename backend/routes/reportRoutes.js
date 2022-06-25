import express from 'express';
import Message from '../models/messageModel.js';
import expressAsyncHandler from 'express-async-handler';
import { isAuth } from '../utils.js';
import Report from '../models/reportModel.js';

const reportRouter = express.Router();

reportRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newReport = new Report({
      reportedUser: req.body.reportedUser,
      sender: req.user._id,
      reports: {
        admin: req.user.isAdmin,
        text: req.body.text,
      },
    });
    try {
      const savedReport = await newReport.save();
      res.status(200).send({ messages: 'Report sent', message: savedReport });
    } catch (err) {
      res.status(500).send({ message: 'REport sending failed', err });
    }
  })
);

reportRouter.get(
  '/:sender',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const report = await Report.find({ sender: req.params.sender });
      res.status(200).send({ message: 'Report fetch successful', reports });
    } catch (err) {
      res.status(500).send({ message: 'failed to fetch report', err });
    }
  })
);

export default reportRouter;
