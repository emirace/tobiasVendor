import express from "express";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import {
  isAuth,
  isAdmin,
  isSellerOrAdmin,
  isSeller,
  slugify,
} from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import RecentView from "../models/recentViewModel.js";

const productRouter = express.Router();

// get all product

productRouter.get("/:region/all", async (req, res) => {
  const { region } = req.params;
  const products = await Product.find({ region, active: true })
    .sort({ createdAt: -1 })
    .populate("seller", "_id username");
  res.send(products);
});

productRouter.post(
  "/:region",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const { region } = req.params;
    const {
      name,
      image1,
      image2,
      image3,
      image4,
      tags,
      video,
      product,
      subCategory,
      category,
      description,
      brand,
      discount,
      price,
      location,
      specification,
      meta,
      sizes: sizes,
      condition,
      feature,
      currency,
      luxury,
      vintage,
      material,
      color,
      luxuryImage,
      deliveryOption,
    } = req.body;
    const slugName = slugify(name);
    const images = [image2, image3, image4];
    const countInStock = sizes.reduce((a, b) => (a = a + Number(b.value)), 0);
    const newProduct = new Product({
      name,
      seller: req.user._id,
      sellerName: req.user.username,
      slug: slugName,
      image: image1,
      images: images ? images : [],
      tags,
      video: video ? video : "",
      price,
      actualPrice: discount,
      product,
      currency,
      meta: meta ? meta : {},
      category,
      subCategory,
      shippingLocation: location,
      brand: brand ? brand : "other",
      specification,
      condition,
      sizes: sizes,
      deliveryOption,
      keyFeatures: feature ? feature : "",
      rating: 0,
      numReviews: 0,
      description,
      // overview: overview ? overview : '',
      likes: [],
      sold: false,
      active: true,
      countInStock: req.body.addSize ? req.body.countInStock : countInStock,
      luxury,
      vintage,
      material,
      color,
      luxuryImage,
      region,
    });
    const createdProduct = await newProduct.save();
    createdProduct.productId = createdProduct._id.toString();
    await createdProduct.save();

    res.send({ message: "Product Created", createdProduct });
  })
);

productRouter.put(
  "/:id",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId).populate("seller", "_id");
    const slugName = slugify(req.body.name);
    const images = [req.body.image2, req.body.image3, req.body.image4];
    const countInStock = req.body.sizes.reduce(
      (a, b) => (a = a + Number(b.value)),
      0
    );
    const useractive = () => (req.body.active === "yes" ? true : false);
    const userbadge = () => (req.body.badge === "yes" ? true : false);
    if (product.seller._id.toString() === req.user._id || req.user.isAdmin) {
      if (product && !product.sold) {
        product.name = req.body.name || product.name;
        product.price = req.body.price || product.price;
        product.actualPrice = req.body.discount || product.actualPrice;
        product.product = req.body.mainCate || product.product;
        product.category = req.body.category || product.category;
        product.subCategory = req.body.subCategory || product.subCategory;
        product.product = req.body.product || product.category;
        product.subCategory = req.body.subCategory || product.subCategory;
        product.image = req.body.image1 || product.image;
        product.images = images || product.images;
        product.tags = req.body.tags || product.tags;
        product.brand = req.body.brand || product.brand;
        product.countInStock = countInStock || product.countInStock;
        product.description = req.body.description || product.description;
        product.specification = req.body.specification || product.specification;
        product.keyFeatures = req.body.feature || product.keyFeatures;
        product.badge = req.user.isAdmin
          ? req.body.badge === ""
            ? req.user.badge
            : userbadge()
          : product.badge;
        product.active = req.user.isAdmin
          ? req.body.active === ""
            ? req.user.active
            : useractive()
          : product.active;
        product.sizes = req.body.sizes || product.sizes;
        await product.save();
        res.send({ message: "Product Updated" });
      } else {
        res.status(404).send({ message: "Product Not Found" });
        throw { message: "Product Not Found" };
      }
    } else {
      res.status(404).send({ message: "You can't edit someelse product" });
      throw { message: "You can't edit someelse product" };
    }
  })
);

productRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
      const view = await RecentView.findOne({ productId: req.params.id });
      if (view) {
        await view.remove();
      }

      res.send({ message: "Product Delected" });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

