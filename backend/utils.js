import jwt from "jsonwebtoken";
import Account from "./models/accountModel.js";
import Transaction from "./models/transactionModel.js";
import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";

import path from "path";

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      isSeller: user.isSeller,
      active: user.active,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: "Invalid Token" });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: "No Token" });
  }
};

export const isAuthOrNot = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: "Invalid Token" });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    next();
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: "Invalid Admin Token" });
  }
};

export const isSeller = (req, res, next) => {
  if (req.user && req.user.isSeller) {
    next();
  } else {
    res.status(401).send({ message: "Invalid Seller Token" });
  }
};

export const isSellerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.isSeller || req.user.isSeller)) {
    next();
  } else {
    res.status(401).send({ message: "Invalid Seller/Admin Token" });
  }
};

export const isSocialAuth = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).send({ message: "User not authorize" });
  }
};

export const sendEmail = (options) => {
  // const transporter = nodemailer.createTransport({
  //   host: "smtpout.secureserver.net",
  //   port: 80,

  //   auth: {
  //     user: "tobias@repeddle.com",
  //     pass: "jH4/&FS-WqJubdK",
  //   },
  // });

  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,

    auth: {
      user: "tobias@repeddle.com",
      pass: "jH4/&FS-WqJubdK",
    },
  });

  // var transporter = nodemailer.createTransport({
  //   host: "smtp.mailtrap.io",
  //   port: 2525,
  //   auth: {
  //     user: "aeef4e04706b4f",
  //     pass: "1239ac3ae8cd9a",
  //   },
  // });

  transporter.use(
    "compile",
    hbs({
      viewEngine: {
        extname: ".handlebars",
        partialsDir: path.resolve("./utils/layouts/"),
        defaultLayout: "main",
        layoutsDir: path.resolve("./utils/layouts/"),
      },
      viewPath: path.resolve("./utils/layouts/"),
      extName: ".handlebars",
    })
  );

  const mailOption = {
    from: "support@repeddle.com",
    to: options.to,
    subject: options.subject,
    html: options.text,
    template: options.template,
    context: options.context,
  };

  transporter.sendMail(mailOption, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

export const slugify = (Text) => {
  return Text.toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};

import { v4 } from "uuid";

export async function creditAccount({
  amount,
  accountId,
  purpose,
  reference = v4(),
  metadata,
}) {
  const account = await Account.findById(accountId);

  if (!account) {
    return {
      success: false,
      error: "Account does not exist",
    };
  } else {
    account.balance = Number(account.balance) + Number(amount);
    account.save();
  }

  const transaction = new Transaction({
    txnType: "credit",
    purpose,
    amount,
    accountId,
    reference,
    metadata,
    balanceBefore: Number(account.balance),
    balanceAfter: Number(account.balance) + Number(amount),
  });
  await transaction.save();
  return {
    success: true,
    message: "Credit successful",
  };
}

export async function debitAccount({
  amount,
  accountId,
  purpose,
  reference = v4(),
  metadata,
}) {
  const account = await Account.findById(accountId);

  if (!account) {
    return {
      success: false,
      error: "Account does not exist",
    };
  }
  if (Number(account.balance) < amount) {
    return {
      success: false,
      error: "Insufficient balance",
    };
  } else {
    account.balance = Number(account.balance) - Number(amount);
    account.save();
  }
  console.log(account.amount);

  await Transaction.create({
    txnType: "debit",
    purpose,
    amount,
    accountId,
    reference,
    metadata,
    balanceBefore: Number(account.balance),
    balanceAfter: Number(account.balance) - Number(amount),
  });
  return {
    success: true,
    message: "Debit successful",
  };
}

export const generateOTP = () => {
  let otp = "";
  for (let i = 0; i <= 5; i++) {
    const randVal = Math.round(Math.random() * 9);
    otp = otp + randVal;
  }
  return otp;
};
