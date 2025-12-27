import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { paginate } from "../utils/pagination.js";
import { getSignedImageUrl } from "../utils/s3SignedUrl.js";
import slugify from "slugify";

export const createProduct = async (req, res) => {
  const {
    title,
    description,
    price,
    compareAtPrice,
    stock,
    sku,
    categoryId,
    isActive = true,
  } = req.body;

  if (!title || !price || !categoryId) {
    const err = new Error("Title, price and category are required");
    err.statusCode = 400;
    throw err;
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    const err = new Error("Invalid category");
    err.statusCode = 400;
    throw err;
  }

  const slug = slugify(title, { lower: true, strict: true });

  const exists = await Product.findOne({ slug });
  if (exists) {
    const err = new Error("Product with same title already exists");
    err.statusCode = 409;
    throw err;
  }

  const images = req.files?.map((file) => file.key) || [];

  const product = await Product.create({
    title,
    slug,
    description,
    price,
    compareAtPrice,
    stock,
    sku,
    images,
    categoryId,
    isActive,
  });

  res.status(201).json({
    success: true,
    data: product,
  });
};

/**
 * LIST PRODUCTS (Public)
 * Supports pagination + filters
 */
export const listProducts = async (req, res) => {
  const { skip, limit } = paginate(req.query.page, req.query.limit);

  const filter = { isActive: true };

  if (req.query.categoryId) {
    filter.categoryId = req.query.categoryId;
  }

  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }

  const products = await Product.find(filter)
    .populate("categoryId", "name slug")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(filter);

  const data = await Promise.all(
    products.map(async (product) => {
      const signedImages = await Promise.all(
        product.images.map((key) => getSignedImageUrl(key))
      );

      return {
        ...product.toObject(),
        images: signedImages,
      };
    })
  );

  res.json({
    success: true,
    meta: {
      total,
      page: Number(req.query.page) || 1,
      limit,
    },
    data,
  });
};

/**
 * GET SINGLE PRODUCT (Public)
 */
export const getProduct = async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    isActive: true,
  }).populate("categoryId", "name slug");

  if (!product) {
    const err = new Error("Product not found");
    err.statusCode = 404;
    throw err;
  }

  const images = await Promise.all(
    product.images.map((key) => getSignedImageUrl(key))
  );

  res.json({
    success: true,
    data: {
      ...product.toObject(),
      images,
    },
  });
};

/**
 * UPDATE PRODUCT (Admin)
 */
export const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    const err = new Error("Product not found");
    err.statusCode = 404;
    throw err;
  }

  // Update slug if title changes
  if (req.body.title) {
    req.body.slug = slugify(req.body.title, {
      lower: true,
      strict: true,
    });
  }

  if (req.files && req.files.length > 0) {
    req.body.images = [...product.images, ...req.files.map((file) => file.key)];
  }

  // Update product fields
  Object.assign(product, req.body);
  await product.save();

  res.json({
    success: true,
    data: product,
  });
};

/**
 * DELETE PRODUCT (Admin) – SOFT DELETE
 */
export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!product) {
    const err = new Error("Product not found");
    err.statusCode = 404;
    throw err;
  }

  res.json({
    success: true,
    message: "Product disabled successfully",
  });
};
