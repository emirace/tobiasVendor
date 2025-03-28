import express from "express";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import {
  fillEmailContent,
  generateOTP,
  generateToken,
  isAdmin,
  isAuth,
  sendEmail,
  sendEmailMessage,
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
import Newsletters from "../models/newslettersModel.js";
import mongoose from "mongoose";
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
      user.rebundle = { status: req.body.status, count: req.body.count };
      await user.save();
      res.status(200).send(user.rebundle);
    } else {
      res.status(404).send({ message: "User not Found" });
    }
  })
);

// userRouter.put(
//   "/profile",
//   isAuth,
//   expressAsyncHandler(async (req, res) => {
//     const user = await User.findById(req.user._id);
//     const current = new Date();
//     if (user) {
//       try {
//         user.about = req.body.about || user.about;
//         user.username = req.body.username || user.username;
//         user.usernameUpdate = req.body.username ? current : user.usernameUpdate;
//         user.firstName = req.body.firstName || user.firstName;
//         user.lastName = req.body.lastName || user.lastName;
//         user.email = req.body.email || user.email;
//         user.dob = req.body.dob || user.dob;
//         user.accountName = req.body.accountName || user.accountName;
//         user.accountNumber = req.body.accountNumber || user.accountNumber;
//         user.bankName = req.body.bankName || user.bankName;
//         user.address = req.body?.address?.state
//           ? req.body.address
//           : user.address;
//         user.phone = req.body.phone || user.phone;
//         user.image = req.body.image || user.image;
//         if (req.body.password) {
//           user.password = bcrypt.hashSync(req.body.password, 8);
//         }
//         if (user.address && user.bankName) {
//           user.isSeller = true;
//         } else {
//           user.isSeller = false;
//         }
//         const updatedUser = await user.save();

//         res.send({
//           _id: updatedUser._id,
//           name: updatedUser.name,
//           username: updatedUser.username,
//           usernameUpdate: updatedUser.usernameUpdate,
//           firstName: updatedUser.firstName,
//           lastName: updatedUser.lastName,
//           region: updatedUser.region,
//           email: updatedUser.email,
//           isSeller: updatedUser.isSeller,
//           isAdmin: updatedUser.isAdmin,
//           image: updatedUser.image,
//           active: updatedUser.active,
//           isVerifiedEmail: updatedUser.isVerifiedEmail,
//           address: updatedUser.address,
//           bankName: updatedUser.bankName,
//           accountNumber: updatedUser.accountNumber,
//           accountName: updatedUser.accountName,
//           token: generateToken(updatedUser),
//         });
//       } catch (err) {
//         if (err) {
//           if (err.name === "MongoServerError" && err.code === 11000) {
//             // Duplicate username
//             return res
//               .status(500)
//               .send({ succes: false, message: "User already exist!" });
//           }
//         }
//         console.log(err);
//         return res.status(500).send(err);
//       }
//     } else {
//       res.status(404).send({ message: "User not Found" });
//     }
//   })
// );

userRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ message: "User not Found" });
      }

      const current = new Date();
      const {
        about,
        username,
        firstName,
        lastName,
        email,
        dob,
        accountName,
        accountNumber,
        bankName,
        address,
        phone,
        image,
        password,
      } = req.body;

      const updatedUserData = {
        about: about || user.about,
        username: username || user.username,
        usernameUpdate: username ? current : user.usernameUpdate,
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        email: email || user.email,
        dob: dob || user.dob,
        phone: phone || user.phone,
        image: image || user.image,
      };

      if (!user.bankName) {
        updatedUserData.bankName = bankName || user.bankName;
      }

      if (!user.accountName) {
        updatedUserData.accountName = accountName || user.accountName;
      }

      if (!user.accountNumber) {
        updatedUserData.accountNumber = accountNumber || user.accountNumber;
      }

      if (address?.state) {
        updatedUserData.address = address;
      }

      if (password) {
        updatedUserData.password = bcrypt.hashSync(password, 8);
      }

      if (
        (updatedUserData.address && updatedUserData.bankName) ||
        (user.address && user.bankName)
      ) {
        updatedUserData.isSeller = true;
      } else {
        updatedUserData.isSeller = false;
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        updatedUserData,
        { new: true, runValidators: true }
      );

      res.status(200).json({
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
      console.error(err);

      if (err.name === "MongoServerError" && err.code === 11000) {
        return res.status(500).json({
          success: false,
          message: "User already exists!",
        });
      }

      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
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
      const io = req.app.get("io");
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

      let newsletter = await Newsletters.findOne({ email: user.email });

      if (newsletter) {
        newsletter.isDeleted = false;
        newsletter.url = url;
      } else {
        newsletter = new Newsletters({
          email: user.email,
          emailType: "Newsletter",
          url,
        });
      }
      await newsletter.save();

      sendEmail({
        to: newUser.email,
        subject: "WELCOME TO REPEDDLE ",
        template: "welcome",
        context: {
          username: newUser.username,
          url,
        },
      });
      // const content = {
      //   io,
      //   receiverId: newUser._id,
      //   senderId: req.user._id,
      //   title: "WELCOME TO REPEDDLE",
      //   emailMessages: fillEmailContent("WELCOME TO REPEDDLE", {
      //     USERNAME: newUser.username,
      //     EMAIL: newUser.email,
      //   }),
      // };
      // sendEmailMessage(content);
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
      res.status(400).send({
        message:
          "Invalid Verification or Expired Token, please resend verification email from your account.",
      });
    }
  })
);

