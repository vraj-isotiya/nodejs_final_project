import Category from "../models/Category.js";
import { paginate } from "../utils/pagination.js";
import slugify from "slugify";

export const createCategory = async (req, res) => {
  const category = await Category.create({
    name: req.body.name,
    slug: slugify(req.body.name, { lower: true }),
    isActive: true,
  });
  res.status(201).json(category);
};

export const listCategories = async (req, res) => {
  const { skip, limit } = paginate(req.query.page, req.query.limit);
  const categories = await Category.find({ isActive: true })
    .skip(skip)
    .limit(limit);
  res.json(categories);
};

export const getCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new Error("Category not found");
  res.json(category);
};

export const updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(category);
};

export const deleteCategory = async (req, res) => {
  await Category.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ success: true });
};
