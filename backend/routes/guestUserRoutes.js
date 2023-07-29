import express from 'express';
import { isAdmin, isAuth } from '../utils.js';
import expressAsyncHandler from 'express-async-handler';
import GuestUser from '../models/guestUser.js';
import Newsletters from '../models/newslettersModel.js';

const guestUserRouter = express.Router();

// get all guestUsers

guestUserRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const guestUsers = await GuestUser.find();
    res.send(guestUsers);
  })
);

// get a guestUsers

guestUserRouter.get(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const guestUser = await GuestUser.findById(req.params.id);
    res.status(200).send(guestUser);
  })
);

// add a guestUser

guestUserRouter.post(
  '/',
  expressAsyncHandler(async (req, res) => {
    try {
      const { email, username } = req.body;
      const user = await GuestUser.findOne({ email });
      if (user) {
        res.status(200).send(user);
      } else {
        const guestUser = new GuestUser({
          username,
          email,
          guest: true,
        });
        let newsletter = await Newsletters.findOne({ email });

        if (newsletter) {
          newsletter.isDeleted = false;
          // newsletter.url = url;
        } else {
          newsletter = new Newsletters({
            email,
            emailType: 'Newsletter',
            url: 'co.za',
          });
        }
        console.log('newsletter', newsletter);
        await newsletter.save();
        const newGuestUser = await guestUser.save();
        res.status(201).send(newGuestUser);
      }
    } catch (error) {}
  })
);

export default guestUserRouter;
