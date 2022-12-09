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
import dotenv from "dotenv";
import { plainEmailTemp } from "../utils/mailTemplete.js";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";
import { Welcome } from "../utils/mailTempleter/Welcome.js";
import { verifyEmail } from "../utils/mailTempleter/verifyEmail.js";
import { passwordReset } from "../utils/mailTempleter/passwordReset.js";
import { resetConfirmation } from "../utils/mailTempleter/resetConfirmation.js";
import { resetSuccess } from "../utils/mailTempleter/resetSuccess.js";
dotenv.config();

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

userRouter.get(
  "/:region/influencer",
  expressAsyncHandler(async (req, res) => {
    const { region } = req.params;
    const users = await User.find({ region, influencer: true }).select("_id");
    res.send(users);
  })
);

userRouter.put(
  "/bundle",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      console.log(req.body.value);
      user.rebundle = req.body.value;
      await user.save();
      res.status(200).send(user.rebundle);
    } else {
      res.status(404).send({ message: "User not Found" });
    }
  })
);

userRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const current = new Date();
    if (user) {
      try {
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
        if (user.address && user.bankName) {
          user.isSeller = true;
        } else {
          user.isSeller = false;
        }
        const updatedUser = await user.save();

        res.send({
          _id: updatedUser._id,
          name: updatedUser.name,
          username: updatedUser.username,
          usernameUpdate: updatedUser.usernameUpdate,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          region: updatedUser.region,
          email: updatedUser.email,
          isSeller: updatedUser.isSeller,
          isAdmin: updatedUser.isAdmin,
          image: updatedUser.image,
          active: updatedUser.active,
          isVerifiedEmail: updatedUser.isVerifiedEmail,
          address: updatedUser.address,
          bankName: updatedUser.bankName,
          accountNumber: updatedUser.accountNumber,
          accountName: updatedUser.accountName,
          token: generateToken(updatedUser),
        });
      } catch (err) {
        if (err) {
          if (err.name === "MongoServerError" && err.code === 11000) {
            // Duplicate username
            return res
              .status(500)
              .send({ succes: false, message: "User already exist!" });
          }
        }
        return res.status(500).send(err);
      }
    } else {
      res.status(404).send({ message: "User not Found" });
    }
  })
);

