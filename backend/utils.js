import jwt from 'jsonwebtoken';
import Account from './models/accountModel.js';
import Transaction from './models/transactionModel.js';
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import crypto from 'crypto';
import dns from 'dns';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
import Mixpanel from 'mixpanel';
import { v4 } from 'uuid';
import Notification from './models/notificationModel.js';
import User from './models/userModel.js';
import Conversation from './models/conversationModel.js';
import Gig from './models/gigModel.js';
import Order from './models/orderModel.js';
import moment from 'moment';
import Product from './models/productModel.js';
import Newsletters from './models/newslettersModel.js';
import Message from './models/messageModel.js';
// import { mixpanel } from "./server.js";

export var mixpanel = Mixpanel.init(process.env.MIXPANEL);

import path from 'path';

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
      expiresIn: '30d',
    }
  );
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};

export const isAuthOrNot = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
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
    res.status(401).send({ message: 'Invalid Admin Token' });
  }
};

export const isSeller = (req, res, next) => {
  if (req.user && req.user.isSeller) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Seller Token' });
  }
};

export const isSellerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.isSeller || req.user.isSeller)) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Seller/Admin Token' });
  }
};

export const isSocialAuth = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).send({ message: 'User not authorize' });
  }
};

const transporter = nodemailer.createTransport({
  host: 'mail.privateemail.com',
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
transporter.use(
  'compile',
  hbs({
    viewEngine: {
      extname: '.handlebars',
      partialsDir: path.resolve('./utils/layouts/'),
      defaultLayout: 'main',
      layoutsDir: path.resolve('./utils/layouts/'),
      runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowedProtoMethodsByDefault: true,
      },
    },
    viewPath: path.resolve('./utils/layouts/'),
    extName: '.handlebars',
  })
);

export const sendEmail = async (options) => {
  const mailOption = {
    from: { name: 'Repeddle', address: 'support@repeddle.co.za' },
    to: options.to,
    subject: options.subject,
    html: options.text,
    template: options.template,
    context: options.context,
  };

  try {
    transporter.sendMail(mailOption);
    console.log('Email sent successfully', options.to);
    mixpanel.track('Email', {
      type: options.subject,
      status: 'Successfully',
      email: options.to,
    });
  } catch (error) {
    console.error('Failed to send email:', options.to, error);
    mixpanel.track('Email', {
      type: options.subject,
      status: 'Failed',
      email: options.to,
    });
  }
};

export const slugify = (Text) => {
  return Text.toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
};

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
      error: 'Account does not exist',
    };
  } else {
    account.balance = Number(account.balance) + Number(amount);
    account.save();
  }

  const transaction = new Transaction({
    txnType: 'credit',
    purpose,
    amount,
    accountId,
    reference,
    metadata,
    balanceBefore: Number(account.balance),
    balanceAfter: Number(account.balance) + Number(amount),
  });
  transaction.transactionId = transaction._id;
  await transaction.save();
  return {
    success: true,
    message: 'Credit successful',
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
      error: 'Account does not exist',
    };
  }
  if (Number(account.balance) < amount) {
    return {
      success: false,
      error: 'Insufficient balance',
    };
  } else {
    account.balance = Number(account.balance) - Number(amount);
    account.save();
  }

  const transaction = new Transaction({
    txnType: 'debit',
    purpose,
    amount,
    accountId,
    reference,
    metadata,
    balanceBefore: Number(account.balance),
    balanceAfter: Number(account.balance) - Number(amount),
  });
  transaction.transactionId = transaction._id;
  await transaction.save();
  return {
    success: true,
    message: 'Debit successful',
  };
}

export const generateOTP = () => {
  let otp = '';
  for (let i = 0; i <= 5; i++) {
    const randVal = Math.round(Math.random() * 9);
    otp = otp + randVal;
  }
  return otp;
};

