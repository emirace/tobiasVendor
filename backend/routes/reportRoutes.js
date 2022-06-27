import express from 'express';
import Message from '../models/messageModel.js';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin } from '../utils.js';
import Report from '../models/reportModel.js';

const reportRouter = express.Router();

reportRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newReport = new Report({
      reportedUser: req.body.reportedUser,
      user: req.body.user,
      admin: req.user.isAdmin,
      text: req.body.text,
    });
    const savedReport = await newReport.save();
    res.status(200).send({ messages: 'Report sent', savedReport });
  })
);

// reportRouter.get(
//   '/',
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     const reports = await Report.aggregate([
//       {
//         $group: {
//           _id: '$user',
//           user: { $addToSet: '$$ROOT' },
//         },
//       },
//     ]);
//     res.status(200).send(reports);
//   })
// );

reportRouter.get(
  '/:user',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const reports = await Report.find({ user: req.params.user });
    res.status(200).send({ message: 'Report fetch successful', reports });
  })
);

export default reportRouter;
