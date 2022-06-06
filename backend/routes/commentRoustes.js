import express from 'express';
import Product from '../models/productModel.js';
import Comment from '../models/commentModel.js';
import { isAuth } from '../utils.js';
import expressAsyncHandler from 'express-async-handler';

const commentRouter = express.Router();

commentRouter.post(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      const commentnow = new Comment({
        productId: product._id,
        name: req.user.name,
        comment: req.body.comment,
      });
      const newComment = await commentnow.save();

      res.status(201).send(newComment);
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

commentRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const comments = await Comment.find({ productId });
    res.send(comments);
  })
);

export default commentRouter;
