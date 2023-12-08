import express from "express";
import Product from "../models/productModel.js";
import Comment from "../models/commentModel.js";
import { isAdmin, isAuth } from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const commentRouter = express.Router();

// post comment

commentRouter.post(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    const user = await User.findById(req.user._id);
    if (product) {
      const commentnow = new Comment({
        productId: product._id,
        name: req.user.username,
        comment: req.body.comment,
        userImage: user.image,
        writerId: req.user._id,
        image: req.body.image ? req.body.image : "",
        replies: [],
        likes: [],
      });
      const newComment = await commentnow.save();

      res.status(201).send(newComment);
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

// get a comment

commentRouter.get(
  "/comment/:id",
  expressAsyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (comment) {
      res.send(comment);
    } else {
      res.status(404).send("Comment not found");
    }
  })
);

// get all comments

commentRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const comments = await Comment.find({ productId });
    res.send(comments);
  })
);

// like a comment

commentRouter.put(
  "/:id/like",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const commentId = req.params.id;
    const comment = await Comment.findById(commentId);
    if (comment) {
      const user = await User.findById(req.user._id);
      if (user) {
        const exist = comment.likes.filter(
          (x) => x.toString() === req.user._id
        );
        if (exist.length > 0) {
          return;
        }

        comment.likes.push(req.user._id);
        const updatedComment = await comment.save();
        res
          .status(201)
          .send({ message: "Comment Liked", comment: updatedComment });
      } else {
        res.status(404).send({ message: "You must login to like comment" });
      }
    } else {
      res.status(404).send({ message: "Comment Not Found" });
    }
  })
);

// Unlike comment

commentRouter.put(
  "/:id/unlike",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const commentId = req.params.id;
    const comment = await Comment.findById(commentId);
    if (comment) {
      const user = await User.findById(req.user._id);
      if (user) {
        comment.likes.pull(req.user._id);
        const updatedComment = await comment.save();
        res
          .status(201)
          .send({ message: "Comment UnLiked", comment: updatedComment });
      } else {
        res.status(404).send({ message: "You must login to like comment" });
      }
    } else {
      res.status(404).send({ message: "Comment Not Found" });
    }
  })
);

// post reply

commentRouter.post(
  "/reply/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    const comment = await Comment.findById(id);
    const user = await User.findById(req.user._id);
    if (comment) {
      const reply = {
        name: req.user.username,
        comment: req.body.reply,
        userImage: user.image,
      };
      comment.replies.push(reply);
      const updateComment = await comment.save();
      res.status(201).send({
        message: "Reply Send",
        comment: updateComment,
      });
    } else {
      res.status(404).send({ message: "Comment Not Found" });
    }
  })
);

// like a reply

commentRouter.put(
  "/reply/:id/:reply/like",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const commentId = req.params.id;
    const replyId = req.params.reply;
    const comment = await Comment.findById(commentId);
    if (comment) {
      const index = comment.replies.findIndex((x) => {
        return x._id.toString() === replyId;
      });
      const exist = comment.replies[index].likes.filter(
        (x) => x.toString() === req.user._id
      );
      if (exist.length > 0) {
        return;
      }
      comment.replies[index].likes.push(req.user._id);
      const updatedComment = await comment.save();
      res.status(201).send({ message: "Reply Liked", comment: updatedComment });
    } else {
      res.status(404).send({ message: "Comment Not Found" });
    }
  })
);

// unlike comment

commentRouter.put(
  "/reply/:id/:reply/unlike",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const commentId = req.params.id;
    const replyId = req.params.reply;
    const comment = await Comment.findById(commentId);
    if (comment) {
      const index = comment.replies.findIndex((x) => {
        return x._id.toString() === replyId;
      });

      comment.replies[index].likes.pull(req.user._id);
      const updatedComment = await comment.save();
      res.status(201).send({ message: "Reply Liked", comment: updatedComment });
    } else {
      res.status(404).send({ message: "Comment Not Found" });
    }
  })
);

commentRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (comment) {
      await comment.remove();
      res.send("Comment deleted");
    } else {
      res.status(404).send("Comment not found");
    }
  })
);

export default commentRouter;
