import express from 'express';
import Category from '../models/commentModel.js';
import { isAdmin, isAuth } from '../utils.js';
import expressAsyncHandler from 'express-async-handler';

const categoryRouter = express.Router();

// get all categories

categoryRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const categories = await Category.fing();
    res.send(categories);
  })
);

// add a category

categoryRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const category = new Category({
      name: req.body.name,
      subCategories: req.body.subCategories,
    });

    await category.save();
    res.status(201).send('Category added');
  })
);

// update a category

categoryRouter.put(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const category = await Category.findById(req.body.id);

    if (category) {
      category.name = req.body.name || category.name;
      category.subCategories = req.body.subCategories || category.subCategories;

      const newCategory = await category.save();
      res.status(201).send(newCategory);
    } else {
      res.status(404).send('Category not found');
    }
  })
);

// delete a category

categoryRouter.delete(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const category = await Category.findById(req.body.id);
    if (category) {
      await category.remove();
      res.send('Category deleted');
    } else {
      res.status(404).send('Category not found');
    }
  })
);

// get a category

categoryRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (category) {
      res.status(201).send(category);
    } else {
      res.status(404).send('Category not found');
    }
  })
);

export default categoryRouter;