userRouter.post(
  "/forgetpassword",
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
    const io = req.app.get("io");
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
      // const content = {
      //   io,
      //   receiverId: user._id,
      //   senderId: req.user._id,
      //   title: "Your Password Is Successfully Reset",
      //   emailMessages: fillEmailContent("Your Password Is Successfully Reset", {
      //     USERNAME: user.username,
      //     EMAIL: user.email,
      //   }),
      // };
      // sendEmailMessage(content);
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
    const io = req.app.get("io");
    console.log(req.body.tokenId);
    const url = region === "NGN" ? "com" : "co.za";
    const ticket = await client.verifyIdToken({
      idToken: req.body.tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const response = ticket.getPayload();
    console.log(response);
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
      // const content = {
      //   io,
      //   receiverId: result._id,
      //   senderId: req.user._id,
      //   title: "WELCOME TO REPEDDLE",
      //   emailMessages: fillEmailContent("WELCOME TO REPEDDLE", {
      //     USERNAME: result.username,
      //     EMAIL: result.email,
      //   }),
      // };
      // sendEmailMessage(content);
    }
    result.userId = result._id.toString();
    await result.save();
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

    let newsletter = await Newsletters.findOne({ email: result.email });

    if (newsletter) {
      newsletter.isDeleted = false;
      newsletter.url = url;
    } else {
      newsletter = new Newsletters({
        email: result.email,
        emailType: "Newsletter",
        url,
      });
    }
    await newsletter.save();
    res.status(200).send(data);
  })
);

