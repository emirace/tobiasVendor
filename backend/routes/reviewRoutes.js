import express from "express";
import expressAsyncHandler from "express-async-handler";
import { isAuth, isAdmin } from "../utils.js";
import User from "../models/userModel.js";
import Review from "../models/reviewModel.js";

const reviewRouter = express.Router();

reviewRouter.post(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const sellerId = req.params.id;
      const { rating, comment, like } = req.body;
      const seller = await User.findById(sellerId);

      if (!seller) {
        return res.status(404).send({ message: "User Not Found" });
      }

      if (req.user._id === sellerId) {
        return res.status(400).send({ message: "You can't review yourself" });
      }

      const existingReview = await Review.findOne({
        buyerId: req.user._id,
        sellerId,
      });

      if (existingReview) {
        return res
          .status(400)
          .send({ message: "You already submitted a review" });
      }

      const bought = seller.buyers.find((buyer) => buyer === req.user._id);
      if (!bought) {
        return res.status(400).send({
          message:
            "You can't write a review until you purchase this user product",
        });
      }

      const review = new Review({
        buyerId: req.user._id,
        sellerId: seller._id,
        rating,
        comment,
        like,
      });

      const savedReview = await review.save();

      const reviews = await Review.find({ sellerId: seller._id });

      const numReviews = reviews.length;
      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      seller.numReviews = numReviews;
      seller.rating = totalRating / numReviews;

      await seller.save();

      res.status(201).send({
        message: "Review Created",
        review: savedReview,
        numReviews,
        rating: seller.rating,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal Server error" });
    }
  })
);

reviewRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const reviews = await Review.find({ sellerId: req.params.id })
      .populate("sellerId", "image username")
      .populate("buyerId", "image username");
    res.send(reviews);
  })
);

reviewRouter.put(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const { comment } = req.body;
      const review = await Review.findById(req.params.id)
        .populate("sellerId", "image username")
        .populate("buyerId", "image username");

      if (!review) {
        return res.status(404).send({ message: "Review not found" });
      }

      if (review.sellerId._id.toString() !== req.user._id) {
        return res
          .status(400)
          .send({ message: "You can't reply to this review" });
      }

      review.sellerReply = comment;
      const updatedReview = await review.save();
      res.send(updatedReview);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal Server error" });
    }
  })
);

export default reviewRouter;
