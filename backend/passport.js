import dotenv from 'dotenv';
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
import User from './models/userModel.js';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/auth/google/callback',
      //   passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, cb) => {
      const defaultUser = {
        name: `${profile.name.givenName} ${profile.name.familyName}`,
        email: profile.email[0].value,
        image: (profile.photos = [0].value),
        googleId: profile.id,
      };
      const user = await User.findOrCreate(
        { googleId: profile.id },
        function (err, user) {
          console.log('new or login user', user);
          return cb(err, user);
        }
      );
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  const user = await User.findOne({ where: { id } }).catch((err) => {
    console.log('error deserialize', err);
    cb(err, null);
  });
  console.log(user);
  if (user) cb(null, user);
});