userRouter.post(
  "/:region/signin",
  expressAsyncHandler(async (req, res) => {
    const { region } = req.params;
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (!user.password)
        return res.status(500).send({ message: "Invalid email or password" });
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
          isVerifiedEmail: user.isVerifiedEmail,
          address: user.address,
          active: user.active,
          bankName: user.bankName,
          accountNumber: user.accountNumber,
          accountName: user.accountName,
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
    try {
      const { region } = req.params;
      const url = region === "NGN" ? "com" : "co.za";
      const newUser = new User({
        username: req.body.username.toLowerCase(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        image: "/images/pimage.png",
        password: bcrypt.hashSync(req.body.password),
        rating: 0,
        region,
        numReviews: 0,
      });
      newUser.userId = newUser._id.toString();
      const resetToken = crypto.randomBytes(20).toString("hex");
      newUser.resetEmailToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
      newUser.resetEmailExpire = Date.now() + 30 * (60 * 1000);
      const resetUrl = `https://repeddle.${url}/verifyemail/${resetToken}`;

      const user = await newUser.save();

      sendEmail({
        to: newUser.email,
        subject: "WELCOME TO REPEDDLE ",
        template: "welcome",
        context: {
          username: newUser.username,
          url,
        },
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
        usernameUpdate: user.usernameUpdate,
        firstName: user.firstName,
        lastName: user.lastName,
        region: user.region,
        email: user.email,
        isSeller: user.isSeller,
        isAdmin: user.isAdmin,
        image: user.image,
        isVerifiedEmail: user.isVerifiedEmail,
        address: user.address,
        active: user.active,
        bankName: user.bankName,
        accountNumber: user.accountNumber,
        accountName: user.accountName,
        token: generateToken(user),
      });
    } catch (err) {
      if (err.name === "MongoServerError" && err.code === 11000) {
        // Duplicate username
        return res
          .status(500)
          .send({ succes: false, message: "User already exist!" });
      }

      return res.status(500).send(err);
    }
  })
);

userRouter.post(
  "/verifyemail/:resetToken",
  expressAsyncHandler(async (req, res) => {
    const resetEmailToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");
    console.log(req.params.resetToken, resetEmailToken);

    const user = await User.findOne({
      resetEmailToken,
      resetEmailExpire: {
        $gt: Date.now(),
      },
    });
    if (user) {
      const url = user.region === "NGN" ? "com" : "co.za";
      user.resetEmailExpire = undefined;
      user.resetEmailToken = undefined;
      user.isVerifiedEmail = true;
      await user.save();
      sendEmail({
        to: user.email,
        subject: "EMAIL VERIFIED SUCCESSFULLY",
        template: "successEmail",
        context: {
          url,
        },
      });
      res
        .status(201)
        .send({ success: true, message: "Email verified successfuly" });
    } else {
      res.status(400).send({ message: "Invalid Verification Token" });
    }
  })
);

userRouter.post(
  "/:url/forgetpassword",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const url = user.region === "NGN" ? "com" : "co.za";
      const resetToken = crypto.randomBytes(20).toString("hex");
      user.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
      user.resetPasswordExpire = Date.now() + 30 * (60 * 1000);
      await user.save();
      const resetUrl = `https://repeddle.${url}/resetpassword/${resetToken}`;
      console.log(resetToken);

      try {
        sendEmail({
          to: user.email,
          subject: "PASSWORD RESET ",
          template: "passwordReset",
          context: {
            url,
            resetlink: resetUrl,
            email: user.email,
          },
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
    console.log(req.params.resetToken);
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
      const url = user.region === "NGN" ? "com" : "co.za";

      user.password = bcrypt.hashSync(req.body.password);
      user.resetPasswordExpire = undefined;
      user.resetPasswordToken = undefined;
      await user.save();
      sendEmail({
        to: user.email,
        subject: "PASSWORD SUCCESSFULLY RESET",
        template: "passwordResetSuccess",
        context: {
          username: user.username,
          url,
          email: user.email,
        },
      });
      res
        .status(201)
        .send({ success: true, message: "Password Reset Success" });
    } else {
      res.status(400).send({ message: "Invalid Reset Token" });
    }
  })
);

userRouter.get(
  "/sendverifyemail",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      if (user.isVerifiedEmail)
        return res
          .status(500)
          .send({ message: "This user is already verified" });

      const url = user.region === "NGN" ? "com" : "co.za";

      const resetToken = crypto.randomBytes(20).toString("hex");
      user.resetEmailToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
      user.resetEmailExpire = Date.now() + 10 * (60 * 1000);
      const resetUrl = `https://repeddle.${url}/verifyemail/${resetToken}`;

      const newUser = await user.save();

      sendEmail({
        to: user.email,
        subject: "VERIFY YOUR EMAIL",
        template: "verifyEmail",
        context: {
          username: user.username,
          url,
          resetlink: resetUrl,
        },
      });
      res.status(200).send({ message: "Email sent" });
    }
  })
);

