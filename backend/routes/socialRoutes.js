import express from 'express';
import passport from 'passport';

const socialRouter = express.Router();

const successLoginUrl = 'http://localhost:3000';
const errorLoginUrl = 'http://localhost:3000/signin';

socialRouter.get(
  '/login/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

socialRouter.get(
  '/google/callback',
  passport.authenticate('google', {
    failMessage: 'cannot login to google, please try again later',
    failureRedirect: errorLoginUrl,
    successRedirect: successLoginUrl,
  }),
  (req, res) => {
    res.send('Thank you for signing in');
  }
);

export default socialRouter;
