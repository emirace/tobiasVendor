import express from "express";
import { isAdmin, isAuth, sendEmail } from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import Newsletters from "../models/newslettersModel.js";
import User from "../models/userModel.js";
import moment from "moment/moment.js";

const newsletterRouter = express.Router();

const emailLists = [
  {
    name: "Welcome",
    subject: "WELCOME TO REPEDDLE",
    template: "welcome",
  },
  {
    name: "Email verified success",
    subject: "EMAIL VERIFIED SUCCESSFULLY",
    template: "successEmail",
  },
  { name: "Congrats 01", subject: "CONGRATULATION", template: "congrants01" },
  { name: "Did you know", subject: "DID YOU KNOW", template: "doyouknow" },
];

// get all newsletters
newsletterRouter.get(
  "/newsletter",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newsletters = await Newsletters.find({
      emailType: "Newsletter",
    }).sort({ createdAt: -1 });
    res.send({ newsletters, emailLists });
  })
);

// get all rebatch email
newsletterRouter.get(
  "/rebatch",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const rebatchs = await Newsletters.find({ emailType: "Rebatch" }).sort({
      createdAt: -1,
    });
    res.send(rebatchs);
  })
);

// add a email
newsletterRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    const { email, emailType } = req.body;

    let newsletter = await Newsletters.findOne({ email });

    if (newsletter) {
      newsletter.isDeleted = false;
    } else {
      newsletter = new Newsletters({ email, emailType });
    }

    await newsletter.save();

    const user = await User.findOne({ email: newsletter.email });

    if (user) {
      user.newsletter = true;
      await user.save();
    }

    res.status(201).send(newsletter);
  })
);

// delete any email with id
newsletterRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const newsletter = await Newsletters.findById(req.params.id);
      if (newsletter) {
        newsletter.isDeleted = true;
        const deletedNewsletter = await newsletter.save();
        const user = await User.findOne({ email: deletedNewsletter.email });
        if (user) {
          user.newsletter = false;
          await user.save();
        }
        console.log(deletedNewsletter);
        res.status(200).send(deletedNewsletter);
      } else {
        res.status(404).send("Newsletter not found");
      }
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  })
);

newsletterRouter.delete(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const newsletter = await Newsletters.findOne({
        email: req.user.email,
      });
      if (newsletter) {
        newsletter.isDeleted = true;
        await newsletter.save();
        const user = await User.findOne({ email: newsletter.email });
        if (user) {
          user.newsletter = false;
          await user.save();
        }
        res.status(200).send(newsletter);
      } else {
        res.status(404).send("Newsletter not found");
      }
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  })
);

// send email
newsletterRouter.post(
  "/send",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const { emails, emailName, url } = req.body;
      console.log(emails, emailName);
      const emailType = emailLists.find(
        (emailList) => emailList.name === emailName
      );

      if (!emailType) {
        return res.status(400).send("Invalid email name");
      }

      if (emailName === "Congrats 01") {
        for (const email of emails) {
          const existUser = await User.findOne({ email });
          if (!existUser) {
            console.error("Not a registered user:", email);
            continue; // Skip to the next email
          }

          sendEmail({
            to: email,
            subject: emailType.subject,
            template: emailType.template,
            context: {
              url: existUser.region === "NGN" ? "com" : "co.za",
              user: existUser.username,
              time: moment(existUser.createdAt).fromNow(true),
            },
          });
        }
      } else {
        // Send email using the appropriate template and subject
        for (const email of emails) {
          sendEmail({
            to: email,
            subject: emailType.subject,
            template: emailType.template,
            context: {
              url,
            },
          });
        }
      }

      res.status(200).send("Email sent successfully");
    } catch (error) {
      console.error("Failed to send emails:", error);
      res.status(500).send("Failed to send email");
    }
  })
);

export default newsletterRouter;