productRouter.post(
  "/:id/reviews",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId).populate(
      "reviews",
      "usernsme image"
    );
    if (product) {
      if (product.seller.toString() === req.user._id) {
        return res
          .status(400)
          .send({ message: "You can't review your product" });
      }
      if (product.reviews.find((x) => x.name === req.user.username)) {
        return res
          .status(400)
          .send({ message: "You already submitted a review" });
      }
      if (!product.userBuy.includes(req.user._id)) {
        return;
      }

      const review = {
        name: req.body.name,
        user: req.user._id,
        rating: Number(req.body.rating),
        comment: req.body.comment,
        like: req.body.like,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;

      const updatedProduct = await product.save();

      res.status(201).send({
        message: "Review Created",
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
        numReviews: product.numReviews,
        rating: product.rating,
      });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

productRouter.delete(
  "/:id/reviews/:reviewId",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      const newReviewList = product.reviews.filter(
        (x) => x._id.toString() !== req.params.reviewId
      );
      product.reviews = newReviewList;
      product.numReviews = product.reviews.length;
      product.rating = product.reviews.length
        ? product.reviews.reduce((a, c) => c.rating + a, 0) /
          product.reviews.length
        : 0;

      const updatedProduct = await product.save();

      res.status(201).send({
        message: "Review Deleted",
        reviews: updatedProduct.reviews,
        numReviews: product.numReviews,
        rating: product.rating,
      });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

productRouter.put(
  "/:id/save",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      const user = await User.findById(req.user._id);
      if (user) {
        if (user.saved.includes(product._id)) {
          user.saved.pull(productId);
          const updatedUser = await user.save();

          res.status(201).send({
            message: "Product removed from wishlist",
            user: updatedUser,
            status: "visible1 error",
          });
        } else {
          user.saved.push(productId);
          const updatedUser = await user.save();
          res.status(201).send({
            message: "Product added to wishlist",
            user: updatedUser,
            status: "visible1 success",
          });
        }
      } else {
        res.status(404).send({
          message: "you must login to like product",
        });
      }
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

productRouter.put(
  "/:id/unsave",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      const user = await User.findById(req.user._id);
      if (user) {
        if (user.saved.includes(product._id)) {
          user.saved.pull(productId);
          const updatedUser = await user.save();

          res.status(201).send({
            message: "Product removed from wishlist",
            user: updatedUser,
            status: "visible1 error",
          });
        }
      } else {
        res.status(404).send({
          message: "you must login to save to wishlist",
        });
      }
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

productRouter.put(
  "/:id/likes",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId).populate(
      "seller",
      "username image sold"
    );
    if (product) {
      const user = await User.findById(req.user._id);
      if (user) {
        product.likes.push(req.user._id);

        const updatedProduct = await product.save();
        res.status(201).send({
          message: "Liked Product",
          product: updatedProduct,
        });

        user.likes.push(productId);
        const newuser = await user.save();
      } else {
        res.status(404).send({
          message: "you must login to like product",
        });
      }
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

productRouter.put(
  "/:id/shares",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId).populate(
      "seller",
      "username image sold"
    );
    if (product) {
      const exist = product.shares.filter(
        (x) => x._id.toString() === req.user._id
      );
      console.log("exist", exist.length, exist === [], [], "[]");
      if (exist.length > 0) {
        res.status(500).send({ message: "Already shared product" });
      } else {
        product.shares.push(req.user._id);
        const updatedProduct = await product.save();
        res.status(200).send({
          message: "Product Shared",
          product: updatedProduct,
        });
      }
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

productRouter.put(
  "/:id/unlikes",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId).populate(
      "seller",
      "username image sold"
    );
    if (product) {
      const user = await User.findById(req.user._id);
      if (user) {
        product.likes.pull(req.user._id);
        const updatedProduct = await product.save();
        res.status(201).send({
          message: "Unliked Product",
          product: updatedProduct,
        });

        user.likes.pull(productId);
        await user.save();
      } else {
        res.status(404).send({
          message: "you must login to like product",
        });
      }
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

const PAGE_SIZE = 20;

// get all Product with pagination

productRouter.get(
  "/:region/admin",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { region } = req.params;
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;
    const searchQuery = query.q;

    const queryFilter =
      searchQuery && searchQuery !== "all"
        ? {
            $or: [
              {
                name: {
                  $regex: searchQuery,
                  $options: "i",
                },
              },
              {
                productId: {
                  $regex: searchQuery,
                  $options: "i",
                },
              },
            ],
          }
        : {};

    const products = await Product.find({ ...queryFilter, region })
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 })
      .limit(pageSize);

    const countProducts = await Product.countDocuments({ region });
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

productRouter.get(
  "/:region/admin/outofstock",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { region } = req.params;
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;
    const searchQuery = query.q;

    const queryFilter =
      searchQuery && searchQuery !== "all"
        ? {
            $or: [
              {
                name: {
                  $regex: searchQuery,
                  $options: "i",
                },
              },
              {
                productId: {
                  $regex: searchQuery,
                  $options: "i",
                },
              },
            ],
          }
        : {};

    const products = await Product.find({
      ...queryFilter,
      countInStock: { $lte: 0 },
      region,
    })
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments({ region });
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

// get all Product with pagination for a user

productRouter.get(
  "/seller/:id",
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const seller = req.params.id;
    const products = await Product.find({ seller })
      .populate("seller", "username")
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
  "/seller/search/:id",
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const searchQuery = query.q;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;
    const queryFilter =
      searchQuery && searchQuery !== "all"
        ? {
            $or: [
              {
                name: {
                  $regex: searchQuery,
                  $options: "i",
                },
              },
              {
                productId: {
                  $regex: searchQuery,
                  $options: "i",
                },
              },
            ],
          }
        : {};

    const seller = req.params.id;
    const products = await Product.find({ seller, ...queryFilter })
      .populate("seller", "username image")
      .sort({ createdAt: -1 })
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
  "/:region/search",
  expressAsyncHandler(async (req, res) => {
    const { region } = req.params;
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || "";
    const brand = query.brand || "";
    const price = query.price || "";
    const color = query.color || "";
    const size = query.size || "";
    const rating = query.rating || "";
    const order = query.order || "";
    const condition = query.condition || "";
    const deal = query.deal || "";
    const shipping = query.shipping || "";
    const availability = query.availability || "";
    const type = query.type || "";
    const pattern = query.pattern || "";
    const searchQuery = query.query || "";
    const queryFilter =
      searchQuery && searchQuery !== "all"
        ? {
            $or: [
              {
                name: {
                  $regex: searchQuery,
                  $options: "i",
                },
              },
              {
                sellerName: {
                  $regex: searchQuery,
                  $options: "i",
                },
              },
              {
                brand: {
                  $regex: searchQuery,
                  $options: "i",
                },
              },
              {
                color: {
                  $regex: searchQuery,
                  $options: "i",
                },
              },
              {
                category: {
                  $regex: searchQuery,
                  $options: "i",
                },
              },
              {
                subCategory: {
                  $regex: searchQuery,
                  $options: "i",
                },
              },
              {
                product: {
                  $regex: searchQuery,
                  $options: "i",
                },
              },
              {
                material: {
                  $regex: searchQuery,
                  $options: "i",
                },
              },
              {
                tags: {
                  $regex: searchQuery,
                  $options: "i",
                },
              },
            ],
          }
        : {};

    const availabilityFilter =
      availability && availability === "Sold Items" ? { sold: true } : {};
    const categoryFilter =
      category && category !== "all" ? { subCategory: category } : {};
    const brandFilter = brand && brand !== "all" ? { brand } : {};
    const colorFilter = color && color !== "all" ? { color } : {};
    const dealFilter =
      deal && deal === "all"
        ? {}
        : deal === "On Sale Now"
        ? { countInStock: { $gt: 0 } }
        : {};
    const shippingFilter = shipping && shipping !== "all" ? { shipping } : {};
    const typeFilter = type && type !== "all" ? { type } : {};
    const patternFilter =
      pattern && pattern !== "all" ? { material: pattern } : {};
    const conditionFilter =
      condition && condition !== "all" ? { condition } : {};
    const sizeFilter = size && size !== "all" ? { "sizes.size": size } : {};
    const ratingFilter =
      rating && rating !== "all"
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    const priceFilter =
      price && price !== "all"
        ? {
            price: {
              $gte: Number(price.split("-")[0]),
              $lte: Number(price.split("-")[1]),
            },
          }
        : {};
    const sortOrder =
      order === "featured"
        ? { featured: -1 }
        : order === "lowest"
        ? { price: 1 }
        : order === "highest"
        ? { price: -1 }
        : order === "toprated"
        ? { raing: -1 }
        : order === "newest"
        ? { creatAt: -1 }
        : order === "likes"
        ? { likes: -1 }
        : order === "relevance"
        ? { updatedAt: -1 }
        : { _id: -1 };
    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...colorFilter,
      ...brandFilter,
      ...sizeFilter,
      ...ratingFilter,
      ...conditionFilter,
      ...dealFilter,
      ...typeFilter,
      ...availabilityFilter,
      ...shippingFilter,
      ...patternFilter,
      region,
      active: true,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
      ...colorFilter,
      ...brandFilter,
      ...sizeFilter,
      ...ratingFilter,
      ...conditionFilter,
      ...dealFilter,
      ...typeFilter,
      ...availabilityFilter,
      ...shippingFilter,
      ...patternFilter,
      region,
      active: true,
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
  "/categories",
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct("category");
    res.send(categories);
  })
);

productRouter.get("/slug/:slug", async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate(
      "seller",
      "username rebundle email image sold slug rating numReviews address region lastName firstName badge"
    )
    .populate("reviews.name", "username image");
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Product Not Found" });
  }
});

productRouter.get("/:id", async (req, res) => {
  console.log("checking");
  const product = await Product.findById(req.params.id).populate(
    "seller",
    "username"
  );
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Product Not Found" });
  }
});

export default productRouter;
