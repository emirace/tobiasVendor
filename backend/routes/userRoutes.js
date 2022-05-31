import express from 'express';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import { generateToken, isAdmin, isAuth } from '../utils.js';
import expressAsyncHandler from 'express-async-handler';

const userRouter = express.Router();

userRouter.get(
  '/top-sellers',
  expressAsyncHandler(async (req, res) => {
    const topSellers = await User.find({ isSeller: true })
      .sort({ rating: -1 })
      .limit(10);
    res.send(topSellers);
  })
);

userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find();
    res.send(users);
  })
);

userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.image = req.body.image || user.image;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        isSeller: updatedUser.isSeller,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: 'User not Found' });
    }
  })
);

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isSeller: user.isSeller,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Invalid email or password' });
  })
);

userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      image: '/images/pimage.png',
      password: bcrypt.hashSync(req.body.password),
      rating: 0,
      numReviews: 0,
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isSeller: user.isSeller,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

productRouter.post(
  '/:id/reviews',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (user) {
      if (user.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: 'You already submitted a review' });
      }
      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      user.reviews.push(review);
      user.numReviews = product.reviews.length;
      user.rating =
        user.reviews.reduce((a, c) => c.rating + a, 0) / user.reviews.length;

      const updatedUser = await user.save();

      res.status(201).send({
        message: 'Review Created',
        review: updatedUser.reviews[updatedUser.reviews.length - 1],
        numReviews: userId.numReviews,
        rating: user.rating,
      });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.get(
  '/seller/:id',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
      .populate('likes')
      .populate('saved');

    if (user) {
      res.send({
        name: user.name,
        seller: user.seller,
        email: user.email,
        followers: user.followers,
        following: user.following,
        likes: user.likes,
        saved: user.saved,
      });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.put(
  '/follow/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user1 = await User.findById(req.params.id);
    const user = await User.findById(req.user._id);
    if (user1 && user) {
      user1.followers.push(req.user._id);
      const updatedUser = await user1.save();
      res.send({
        message: 'Following',
        name: updatedUser.name,
        seller: updatedUser.seller,
        email: updatedUser.email,
        followers: updatedUser.followers,
        following: updatedUser.following,
      });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }

    if (user && user1) {
      user.following.push(req.params.id);
      const updatedUser = await user.save();
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.put(
  '/unfollow/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user1 = await User.findById(req.params.id);
    const user = await User.findById(req.user._id);
    if (user1 && user) {
      user1.followers.pull(req.user._id);
      const updatedUser = await user1.save();
      res.send({
        message: 'Following',
        name: updatedUser.name,
        seller: updatedUser.seller,
        email: updatedUser.email,
        followers: updatedUser.followers,
        following: updatedUser.following,
      });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }

    if (user && user1) {
      user.following.pull(req.params.id);
      const updatedUser = await user.save();
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.get(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send({
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isSeller: user.isSeller,
      });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
      user.isSeller = Boolean(req.body.isSeller);
      const updatedUser = await user.save();
      res.send({
        message: 'User Updated',
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isSeller: user.isSeller,
      });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (User) {
      if (user.email === 'admin@example.com') {
        res.status(400).send({ message: 'Can Not Delete Admin User' });
        return;
      }
      await user.remove();
      res.send({ message: 'User Deleted' });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

export default userRouter;
