import express from "express";
import {
  fillEmailContent,
  isAdmin,
  isAuth,
  sendEmail,
  sendEmailMessage,
  sendWeeklyMail,
} from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import Newsletters from "../models/newslettersModel.js";
import User from "../models/userModel.js";
import moment from "moment/moment.js";
import Product from "../models/productModel.js";

const newsletterRouter = express.Router();

const emailLists = [
  {
    name: "Congratulation",
    subject: "CONGRATULATION",
    template: "congrants01",
  },
  { name: "Did You Know", subject: "DID YOU KNOW", template: "doyouknow" },
  {
    name: "Hacks on How to Make Your First Repeddle Sale",
    subject: "Hacks on How to Make Your First Repeddle Sale!",
    template: "hack",
  },
  {
    name: "Pricing Your Listing",
    subject: "PRICING YOUR LISTING",
    template: "pricing",
  },
  {
    name: "Let Our Community Get To Know You",
    subject: "Let Our Community Get To Know You!",
    template: "community",
  },
  {
    name: "Track All Important Metrics",
    subject: "PERFORMANCE TRACKING",
    template: "performanceTracking",
  },
  {
    name: "Exciting Announcement",
    subject: "EXCITING ANNOUNCEMENT",
    template: "exiciting",
  },
  {
    name: "Challenging Fast Fashion",
    subject: "CHALLENGING FAST FASHION POLLUTION IN AFRICA",
    template: "challenging",
  },
  {
    name: "How Repeddle Works!",
    subject: "HOW REPOEDDLE WORKS!",
    template: "howRepeddleWork",
  },
  {
    name: "Feature Update!",
    subject: "FEATURE UPDATE",
    template: "featureUpdate",
  },
  {
    name: "Thrift For Good Cause",
    subject: "THRIFT FOR GOOD CAUSE",
    template: "goodCause",
  },
  {
    name: "Hunt It * Thrift It * Flaunt It!",
    subject: "HUNT IT - THRIFT IT - FLAUNT IT!",
    template: "huntIt",
  },
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

// send email
newsletterRouter.post(
  "/send",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const { emails, emailName } = req.body;
      const io = req.app.get("io");
      const emailType = emailLists.find(
        (emailList) => emailList.name === emailName
      );

      if (!emailType) {
        return res.status(400).send("Invalid email name");
      }

      if (emailName === "Congratulation") {
        const existUsers = await User.find({ email: { $in: emails } });

        const bulkEmailOperations = existUsers.map((existUser) => {
          const email = existUser.email;
          return {
            updateOne: {
              filter: { email: email },
              update: {
                $push: { sent: { emailName: emailName } },
              },
            },
          };
        });

        await Newsletters.bulkWrite(bulkEmailOperations);

        for (const existUser of existUsers) {
          await sendEmail({
            to: existUser.email,
            subject: emailType.subject,
            template: emailType.template,
            context: {
              url: existUser.region === "NGN" ? "com" : "co.za",
              user: existUser.username,
              time: moment(existUser.createdAt).fromNow(true),
            },
          });

          const content = {
            io,
            receiverId: existUser._id,
            senderId: req.user._id,
            title: emailType.name,
            emailMessages: fillEmailContent(emailType.name, {
              USERNAME: existUser.username,
              DATE: moment(existUser.createdAt).fromNow(true),
              EMAIL: existUser.email,
            }),
          };
          sendEmailMessage(content);
        }
      } else if (emailName === "Hunt It * Thrift It * Flaunt It!") {
        await sendWeeklyMail(emails, io, req);
      } else {
        const existEmails = await Newsletters.find({ email: { $in: emails } });
        const existUser = await User.find({ email: { $in: emails } });
        // // Initialize empty arrays to store the emails
        // const comEmails = [];
        // const cozaEmails = [];

        // // Use the filter method to separate emails based on the 'url' field
        // existEmails.forEach((item) => {
        //   if (item.url === "com") {
        //     comEmails.push(item.email);
        //   } else if (item.url === "co.za") {
        //     cozaEmails.push(item.email);
        //   }
        // });

        const bulkEmailOperations = existEmails.map((existEmail) => {
          const email = existEmail.email;
          return {
            updateOne: {
              filter: { email: email },
              update: {
                $push: { sent: { emailName: emailName } },
              },
            },
          };
        });
        await Newsletters.bulkWrite(bulkEmailOperations);

        // if (cozaEmails.length) {
        //   await sendEmail({
        //     to: cozaEmails,
        //     subject: emailType.subject,
        //     template: emailType.template,
        //     context: {
        //       url: "co.za",
        //     },
        //   });
        // }

        // if (comEmails.length) {
        //   await sendEmail({
        //     to: comEmails,
        //     subject: emailType.subject,
        //     template: emailType.template,
        //     context: {
        //       url: "com",
        //     },
        //   });
        // }
        // for (const existUser of existEmails) {
        //   await sendEmail({
        //     to: existUser.email,
        //     subject: emailType.subject,
        //     template: emailType.template,
        //     context: {
        //       url: existUser.url,
        //     },
        //   });
        // }

        existUser.forEach((user) => {
          const content = {
            io,
            receiverId: user._id,
            senderId: req.user._id,
            title: emailType.name,
            emailMessages: fillEmailContent(emailType.name, {
              USERNAME: user.username,
              EMAIL: user.email,
            }),
          };

          if (fillEmailContent(emailType.name, {})) {
            sendEmailMessage(content);
          }
        });
      }

      res.status(200).send("Emails sent successfully");
    } catch (error) {
      console.error("Failed to send emails:", error);
      res.status(500).send("Failed to send emails");
    }
  })
);

// add a email
newsletterRouter.post(
  "/:region",
  expressAsyncHandler(async (req, res) => {
    const { email, emailType } = req.body;
    const { region } = req.params;

    let newsletter = await Newsletters.findOne({ email });

    if (newsletter) {
      newsletter.isDeleted = false;
      newsletter.url = region === "NGN" ? "com" : "co.za";
    } else {
      newsletter = new Newsletters({
        email,
        emailType,
        url: region === "NGN" ? "com" : "co.za",
      });
    }

    await newsletter.save();

    const user = await User.findOne({ email: newsletter.email });

    if (user) {
      user.newsletter = true;
      await user.save();
    }

    await sendEmail({
      to: email,
      subject: "WELCOME TO REPEDDLE NEWSLATTER",
      template: "newsletter",
      context: {
        url: region === "NGN" ? "com" : "co.za",
      },
    });

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
      console.log(error);
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

export default newsletterRouter;