userRouter.post(
  "/:region/google",
  expressAsyncHandler(async (req, res) => {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const { region } = req.params;
    const url = region === "NGN" ? "com" : "co.za";
    const ticket = await client.verifyIdToken({
      idToken: req.body.tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const response = ticket.getPayload();

    if (
      response.iss !== "accounts.google.com" &&
      response.aud !== process.env.GOOGLE_CLIENT_ID
    )
      return res.status(400).json({ status: "error", error: "Bad Request" });

    const user = {
      email: response.email,
      image: response.picture,
      social_id: response.sub,
      firstName: response.given_name,
      lastName: response.family_name,
      isVerifiedEmail: true,
      username: `${response.given_name.toLowerCase()}_${generateOTP()}`,
      region: req.params.region,
    };
    let result = await User.findOne({
      $or: [{ email: user.email, social_id: user.social_id }],
    });

    if (!result) {
      result = await User.create(user);
      sendEmail({
        to: result.email,
        subject: "WELCOME TO REPEDDLE ",
        template: "welcome",
        context: {
          username: result.username,
          url,
        },
      });
    }
    const account = await Account.findOne({ userId: result._id });
    if (!account)
      await Account.create({
        userId: result._id,
        balance: 0,
        currency: req.params.region === "ZAR" ? "R " : "N ",
      });

    const token = generateToken(result);
    const data = {
      token,
      _id: result._id,
      name: result.name,
      username: result.username,
      usernameUpdate: result.usernameUpdate,
      firstName: result.firstName,
      lastName: result.lastName,
      region: result.region,
      email: result.email,
      isSeller: result.isSeller,
      isAdmin: result.isAdmin,
      image: result.image,
      isVerifiedEmail: result.isVerifiedEmail,
      address: result.address,
      active: result.active,
      bankName: result.bankName,
      accountNumber: result.accountNumber,
      accountName: result.accountName,
    };

    res.status(200).send(data);
  })
);

userRouter.post(
  "/:region/facebook",
  expressAsyncHandler(async (req, res) => {
    console.log("accessToken", req.body.accessToken);
    const { region } = req.params;
    const url = region === "NGN" ? "com" : "co.za";
    const { data } = await axios.get(
      `https://graph.facebook.com/v8.0/me?fields=id,name,email,picture.type(large),first_name,last_name,short_name&access_token=${req.body.accessToken}`
    );
    if (data.error)
      return res.status(400).json({ status: "error", error: "Bad Request" });

    const user = {
      email: data.email,
      image: data.picture.data.url,
      social_id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      isVerifiedEmail: true,
      username: `${data.short_name.toLowerCase()}_${generateOTP()}`,
      region: req.params.region,
    };
    let result = await User.findOne({
      $or: [{ email: user.email, social_id: user.social_id }],
    });

    if (!result) result = await User.create(user);
    const account = await Account.findOne({ userId: result._id });
    if (!account)
      await Account.create({
        userId: result._id,
        balance: 0,
        currency: req.params.region === "ZAR" ? "R " : "N ",
      });

    sendEmail({
      to: result.email,
      subject: "WELCOME TO REPEDDLE ",
      template: "welcome",
      context: {
        username: result.username,
        url,
      },
    });

    const token = generateToken(result);
    const data1 = {
      token,
      _id: result._id,
      name: result.name,
      username: result.username,
      usernameUpdate: result.usernameUpdate,
      firstName: result.firstName,
      lastName: result.lastName,
      region: result.region,
      email: result.email,
      isSeller: result.isSeller,
      isAdmin: result.isAdmin,
      image: result.image,
      isVerifiedEmail: result.isVerifiedEmail,
      address: result.address,
      active: result.active,
      bankName: result.bankName,
      accountNumber: result.accountNumber,
      accountName: result.accountName,
    };

    res.status(200).send(data1);
  })
);

userRouter.post(
  "/:id/reviews",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    const { type } = req.body;
    if (user) {
      if (type === "buyer") {
        if (user.reviews.find((x) => x.userId === req.user._id)) {
          return res
            .status(400)
            .send({ message: "You already submitted a review" });
        }
        if (user._id === req.user._id) {
          return res.status(400).send({ message: "You can't review yourself" });
        }
      } else if (req.user._id !== userId) {
        return res.status(400).send({ message: "You can't submit review" });
      }
      const review = {
        name: req.body.name,
        user: type === "buyer" ? req.user._id : req.body.user._id,
        rating: Number(req.body.rating),
        comment: req.body.comment,
        like: req.body.like,
        type,
      };

      user.reviews.push(review);
      console.log(user.reviews);

      user.numReviews = user.reviews.length;
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
  "/allreviews/:id",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user.reviews);
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
      .populate({
        path: "saved",
        populate: [{ path: "seller", select: "username image" }],
      });

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
        influencer: user.influencer,
        badge: user.badge,
        dob: user.dob,
        accountName: user.accountName,
        accountNumber: user.accountNumber,
        bankName: user.bankName,
        rebundle: user.rebundle,
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
  "/:region/search",
  expressAsyncHandler(async (req, res) => {
    const { q } = req.query;
    const users = await User.find({
      username: { $regex: q.toLowerCase() },
      $options: "i",
      region: req.params.region,
    })
      .select("username image")
      .limit(10);
    res.send(users);
  })
);

userRouter.get(
  "/profile/user",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    console.log(req.user);
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
        isSeller: user.isSeller,
        address: user.address,
        active: user.active,
        isVerifiedEmail: user.isVerifiedEmail,
        badge: user.badge,
        dob: user.dob,
        accountName: user.accountName,
        accountNumber: user.accountNumber,
        bankName: user.bankName,
        rebundle: user.rebundle,
      });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);
