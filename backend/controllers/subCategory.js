const SubCategory = require("../models/subCategory");
const Product = require("../models/product");
const slugify = require("slugify");



exports.create = async (req, res) => {
  try {
    const { name, parent } = req.body;
    const subcategory = await new SubCategory({
      name,
      slug: slugify(name),
      parent,
    }).save();
    res.json(subcategory);
  } catch (err) {
    console.log(err);
    res.status(400).send("Create sub-category failed");
  }
};

exports.list = async (req, res) =>
  res.json(await SubCategory.find({}).sort({ createdAt: -1 }).exec());

exports.read = async (req, res) => {
  const subCategory = await SubCategory.findOne({
    slug: req.params.slug,
  }).populate('parent').exec();
  const products = await Product.find({subCategory})
  .populate('category')
  .populate('subCategory')
  .exec();
  res.json({
    subCategory,
    products,
  });
};

exports.update = async (req, res) => {
  const { name, parent } = req.body;
  try {
    const updated = await SubCategory.findOneAndUpdate(
      { slug: req.params.slug },
      { name, parent, slug: slugify(name) },
      { new: true } // {new : true} is to send the currently updated item in res.json() other wise it will send the old  one
    );
    res.json(updated);
  } catch (err) {
    res.status(400).send("sub-category updation failed");
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await SubCategory.findOneAndDelete({
      slug: req.params.slug,
    });
    res.json(deleted);
  } catch (err) {
    res.status(400).send("Failed to delete");
  }
};
