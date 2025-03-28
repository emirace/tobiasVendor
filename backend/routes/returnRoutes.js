import express from "express";
import {
  fillEmailContent,
  isAdmin,
  isAuth,
  sendEmail,
  sendEmailMessage,
  setTimer,
} from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import Return from "../models/returnModel.js";
import Product from "../models/productModel.js";
import Transaction from "../models/transactionModel.js";

const returnRouter = express.Router();

// get all returns
returnRouter.get(
  "/:region/admin",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { region } = req.params;
    const { query } = req;
    const searchQuery = query.q;
    const queryFilter =
      searchQuery && searchQuery !== "all"
        ? {
            $or: [
              {
                returnId: {
                  $regex: searchQuery,
                  $options: "i",
                },
              },
            ],
          }
        : {};
    const returns = await Return.find({ region, ...queryFilter })
      .sort({ createdAt: -1 })
      .populate("productId")
      .populate({
        path: "orderId",
        select: "user orderItems",
        populate: [{ path: "user", select: "username" }],
      });
    res.send(returns);
  })
);

// get all returns querry
returnRouter.get(
  "/:region/admin/query",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { region } = req.params;
    const { query } = req;
    const searchQuery = query.q;
    const queryFilter =
      searchQuery && searchQuery !== "all"
        ? {
            $or: [
              {
                returnId: {
                  $regex: searchQuery,
                  $options: "i",
                },
              },
            ],
          }
        : {};
    const returns = await Return.find({ region, ...queryFilter })
      .sort({ createdAt: -1 })
      .populate("productId")
      .populate({
        path: "orderId",
        select: "user orderItems",
        populate: [{ path: "user", select: "username" }],
      });
    res.send(returns);
  })
);

// get returns for a user
returnRouter.get(
  "/seller",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const searchQuery = query.q;
    const queryFilter =
      searchQuery && searchQuery !== "all"
        ? {
            $or: [
              {
                returnId: {
                  $regex: searchQuery,
                  $options: "i",
                },
              },
            ],
          }
        : {};
    const returns = await Return.find({
      sellerId: req.user._id,
      ...queryFilter,
    })
      .sort({ createdAt: -1 })
      .populate("productId")
      .populate({
        path: "orderId",
        select: "user orderItems",
        populate: [{ path: "user", select: "username" }],
      });
    res.send(returns);
  })
);

// get returns for a user
returnRouter.get(
  "/buyer",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const searchQuery = query.q;
    const queryFilter =
      searchQuery && searchQuery !== "all"
        ? {
            $or: [
              {
                returnId: {
                  $regex: searchQuery,
                  $options: "i",
                },
              },
            ],
          }
        : {};
    const returns = await Return.find({
      buyerId: req.user._id,
      ...queryFilter,
    })
      .sort({ createdAt: -1 })
      .populate("productId")
      .populate({
        path: "orderId",
        select: "user orderItems",
        populate: [{ path: "user", select: "username" }],
      });
    res.send(returns);
  })
);

// add a returned

returnRouter.post(
  "/:region",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { region } = req.params;
    const io = req.app.get("io");
    const product = await Product.findById(req.body.productId).populate(
      "seller",
      "email"
    );
    const returned = new Return({
      orderId: req.body.orderId,
      productId: req.body.productId,
      sellerId: product.seller._id,
      buyerId: req.user._id,
      reason: req.body.reason,
      resolution: req.body.resolution,
      sending: req.body.sending,
      refund: req.body.refund,
      image: req.body.image,
      region,
      others: req.body.others,
    });
    sendEmail({
      to: product.seller.email,
      subject: "ORDER RETURN RECEIVED ",
      template: "returnRequest",
      context: {
        username: "Tribe",
        url: region === "NGN" ? "com" : "co.za",
        orderId: req.body.orderId,
        reason: req.body.reason,
      },
    });

    returned.returnId = returned._id.toString();
    const newReturn = await returned.save();
    sendEmail({
      to: req.user.email,
      subject: "ORDER RETURN RECEIVED ",
      template: "returnRequest",
      context: {
        username: "Tribe",
        url: region === "NGN" ? "com" : "co.za",
        orderId: req.body.orderId,
        reason: req.body.reason,
      },
    });
    res.status(201).send(newReturn);
  })
);

