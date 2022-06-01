import express from 'express';
const passport = require('passport');

const socialRouter = express.Router();

socialRouter.get(
  '/login/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

socialRouter.get(
  '/google/callback',
  passport.authorization('google', {
    failMessage: 'cannot login to google, please try again later',
    failure,
  })
);
