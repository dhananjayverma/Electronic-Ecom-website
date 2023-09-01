const Category = require("../models/category");
const Product = require("../models/product");
const slugify = require("slugify");
const SubCategory = require("../models/subCategory");

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await new Category({ name, slug: slugify(name) }).save();
    res.json(category);
  } catch (err) {
    console.log(err);
    res.status(400).send("Create category failed");
  }
};
exports.list = async (req, res) =>
  res.json(await Category.find({}).sort({ createdAt: -1 }).exec());

exports.read = async (req, res) => {
  let category = await Category.findOne({ slug: req.params.slug }).exec();
  console.log("category---->",category)
  const products = await Product.find({ category }).exec()
  
    res.json({
      category,
      products
    })
};
exports.update = async (req, res) => {
  const { name } = req.body;
  try {
    const updated = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name) },
      { new: true } // {new : true} is to send the currently updated item in res.json() other wise it will send the old  one
    );
    res.json(updated);
  } catch (err) {
    res.status(400).send("category updation failed");
  }
};
exports.remove = async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({ slug: req.params.slug });
    res.json(deleted);
  } catch (err) {
    res.status(400).send("Failed to delete");
  }
};

exports.getSubCategory = async (req, res) => {
  try {
    const subCategoryData = await SubCategory.find({ parent: req.params._id });
    res.json(subCategoryData);
  } catch (err) {
    console.log(err);
    res.status(400).send("Failed to send subCategory");
  }
};

//handling promises without async await
// exports.getSubCategory = (req, res) => {
//     SubCategory.find({ parent: req.params._id }).exec((err,subs)=>{
//       if(err) console.log(err)
//       res.json(subs)
//     });
// };