// update a returned by admin
returnRouter.put(
  "/admin/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const io = req.app.get("io");
    const returned = await Return.findById(req.params.id)
      .populate({
        path: "orderId",
        select: "user orderItems",
        populate: {
          path: "user",
          select: "image username email",
        },
      })
      .populate({
        path: "productId",
        select: "seller actualPrice image name slug",
        populate: { path: "seller", select: "image username email" },
      });
    if (returned) {
      const url = returned.region === "NGN" ? "com" : "co.za";
      returned.adminReason = req.body.adminReason;
      returned.status = req.body.status;
      returned.comfirmDelivery = req.body.transaction_id;
      const newReturn = await returned.save();
      switch (newReturn.status) {
        case "Decline":
          sendEmail({
            to: returned.orderId.user.email,
            subject: "ORDER RETURN DECLINED",
            template: "returnDeclineBuyer",
            context: {
              username: returned.orderId.user.username,
              orderId: returned.orderId._id,
              reason: returned.reason,
              returnId: returned._id,
              declineReason: req.body.adminReason,
              url,
            },
          });
          const content1 = {
            io,
            receiverId: returned.orderId.user._id,
            senderId: req.user._id,
            title: "Request For Return Declined.",
            emailMessages: fillEmailContent("Request For Return Declined.", {
              USERNAME: returned.orderId.user.username,
              EMAIL: returned.orderId.user.email,
            }),
          };
          sendEmailMessage(content1);
          break;
        case "Approved":
          sendEmail({
            to: returned.orderId.user.email,
            subject: "ORDER RETURN APPROVED",
            template: "returnAppoveBuyer",
            context: {
              username: returned.orderId.user.username,
              orderId: returned.orderId._id,
              returnId: returned._id,
              url,
            },
          });
          const content = {
            io,
            receiverId: returned.orderId.user._id,
            senderId: req.user._id,
            title: "Request For Return Approved.",
            emailMessages: fillEmailContent("Request For Return Approved.", {
              USERNAME: returned.orderId.user.username,
              EMAIL: returned.orderId.user.email,
            }),
          };
          sendEmailMessage(content);

          sendEmail({
            to: returned.productId.seller.email,
            subject: "ORDER RETURN APPROVED",
            template: "returnAppoveSeller",
            context: {
              username: returned.productId.seller.username,
              orderId: returned.orderId._id,
              returnId: returned._id,
              reason: returned.reason,
              url,
            },
          });
          const content2 = {
            io,
            receiverId: returned.productId.seller._id,
            senderId: req.user._id,
            title: "Request For Return Approved.",
            emailMessages: fillEmailContent("Request For Return Approved.", {
              USERNAME: returned.productId.seller.username,
              EMAIL: returned.productId.seller.email,
            }),
          };
          sendEmailMessage(content2);

          setTimer(
            io,
            returned.productId.seller._id,
            returned.orderId._id,
            returned.productId._id,
            3,
            "12hrs Left To Provide Return Receiving Address,",
            "Return Receipt Address Not Provided, Refund Buyer.",
            returned._id
          );
          break;

        default:
          break;
      }

      res.status(200).send(newReturn);
    } else {
      res.status(404).send("returned not found");
    }
  })
);
returnRouter.put(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const io = req.app.get("io");
    const returned = await Return.findById(req.params.id)
      .populate({
        path: "orderId",
        select: "user orderItems",
        populate: {
          path: "user",
          select: "image username",
        },
      })
      .populate({
        path: "productId",
        select: "seller actualPrice image name currency",
        populate: { path: "seller", select: "image username" },
      });
    const transaction = await Transaction.find({
      "metadata.transaction_id": req.body.comfirmDelivery,
    });
    if (transaction) {
      if (returned) {
        const product = await Product.findById(returned.productId);
        if (product.seller.toString() === req.user._id) {
          returned.returnDelivery = req.body.meta;
          const newReturn = await returned.save();
          setTimer(
            io,
            returned.orderId.user._id,
            returned.orderId._id,
            product._id,
            3,
            "12hrs Left To Mark Return As Dispatched.",
            "Return Not Dispatched, Pay Seller.",
            returned._id
          );
          res.status(200).send(newReturn);
        }
      } else {
        res.status(404).send("returned not found");
      }
    } else {
      res.status(500).send("Fund your wallet to complete return");
    }
  })
);

returnRouter.put(
  "/:id/transaction",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const returned = await Return.findById(req.params.id)
      .populate({
        path: "orderId",
        select: "user orderItems",
        populate: {
          path: "user",
          select: "image username",
        },
      })
      .populate({
        path: "productId",
        select: "seller actualPrice image name",
        populate: { path: "seller", select: "image username" },
      });

    if (!returned) {
      return res.status(404).send("returned not found");
    }

    const transaction = await Transaction.find({
      "metadata.transaction_id": req.body.transaction_id,
    });
    if (
      !transaction &&
      returned.sending["delivery Option"] !== "Pick up from Seller"
    ) {
      return res.status(404).send("Invalid transaction id");
    }

    const product = await Product.findById(returned.productId);
    if (product.seller.toString() === req.user._id) {
      returned.comfirmDelivery = req.body.transaction_id;
      const newReturn = await returned.save();
      res.status(200).send(newReturn);
    }
  })
);

// delete a returned

returnRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const returned = await Return.findById(req.params.id);
    if (returned) {
      await returned.remove();
      res.send("Adress deleted");
    } else {
      res.status(404).send("Return not found");
    }
  })
);

// get a returned

returnRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const returned = await Return.findById(req.params.id)
      .populate({
        path: "orderId",
        select: "user orderItems shippingPrice",
        populate: {
          path: "user",
          select: "image username",
        },
      })
      .populate({
        path: "productId",
        select: "seller actualPrice image name slug currency",
        populate: { path: "seller", select: "image username" },
      });
    if (returned) {
      res.status(201).send(returned);
    } else {
      res.status(404).send("returned not found");
    }
  })
);

export default returnRouter;
