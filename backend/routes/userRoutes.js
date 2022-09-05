import express from "express";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import {
  generateOTP,
  generateToken,
  isAdmin,
  isAuth,
  sendEmail,
} from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import Account from "../models/accountModel.js";
import crypto from "crypto";
import VerificationToken from "../models/verificationTokenModel.js";
import { plainEmailTemp } from "../utils/mailTemplete.js";

const userRouter = express.Router();

// get all seller, which is all users now

userRouter.get(
  "/:region/top-sellers",
  expressAsyncHandler(async (req, res) => {
    const { region } = req.params;
    const topSellers = await User.find({ isSeller: true, region })
      .select("username image badge ")
      .sort({ rating: -1 })
      .limit(10);

    res.send({
      topSellers,
    });
  })
);

userRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const current = new Date();
    if (user) {
      user.about = req.body.about || user.about;
      user.username = req.body.username || user.username;
      user.usernameUpdate = req.body.username ? current : user.usernameUpdate;
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
      user.dob = req.body.dob || user.dob;
      user.accountName = req.body.accountName || user.accountName;
      user.accountNumber = req.body.accountNumber || user.accountNumber;
      user.bankName = req.body.bankName || user.bankName;
      user.phone = req.body.phone || user.phone;
      user.address = req.body.address || user.address;
      user.image = req.body.image || user.image;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        isSeller: updatedUser.isSeller,
        email: updatedUser.email,
        about: updatedUser.about,
        image: updatedUser.image,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: "User not Found" });
    }
  })
);

userRouter.post(
  "/:region/signin",
  expressAsyncHandler(async (req, res) => {
    const { region } = req.params;
    const user = await User.findOne({ email: req.body.email, region });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          username: user.username,
          usernameUpdate: user.usernameUpdate,
          firstName: user.firstName,
          lastName: user.lastName,
          region: user.region,
          email: user.email,
          isSeller: user.isSeller,
          isAdmin: user.isAdmin,
          image: user.image,

          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: "Invalid email or password" });
  })
);

userRouter.post(
  "/:region/signup",
  expressAsyncHandler(async (req, res) => {
    const { region } = req.params;
    const newUser = new User({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      usernameUpdate: new Date(),
      email: req.body.email,
      phone: req.body.phone,
      image: "/images/pimage.png",
      password: bcrypt.hashSync(req.body.password),
      rating: 0,
      region,
      numReviews: 0,
    });

    const OTP = generateOTP();

    const newVerificationToken = new VerificationToken({
      owner: newUser._id,
      token: OTP,
    });
    const verificationToken = await newVerificationToken.save();
    const user = await newUser.save();
    const message = `
    <h1> Welcome to Repeddle</h1>
    <p>Please Verify Your Email To Continue. Your Verification code id</p>
<h3>${OTP}</h3>
    `;

    sendEmail({
      to: newUser.email,
      subject: "Verify your email account",
      text: message,
    });
    await Account.create({
      userId: user.id,
      balance: 0,
      currency: region === "ZAR" ? "R " : "N ",
    });
    res.send({
      _id: user._id,
      name: user.name,
      username: user.username,
      region: user.region,
      firstName: user.firstName,
      usernameUpdate: user.usernameUpdate,
      lastName: user.lastName,
      email: user.email,
      isSeller: user.isSeller,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

userRouter.post(
  "/verifyemail",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { otp } = req.body;
    const userId = req.user._id;
    if (!userId || !otp.trim())
      return res.status(500).send({ message: "Invalid user or token" });

    const user = await User.findById(userId);
    if (user) {
      if (user.isVerifiedEmail)
        return res
          .status(500)
          .send({ message: "This user is already verified" });

      const token = await VerificationToken.findOne({ owner: user._id });
      if (!token) return res.status(500).send({ message: "User not found " });

      const isMatched = await token.compareToken(otp);
      if (!isMatched)
        return res
          .status(500)
          .send({ message: "Please, provide a valid token" });

      user.isVerifiedEmail = true;
      await VerificationToken.findByIdAndDelete(token._id);
      await user.save();
      sendEmail({
        to: user.email,
        subject: "Email Verified Successfully",
        text: plainEmailTemp(
          "Email Varified Successfully",
          "Thanks for connecting with us"
        ),
      });
      res.status(200).send({ message: "Your email is verified" });
    } else {
      res.status(404).send({ message: "User not Found" });
    }
  })
);

userRouter.post(
  "/:url/forgetpassword",
  expressAsyncHandler(async (req, res) => {
    const { url } = req.params;
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const resetToken = crypto.randomBytes(20).toString("hex");
      user.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
      user.resetPasswordExpire = Date.now() + 10 * (60 * 1000);
      await user.save();
      const resetUrl = `https://${url}/resetpassword/${resetToken}`;
      const message = `
<h1> You have requested a password reset</h1>
<p>Please go to this link to reset your password</p>
<a href=${resetUrl} clicktracking=off>${resetUrl}
`;
      try {
        sendEmail({
          to: user.email,
          text: message,
          subject: "Password Reset",
        });

        res
          .status(200)
          .send({ success: true, message: "Email sent", resetUrl });
      } catch (error) {
        user.resetPasswordExpire = undefined;
        user.resetPasswordToken = undefined;
        await user.save();
        res.status(500).send({
          success: false,
          message: " hello Encounter problem sending email",
        });
      }
    } else {
      res
        .status(404)
        .send({ success: false, message: "Encounter problem sending email" });
    }
  })
);

userRouter.post(
  "/resetpassword/:resetToken",
  expressAsyncHandler(async (req, res) => {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: {
        $gt: Date.now(),
      },
    });
    if (user) {
      user.password = bcrypt.hashSync(req.body.password);
      user.resetPasswordExpire = undefined;
      user.resetPasswordToken = undefined;
      await user.save();
      res
        .status(201)
        .send({ success: true, message: "Password Reset Success" });
    } else {
      res.status(400).send({ message: "Invalid Reset Token" });
    }
  })
);