// get all users admin

userRouter.get(
  "/:region",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const { region } = req.params;
    const searchQuery = query.q;

    const queryFilter =
      searchQuery && searchQuery !== "all"
        ? {
            $or: [
              {
                username: {
                  $regex: searchQuery,
                  $options: "i",
                },
              },
              {
                userId: {
                  $regex: searchQuery,
                  $options: "i",
                },
              },
            ],
          }
        : {};
    console.log(queryFilter);
    const users = await User.find({ ...queryFilter, region }).sort({
      createdAt: -1,
    });
    res.send(users);
  })
);

// userRouter.get(
//   "/:id",
//   isAuth,
//   expressAsyncHandler(async (req, res) => {
//     const user = await User.findById(req.params.id);
//     if (user) {
//       res.send({
//         username: user.username,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         isAdmin: user.isAdmin,
//         isSeller: user.isSeller,
//       });
//     } else {
//       res.status(404).send({ message: "User Not Found" });
//     }
//   })
// );

// userRouter.get(
//   "/profile/user",
//   isAuth,
//   expressAsyncHandler(async (req, res) => {
//     const user = await User.findById(req.user._id);
//     if (user) {
//       res.send({
//         _id: user._id,
//         username: user.username,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         image: user.image,
//         about: user.about,
//         followers: user.followers,
//         following: user.following,
//         likes: user.likes,
//         saved: user.saved,
//         sold: user.sold,
//         createdAt: user.createdAt,
//         numReviews: user.numReviews,
//         rating: user.rating,
//         phone: user.phone,
//         isAdmin: user.isAdmin,
//         address: user.address,
//         active: user.active,
//         badge: user.badge,
//         dob: user.dob,
//       });
//     } else {
//       res.status(404).send({ message: "User Not Found" });
//     }
//   })
// );

userRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    // const useractive = () => (req.body.active === "yes" ? true : false);
    // const userbadge = () => (req.body.badge === "yes" ? true : false);
    // const userinfluencer = () => (req.body.influencer === "yes" ? true : false);
    if (user) {
      user.username = user.username;
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
      user.dob = req.body.dob || user.dob;
      user.activeUpdate =
        req.body.active === "" ? user.activeUpdate : new Date();
      user.phone = req.body.phone || user.phone;
      user.address = req.body.address || user.address;
      user.about = req.body.about || user.about;
      user.image = req.body.image || user.image;
      user.active = req.body.active || user.active;
      user.badge = req.body.badge || user.badge;
      user.influencer = req.body.influencer || user.influencer;
      user.bankName = req.body.bankName || user.bankName;
      user.accountName = req.body.accountName || user.accountName;
      user.accountNumber = req.body.accountNumber || user.accountNumber;

      const updatedUser = await user.save();
      res.send({
        message: "User Updated",
        _id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        usernameUpdate: updatedUser.usernameUpdate,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        region: updatedUser.region,
        email: updatedUser.email,
        isSeller: updatedUser.isSeller,
        isAdmin: updatedUser.isAdmin,
        image: updatedUser.image,
        active: updatedUser.active,
        isVerifiedEmail: updatedUser.isVerifiedEmail,
        address: updatedUser.address,
        bankName: updatedUser.bankName,
        accountNumber: updatedUser.accountNumber,
        accountName: updatedUser.accountName,
        token: generateToken(updatedUser),
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