export const confirmPayfast = async (req, cartTotal) => {
  try {
    const testingMode = false;
    const pfHost = testingMode ? 'sandbox.payfast.co.za' : 'www.payfast.co.za';
    const passPhrase = 'Re01thriftpeddle';
    // const passPhrase = "jt7NOE43FZPn";

    const pfData = JSON.parse(JSON.stringify(req.body));

    let pfParamString = '';
    for (let key in pfData) {
      if (pfData.hasOwnProperty(key) && key !== 'signature') {
        pfParamString += `${key}=${encodeURIComponent(
          pfData[key].trim()
        ).replace(/%20/g, '+')}&`;
      }
    }

    // Remove last ampersand
    pfParamString = pfParamString.slice(0, -1);

    const pfValidSignature = (pfData, pfParamString, pfPassphrase = null) => {
      // Calculate security signature
      let tempParamString = '';
      if (pfPassphrase !== null) {
        pfParamString += `&passphrase=${encodeURIComponent(
          pfPassphrase.trim()
        ).replace(/%20/g, '+')}`;
      }

      const signature = crypto
        .createHash('md5')
        .update(pfParamString)
        .digest('hex');
      return pfData['signature'] === signature;
    };

    async function ipLookup(domain) {
      return new Promise((resolve, reject) => {
        dns.lookup(domain, { all: true }, (err, address, family) => {
          if (err) {
            reject(err);
          } else {
            const addressIps = address.map(function (item) {
              return item.address;
            });
            resolve(addressIps);
          }
        });
      });
    }

    const pfValidIP = async (req) => {
      const validHosts = [
        'www.payfast.co.za',
        'sandbox.payfast.co.za',
        'w1w.payfast.co.za',
        'w2w.payfast.co.za',
      ];

      let validIps = [];
      const pfIp =
        req.headers['x-forwarded-for'] || req.connection.remoteAddress;

      try {
        for (let key in validHosts) {
          const ips = await ipLookup(validHosts[key]);
          validIps = [...validIps, ...ips];
        }
      } catch (err) {
        console.error(err);
      }

      const uniqueIps = [...new Set(validIps)];

      if (uniqueIps.includes(pfIp)) {
        return true;
      }
      return false;
    };

    const pfValidPaymentData = (cartTotal, pfData) => {
      return (
        Math.abs(parseFloat(cartTotal) - parseFloat(pfData['amount_gross'])) <=
        0.01
      );
    };

    const pfValidServerConfirmation = async (pfHost, pfParamString) => {
      const result = await axios
        .post(`https://${pfHost}/eng/query/validate`, pfParamString)
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          console.error(error);
        });
      return result === 'VALID';
    };

    const check1 = pfValidSignature(pfData, pfParamString, passPhrase);

    const check2 = await pfValidIP(req);

    const check3 = pfValidPaymentData(cartTotal, pfData);

    const check4 = await pfValidServerConfirmation(pfHost, pfParamString);

    if (check1 && check2 && check3 && check4) {
      console.log('good');
      // All checks have passed, the payment is successful
      return true;
    } else {
      console.log('very bad');
      return false;
      // Some checks have failed, check payment manually and log for investigation
    }
  } catch (err) {
    console.log(err);
  }
};