userRouter.post(
  "/google-signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res.send({
        _id: user._id,
        name: user.name,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isSeller: user.isSeller,
        isAdmin: user.isAdmin,
        image: user.image,

        token: generateToken(user),
      });
      return;
    }
    res.status(401).send({ message: "Invalid email or password" });
  })
);

userRouter.post(
  "/google-signup",
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      image: req.body.image,
      password: null,
      rating: 0,
      numReviews: 0,
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isSeller: user.isSeller,
      isAdmin: user.isAdmin,
      image: user.image,
      token: generateToken(user),
    });
  })
);

userRouter.post(
  "/:id/reviews",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (user) {
      if (user.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: "You already submitted a review" });
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
        message: "Review Created",
        review: updatedUser.reviews[updatedUser.reviews.length - 1],
        numReviews: userId.numReviews,
        rating: user.rating,
      });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

userRouter.get(
  "/seller/:id",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
      .populate("likes")
      .populate("saved");

    if (user) {
      res.send({
        _id: user._id,
        name: user.name,
        usernameUpdate: user.usernameUpdate,
        activeUpdate: user.activeUpdate,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        image: user.image,
        about: user.about,
        followers: user.followers,
        following: user.following,
        likes: user.likes,
        saved: user.saved,
        sold: user.sold,
        createdAt: user.createdAt,
        numReviews: user.numReviews,
        rating: user.rating,
        phone: user.phone,
        isAdmin: user.isAdmin,
        address: user.address,
        active: user.active,
        badge: user.badge,
        dob: user.dob,
        accountName: user.accountName,
        accountNumber: user.accountNumber,
        bankName: user.bankName,
      });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

userRouter.put(
  "/follow/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user1 = await User.findById(req.params.id);
    const user = await User.findById(req.user._id);
    if (user1 && user) {
      if (user1.followers.includes(req.user._id)) {
        res.send({ message: "Already following this user" });
        return;
      } else {
        user1.followers.push(req.user._id);
        const updatedUser = await user1.save();
        res.send({
          _id: updatedUser._id,
          name: updatedUser.name,
          username: updatedUser.username,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          image: updatedUser.image,
          about: updatedUser.about,
          followers: updatedUser.followers,
          following: updatedUser.following,
          likes: updatedUser.likes,
          saved: updatedUser.saved,
          message: "Following",
          sold: updatedUser.sold,
          createdAt: updatedUser.createdAt,
          rating: updatedUser.rating,
          numReviews: updatedUser.numReviews,
        });
      }
    } else {
      res.status(404).send({ message: "User Not Found" });
    }

    if (user && user1) {
      user.following.push(req.params.id);
      const updatedUser = await user.save();
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

userRouter.put(
  "/unfollow/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user1 = await User.findById(req.params.id);
    const user = await User.findById(req.user._id);
    if (user1 && user) {
      user1.followers.pull(req.user._id);
      const updatedUser = await user1.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        image: updatedUser.image,
        about: updatedUser.about,
        followers: updatedUser.followers,
        following: updatedUser.following,
        likes: updatedUser.likes,
        saved: updatedUser.saved,
        message: "Following",
        createdAt: updatedUser.createdAt,
        sold: updatedUser.sold,
        rating: updatedUser.rating,
        numReviews: updatedUser.numReviews,
      });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }

    if (user && user1) {
      user.following.pull(req.params.id);
      const updatedUser = await user.save();
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

userRouter.get(
  "/followers/:id",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).populate("followers");
    let followerList = [];
    user.followers.map((f) => {
      const { _id, name, image } = f;
      followerList.push({ _id, name, image });
    });
    res.send(followerList);
  })
);

userRouter.get(
  "/following/:id",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).populate("following");
    let followingList = [];
    user.following.map((f) => {
      const { _id, name, image } = f;
      followingList.push({ _id, name, image });
    });
    res.send(followingList);
  })
);
userRouter.get(
  "/profile/user",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      res.send({
        _id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        usernameUpdate: user.usernameUpdate,
        email: user.email,
        image: user.image,
        about: user.about,
        followers: user.followers,
        following: user.following,
        likes: user.likes,
        saved: user.saved,
        sold: user.sold,
        createdAt: user.createdAt,
        numReviews: user.numReviews,
        rating: user.rating,
        phone: user.phone,
        isAdmin: user.isAdmin,
        address: user.address,
        active: user.active,
        badge: user.badge,
        dob: user.dob,
        accountName: user.accountName,
        accountNumber: user.accountNumber,
        bankName: user.bankName,
      });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);
