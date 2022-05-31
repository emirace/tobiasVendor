import express from 'express';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import {
  isAuth,
  isAdmin,
  isSellerOrAdmin,
  isSeller,
  slugify,
} from '../utils.js';
import expressAsyncHandler from 'express-async-handler';

const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

productRouter.post(
  '/',
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const {
      name,
      image,
      images,
      video,
      category,
      description,
      brand,
      actualPrice,
      price,
      shippingLocation,
      specification,
      size,
      condition,
      keyFeatures,
      overview,
      countInStock,
    } = req.body;
    const slugName = slugify(name);

    const newProduct = new Product({
      name,
      seller: req.user._id,
      slug: slugName,
      image,
      images: images ? images : [],
      video: video ? video : '',
      price,
      actualPrice: actualPrice ? actualPrice : '',
      category,
      shippingLocation,
      brand: brand ? brand : 'other',
      condition,
      size,
      countInStock,
      keyFeatures: keyFeatures ? keyFeatures : '',
      rating: 0,
      numReviews: 0,
      description,
      overview: overview ? overview : '',
      likes: [],
      sold: false,
    });
    const product = await newProduct.save();
    res.send({ message: 'Product Created', product });
  })
);

productRouter.put(
  '/:id',
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      product.name = req.body.name;
      product.price = req.body.price;
      product.image = req.body.image;
      product.images = req.body.images;
      product.category = req.body.category;
      product.brand = req.body.brand;
      product.countInStock = req.body.countInStock;
      product.description = req.body.description;

      await product.save();
      res.send({ message: 'Product Updated' });
    } else {
      res.status(404).send({ message: '{Product Not Found' });
    }
  })
);

productRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
      res.send({ message: 'Product Delected' });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.post(
  '/:id/reviews',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      if (product.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: 'You already submitted a review' });
      }
      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;

      const updatedProduct = await product.save();

      res.status(201).send({
        message: 'Review Created',
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
        numReviews: product.numReviews,
        rating: product.rating,
      });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.put(
  '/:id/save',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      const user = await User.findById(req.user._id);
      if (user) {
        console.log(user.saved);
        console.log(product._id);
        console.log('space');
        user.saved.map((x) =>
          JSON.stringify(x) === product._id
            ? console.log('yes)')
            : console.log(x)
        );

        user.saved.push(productId);

        const updatedUser = await user.save();
        res.status(201).send({
          message: 'Liked Product',
          user: updatedUser,
        });

        user.likes.push(productId);
        const newuser = await user.save();
      } else {
        res.status(404).send({ message: 'you must login to like product' });
      }
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.put(
  '/:id/likes',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId).populate(
      'seller',
      'seller.name seller.logo seller.rating seller.numReviews'
    );
    if (product) {
      const user = await User.findById(req.user._id);
      if (user) {
        product.likes.push(req.user._id);

        const updatedProduct = await product.save();
        res.status(201).send({
          message: 'Liked Product',
          product: updatedProduct,
        });

        user.likes.push(productId);
        const newuser = await user.save();
      } else {
        res.status(404).send({ message: 'you must login to like product' });
      }
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);
productRouter.put(
  '/:id/unlikes',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId).populate(
      'seller',
      'seller.name seller.logo seller.rating seller.numReviews'
    );
    if (product) {
      const user = await User.findById(req.user._id);
      if (user) {
        product.likes.pull(req.user._id);
        const updatedProduct = await product.save();
        res.status(201).send({
          message: 'Unliked Product',
          product: updatedProduct,
        });

        user.likes.pull(productId);
        await user.save();
      } else {
        res.status(404).send({ message: 'you must login to like product' });
      }
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

const PAGE_SIZE = 10;

productRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const products = await Product.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments();
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

productRouter.get(
  '/seller/:id',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const seller = req.params.id;
    const products = await Product.find({ seller })
      .populate('seller', 'seller.name seller.logo')
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.find({ seller }).countDocuments();
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

productRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const brand = query.brand || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';
    const searchQuery = query.query || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    const priceFilter =
      price && price !== 'all'
        ? {
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};
    const sortOrder =
      order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { raing: -1 }
        : order === 'newest'
        ? { creatAt: -1 }
        : { _id: -1 };
    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });

    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

productRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category');
    res.send(categories);
  })
);

productRouter.get('/slug/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate(
    'seller',
    'seller.name seller.logo seller.rating seller.numReviews'
  );
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});
productRouter.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

export default productRouter;