export const payShippingFee = async (order) => {
  try {
    var result = { status: '200', message: 'Successful' };
    await Promise.all(
      order.orderItems.map(async (item) => {
        if (item.deliverySelect['delivery Option'] === 'GIG Logistics') {
          const { data: loginData } = await axios.post(
            'https://thirdparty.gigl-go.com/api/thirdparty/login',
            {
              username: 'IND1109425',
              Password: 'RBUVBi9EZs_7t_q@6019',
              SessionObj: '',
            }
          );

          console.log('loginData');

          const { data } = await axios.post(
            'https://thirdparty.gigl-go.com/api/thirdparty/captureshipment',
            {
              ReceiverAddress: item.deliverySelect.address,
              CustomerCode: loginData.Object.UserName,
              SenderLocality: item.meta.address,
              SenderAddress: item.meta.address,
              ReceiverPhoneNumber: item.deliverySelect.phone,
              VehicleType: 'BIKE',
              SenderPhoneNumber: item.meta.phone,
              SenderName: item.meta.name,
              ReceiverName: item.deliverySelect.name,
              UserId: loginData.Object.UserId,
              ReceiverStationId: item.deliverySelect.stationId,
              SenderStationId: item.meta.stationId,
              ReceiverLocation: {
                Latitude: item.deliverySelect.lat,
                Longitude: item.deliverySelect.lng,
              },
              SenderLocation: {
                Latitude: item.meta.lat,
                Longitude: item.meta.lng,
              },
              PreShipmentItems: [
                {
                  SpecialPackageId: '0',
                  Quantity: item.quantity,
                  Weight: 1,
                  ItemType: 'Normal',
                  ItemName: item.name,
                  Value: item.actualPrice,
                  ShipmentType: 'Regular',
                  Description: item.description,
                  ImageUrl: item.image,
                },
              ],
            },
            {
              headers: {
                Authorization: `Bearer ${loginData.Object.access_token}`,
              },
            }
          );
          console.log({ status: data.Code, message: data.ShortDescription });
          if (data.Code !== '200') {
            const admins = await User.find({
              isAdmin: true,
            });

            const newGig = new Gig({
              orderId: order._id,
              productId: item._id,
            });

            const gig = await newGig.save();

            admins.map(async (admin) => {
              const notification = new Notification({
                userId: admin._id,
                notifyType: 'gig',
                itemId: item._id,
                msg: `Gig - ${data.ShortDescription}`,
                link: `/gig/${gig._id}`,
                userImage: item,
                mobile: { path: 'Gig', id: gig._id },
              });
              await notification.save();
            });
          }
        }
      })
    );
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const checkStatus = (status, currentStatus) => {
  const statusOrder = {
    Pending: 0,
    Processing: 1,
    Dispatched: 2,
    'In Transit': 3,
    Delivered: 4,
    Received: 5,
    'Return Logged': 6,
    'Return Approved': 8,
    'Return Declined': 7,
    'Return Dispatched': 9,
    'Return Delivered': 10,
    'Return Received': 11,
    Refunded: 12,
    'Payment to Seller Initiated': 13,
  };

  const statusOrderValue = statusOrder[status] || 0;
  const currentStatusValue = statusOrder[currentStatus] || 0;
  console.log(statusOrderValue < currentStatusValue);
  return statusOrderValue < currentStatusValue ? false : true;
};

export const setTimer = async (
  io,
  receiver,
  orderId,
  productId,
  days,
  message,
  adminMessage,
  returnId
) => {
  try {
    const order = await Order.findById(orderId);
    const orderItemIndex = order.orderItems.findIndex(
      (x) => x._id.toString() === productId.toString()
    );
    const orderItem = order.orderItems[orderItemIndex];

    if (orderItem.notifications) {
      const currentDateTime = new Date();
      await Notification.deleteMany({
        _id: { $in: orderItem.notifications },
        createdAt: { $gte: currentDateTime },
      });
    }

    // Convert days to milliseconds
    const milliseconds = days * 24 * 60 * 60 * 1000;
    const beforeTime = 12 * 60 * 60 * 1000;

    console.log(new Date(Date.now() + milliseconds - beforeTime));
    console.log(new Date(Date.now() + milliseconds));

    const admins = await User.find({ isAdmin: true });

    const sellerNotification = new Notification({
      userId: receiver,
      itemId: orderId,
      notifyType: 'remindOrder',
      msg: message,
      link: returnId ? `/return/${returnId}` : `/order/${orderId}`,
      userImage: orderItem.image,
      mobile: returnId
        ? { path: 'ReturnScreen', id: returnId }
        : { path: 'OrderScreen', id: orderId },
      createdAt: new Date(Date.now() + milliseconds - beforeTime),
    });

    // // Prepare an array of notifications to save
    const notificationsToSave = admins.map((admin) => {
      return new Notification({
        userId: admin._id,
        itemId: orderId,
        notifyType: 'remindOrder',
        msg: message,
        link: returnId ? `/return/${returnId}` : `/order/${orderId}`,
        userImage: orderItem.image,
        mobile: returnId
          ? { path: 'ReturnScreen', id: returnId }
          : { path: 'OrderScreen', id: orderId },
        createdAt: new Date(Date.now() + milliseconds - beforeTime),
      });
    });

    // // Prepare an array of notifications to save
    const notificationsToSave2 = admins.map((admin) => {
      return new Notification({
        userId: admin._id,
        itemId: orderId,
        notifyType: 'remindOrder',
        msg: adminMessage,
        link: returnId ? `/return/${returnId}` : `/order/${orderId}`,
        userImage: orderItem.image,
        mobile: returnId
          ? { path: 'ReturnScreen', id: returnId }
          : { path: 'OrderScreen', id: orderId },
        createdAt: new Date(Date.now() + milliseconds),
      });
    });

    // Save seller notification and admin notifications in parallel
    const savePromises = [
      sellerNotification.save(),
      ...notificationsToSave.map((notification) => notification.save()),
      ...notificationsToSave2.map((notification) => notification.save()),
    ];
    const notifications = await Promise.all(savePromises);
    orderItem.notifications = notifications.map(
      (notification) => notification._id
    );

    setTimeout(async () => {
      // Emit Socket.IO event for real-time data update
      io.emit('change_data');
    }, milliseconds - beforeTime);

    setTimeout(async () => {
      // Emit Socket.IO event for real-time data update
      io.emit('change_data');
    }, milliseconds);
    order.orderItems[orderItemIndex] = orderItem;
    await order.save();
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error:', error.message);
  }
};

function get_users_from_database() {
  // Using the User model to fetch users from the database
  return User.find();
}
function transform_to_mp_format(user) {
  /** Transform the above into Mixpanel's format */
  // It's important to set this to the same distinct_id that you use when tracking events.
  // We recommend using the primary key of your users table for this.
  const distinct_id = user._id;

  // Note: we set `$ip` to 0 here to tell Mixpanel not to look up the IP of this user.
  return {
    $distinct_id: distinct_id,
    $token: PROJECT_TOKEN,
    $ip: '0',
    $set: user.toObject(),
  };
}

export const updateMixpanelUser = () => {
  get_users_from_database()
    .then((users) => {
      const profiles = users.map(transform_to_mp_format);

      // We recommend calling this API with batches of 200 user profiles to do this at scale.
      axios
        .post('https://api.mixpanel.com/engage', profiles, {
          params: { verbose: '2' },
          headers: { 'Content-Type': 'application/json' },
        })
        .then((resp) => {
          console.log(resp.data);
          mongoose.disconnect();
        })
        .catch((error) => {
          console.error('Error sending data to Mixpanel:', error);
          mongoose.disconnect();
        });
    })
    .catch((err) => {
      console.error('Error fetching users from MongoDB:', err);
      mongoose.disconnect();
    });
};

export const sendWeeklyMail = async () => {
  const today = moment(); // Get the current date
  const previousMonday = today.clone().startOf('isoWeek').subtract(7, 'days'); // Get the start of the previous week
  const currentMonday = previousMonday.clone().add(7, 'days');

  console.log('Previous Monday:', previousMonday.toDate());
  console.log('Current Monday:', currentMonday.toDate());

  try {
    const productsNGN = await Product.find({
      createdAt: {
        $gte: previousMonday.toDate(),
        $lt: currentMonday.toDate(),
      },
      region: 'NGN',
    }).sort({ createdAt: -1 });
    const productsZAR = await Product.find({
      createdAt: {
        $gte: previousMonday.toDate(),
        $lt: currentMonday.toDate(),
      },
      region: 'ZAR',
    }).sort({ createdAt: -1 });

    // Convert the products array into an array of arrays containing two products each
    const productsInPairsNGN = [];
    const productsInPairsZAR = [];
    for (let i = 0; i < productsNGN.length; i += 2) {
      const pair = {
        firstProduct: productsNGN[i],
        secondProduct: productsNGN[i + 1],
      };
      productsInPairsNGN.push(pair);
    }

    for (let i = 0; i < productsZAR.length; i += 2) {
      const pair = {
        firstProduct: productsZAR[i],
        secondProduct: productsZAR[i + 1],
      };
      productsInPairsZAR.push(pair);
    }

    const emailType = {
      name: 'Hunt It',
      subject: 'HUNT IT - THRIFT IT - FLAUNT IT!',
      template: 'huntIt',
    };

    const existEmails = await Newsletters.find();

    // const existEmails = [
    //   { email: "emmanuelakwuba57@gmail.com", url: "co.za" },
    //   { email: "tobiasomeyi@gmail.com", url: "co.za" },
    // ];

    for (const existEmail of existEmails) {
      console.log(existEmail.email);
      await sendEmail({
        to: existEmail.email,
        subject: emailType.subject,
        template: emailType.template,
        context: {
          url: existEmail.url,
          products:
            existEmail.url === 'com' ? productsInPairsNGN : productsInPairsZAR,
        },
      });
    }

    // Add your logic here
  } catch (error) {
    console.error('Error fetching products:', error);
    // Handle the error
  }
};

export const sendEmailMessage = async ({
  senderId,
  receiverId,
  title,
  text,
  image,
  link,
  io,
  senderImage = 'https://repeddle.com/images/pimage.png', // Default sender image
}) => {
  try {
    // Create a new conversation
    const conversation = await Conversation.create({
      members: [senderId, receiverId],
      userId: receiverId,
      conversationType: 'user',
      canReply: false,
    });

    // Create a new message
    const newMessage = await Message.create({
      conversationId: conversation._id,
      sender: senderId,
      text,
      image,
      link,
    });

    // Create a new notification
    const notification = await Notification.create({
      userId: receiverId,
      itemId: conversation._id,
      notifyType: 'message',
      msg: title,
      link: `/messages?conversation=${conversation._id}`,
      mobile: { path: 'Conversation', id: '' },
      userImage: senderImage,
    });

    // Emit a change_data event
    io.emit('change_data');
  } catch (error) {
    // Handle any errors here
    console.error('Error sending email message:', error);
  }
};