// get all users admin

// userRouter.get(
//   "/:region",
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     const { region } = req.params;
//     const users = await User.find({ region }).sort({ createdAt: -1 });
//     res.send(users);
//   })
// );

userRouter.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
        isSeller: user.isSeller,
      });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

userRouter.get(
  "/profile/user",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      res.send({
        _id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        image: user.image,
        about: user.about,
        followers: user.followers,
        following: user.following,
        likes: user.likes,
        saved: user.saved,
        sold: user.sold,
        createdAt: user.createdAt,
        numReviews: user.numReviews,
        rating: user.rating,
        phone: user.phone,
        isAdmin: user.isAdmin,
        address: user.address,
        active: user.active,
        badge: user.badge,
        dob: user.dob,
      });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

userRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    const useractive = () => (req.body.active === "yes" ? true : false);
    const userbadge = () => (req.body.badge === "yes" ? true : false);
    if (user) {
      user.username = user.username;
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
      user.dob = req.body.dob || user.dob;
      user.activeUpdate = req.body.active === "" ? "" : new Date();
      user.phone = req.body.phone || user.phone;
      user.address = req.body.address || user.address;
      user.about = req.body.about || user.about;
      user.image = req.body.image || user.image;
      user.active = req.body.active === "" ? user.active : useractive();
      user.badge = req.body.badge === "" ? user.badge : userbadge();

      const updatedUser = await user.save();
      res.send({
        message: "User Updated",
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
        isSeller: user.isSeller,
      });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

userRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (User) {
      if (user.email === "admin@example.com") {
        res.status(400).send({ message: "Can Not Delete Admin User" });
        return;
      }
      await user.remove();
      res.send({ message: "User Deleted" });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

export default userRouter;