userRouter.post(
  "/:region/googlemobile",
  expressAsyncHandler(async (req, res) => {
    const { region } = req.params;
    const { email, given_name, family_name, picture, id, verified_email } =
      req.body;
    const url = region === "NGN" ? "com" : "co.za";
    const io = req.app.get("io");

    const user = {
      email: email,
      image: picture,
      social_id: id,
      firstName: given_name,
      lastName: family_name,
      isVerifiedEmail: verified_email || false,
      username: `${given_name.toLowerCase()}_${generateOTP()}`,
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
      // const content = {
      //   io,
      //   receiverId: result._id,
      //   senderId: req.user._id,
      //   title: "WELCOME TO REPEDDLE",
      //   emailMessages: fillEmailContent("WELCOME TO REPEDDLE", {
      //     USERNAME: result.username,
      //     EMAIL: result.email,
      //   }),
      // };
      // sendEmailMessage(content);
      result.userId = result._id.toString();
      await result.save();
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

    let newsletter = await Newsletters.findOne({ email: user.email });

    if (newsletter) {
      newsletter.isDeleted = false;
      newsletter.url = url;
    } else {
      newsletter = new Newsletters({
        email: user.email,
        emailType: "Newsletter",
        url,
      });
    }
    await newsletter.save();
    res.status(200).send(data);
  })
);

userRouter.post(
  "/:region/facebook",
  expressAsyncHandler(async (req, res) => {
    const { region } = req.params;
    const url = region === "NGN" ? "com" : "co.za";
    const io = req.app.get("io");
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
      // const content = {
      //   io,
      //   receiverId: result._id,
      //   senderId: req.user._id,
      //   title: "WELCOME TO REPEDDLE",
      //   emailMessages: fillEmailContent("WELCOME TO REPEDDLE", {
      //     USERNAME: result.username,
      //     EMAIL: result.email,
      //   }),
      // };
      // sendEmailMessage(content);
      result.userId = result._id.toString();
      await result.save();
    }
    const account = await Account.findOne({ userId: result._id });
    if (!account)
      await Account.create({
        userId: result._id,
        balance: 0,
        currency: req.params.region === "ZAR" ? "R " : "N ",
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

    let newsletter = await Newsletters.findOne({ email: user.email });

    if (newsletter) {
      newsletter.isDeleted = false;
      newsletter.url = url;
    } else {
      newsletter = new Newsletters({
        email: user.email,
        emailType: "Newsletter",
        url,
      });
    }
    await newsletter.save();

    res.status(200).send(data1);
  })
);

// userRouter.get(
//   "/seller/:idorusername",
//   expressAsyncHandler(async (req, res) => {
//     const { idorusername } = req.params;
//     const user = await User.findOne(
//       { _id: idorusername } || { username: idorusername }
//     )
//       .populate("likes")
//       .populate({
//         path: "saved",
//         populate: [{ path: "seller", select: "username image" }],
//       });

//     if (user) {
//       res.send({
//         _id: user._id,
//         usernameUpdate: user.usernameUpdate,
//         activeUpdate: user.activeUpdate,
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
//         isSeller: user.isSeller,
//         sold: user.sold,
//         createdAt: user.createdAt,
//         numReviews: user.numReviews,
//         rating: user.rating,
//         phone: user.phone,
//         isAdmin: user.isAdmin,
//         newsletter: user.newsletter,
//         address: user.address,
//         active: user.active,
//         influencer: user.influencer,
//         badge: user.badge,
//         dob: user.dob,
//         accountName: user.accountName,
//         accountNumber: user.accountNumber,
//         bankName: user.bankName,
//         rebundle: user.rebundle,
//         buyers: user.buyers,
//       });
//     } else {
//       res.status(404).send({ message: "User Not Found" });
//     }
//   })
// );

userRouter.get(
  "/seller/:idorusername",
  expressAsyncHandler(async (req, res) => {
    const { idorusername } = req.params;
    console.log(idorusername);
    let query = {};

    if (mongoose.Types.ObjectId.isValid(idorusername)) {
      query = { _id: idorusername };
    } else {
      query = { username: idorusername };
    }
    const user = await User.findOne(query)
      .populate({
        path: "likes",
        populate: { path: "seller", select: "username image" },
      })
      .populate({
        path: "saved",
        populate: { path: "seller", select: "username image" },
      })
      .select(
        "_id usernameUpdate activeUpdate username firstName lastName email image about followers following likes saved sold isSeller region createdAt numReviews rating phone isAdmin newsletter address active influencer badge dob accountName accountNumber bankName rebundle buyers "
      );

    if (user) {
      res.send(user);
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
          usernameUpdate: updatedUser.usernameUpdate,
          activeUpdate: updatedUser.activeUpdate,
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
          isSeller: updatedUser.isSeller,
          sold: updatedUser.sold,
          createdAt: updatedUser.createdAt,
          numReviews: updatedUser.numReviews,
          rating: updatedUser.rating,
          phone: updatedUser.phone,
          isAdmin: updatedUser.isAdmin,
          newsletter: updatedUser.newsletter,
          address: updatedUser.address,
          active: updatedUser.active,
          influencer: updatedUser.influencer,
          badge: updatedUser.badge,
          dob: updatedUser.dob,
          accountName: updatedUser.accountName,
          accountNumber: updatedUser.accountNumber,
          bankName: updatedUser.bankName,
          rebundle: updatedUser.rebundle,
          buyers: updatedUser.buyers,
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
        usernameUpdate: updatedUser.usernameUpdate,
        activeUpdate: updatedUser.activeUpdate,
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
        isSeller: updatedUser.isSeller,
        sold: updatedUser.sold,
        createdAt: updatedUser.createdAt,
        numReviews: updatedUser.numReviews,
        rating: updatedUser.rating,
        phone: updatedUser.phone,
        isAdmin: updatedUser.isAdmin,
        newsletter: updatedUser.newsletter,
        address: updatedUser.address,
        active: updatedUser.active,
        influencer: updatedUser.influencer,
        badge: updatedUser.badge,
        dob: updatedUser.dob,
        accountName: updatedUser.accountName,
        accountNumber: updatedUser.accountNumber,
        bankName: updatedUser.bankName,
        rebundle: updatedUser.rebundle,
        buyers: updatedUser.buyers,
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
        newsletter: user.newsletter,
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

    const queryFilter = {
      region,
      ...(searchQuery &&
        searchQuery !== "all" && {
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
        }),
    };
    console.log("searchQuery", queryFilter);

    const users = await User.find(queryFilter).sort({
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
      user.address = req.body?.address?.state ? req.body.address : user.address;
      user.about = req.body.about || user.about;
      user.image = req.body.image || user.image;
      user.active = req.body.active || user.active;
      user.badge = req.body.badge || user.badge;
      user.influencer = req.body.influencer || user.influencer;
      // user.bankName = req.body.bankName || user.bankName;
      // user.accountName = req.body.accountName || user.accountName;
      // user.accountNumber = req.body.accountNumber || user.accountNumber;

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
      if (
        user.email === "tobiasrepeddle@gmail.com" ||
        user.email === "repeddleng@gmail.com"
      ) {
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
