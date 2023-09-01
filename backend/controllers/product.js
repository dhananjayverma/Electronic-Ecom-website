const Product = require("../models/product");
const User = require("../models/user");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    console.log(req.body);
    req.body.slug = slugify(req.body.title);
    const newProduct = await new Product(req.body).save();
    res.json(newProduct);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      err: err.message,
    });
  }
};

exports.listAll = async (req, res) => {
  let products = await Product.find({})
    .limit(parseInt(req.params.count))
    // .populate('category')
    // .populate('subCategory')
    .sort([["createdAt", "desc"]])
    .exec();

  res.json(products);
};
exports.remove = async (req, res) => {
  try {
    const deleted = await Product.findOneAndRemove({
      slug: req.params.slug,
    }).exec();
    res.json(deleted);
  } catch (err) {
    console.log(err);
    res.status(400).send("Product deletion failed");
  }
};

exports.read = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate("category")
    .populate("subCategory")
    .exec();
  res.json(product);
};

exports.update = async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updated = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    ).exec();
    res.json(updated);
  } catch (err) {
    console.log("PRODUCT UPDATE ERROR---->", err);
    return res.status(400).json({
      err: err.message,
    });
  }
};

//without pagination
// exports.list = async (req, res) => {
//   try {
//     //sort-->createdAt/updatedAt, order-->asc,desc
//     const { sort, order, limit } = req.body;
//     const products = await Product.find({})
//       .populate("category")
//       .populate("subCategory")
//       .sort([[sort, order]])
//       .limit(limit)
//       .exec();
//     res.json(products);
//   } catch (err) {
//     console.log(err);
//   }
// };

//with pagination
exports.list = async (req, res) => {
  try {
    //sort-->createdAt/updatedAt, order-->asc,desc
    const { sort, order, page } = req.body;
    const currentPage = page || 1;
    const perPageProducts = 3;

    const products = await Product.find({})
      .skip((currentPage - 1) * perPageProducts)
      .populate("category")
      .populate("subCategory")
      .sort([[sort, order]])
      .limit(perPageProducts)
      .exec();
    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

exports.productsCount = async (req, res) => {
  let total = await Product.find({}).estimatedDocumentCount().exec();
  res.json(total);
};

exports.productStar = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();
  const user = await User.findOne({ email: req.user.email }).exec();
  const { star } = req.body;

  //who is updating
  //check if currently logged in user have already added rating to this product
  let existingRatingObject = product.ratings.find((ele) => {
    return ele.postedBy.toString() == user._id.toString();
  });

  //if user have not left rating yet, push it
  if (existingRatingObject === undefined) {
    let ratingAdded = await Product.findByIdAndUpdate(
      product._id,
      {
        $push: { ratings: { star: star, postedBy: user._id } },
      },
      { new: true }
    ).exec();
    res.json(ratingAdded);
  } else {
    //if user have already left rating , update it
    if (existingRatingObject) {
      existingRatingObject.star = star;
      const updatedRating = await product.save();
      res.json(updatedRating);
    }
  }
};

exports.listRelated = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();
  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(3)
    .populate("category")
    .populate("subCategory")
    .populate("ratings.postedBy")
    .exec();

  res.json(related);
};

//search   and  filters

const handlequery = async (req, res, query) => {
  const products = await Product.find({ $text: { $search: query } })
    .populate("category", "_id name slug")
    .populate("subCategory", "_id name slug")
    // .populate('postedBy','_id')
    .exec();

  res.json(products);
};
const handlePrice = async (req, res, price) => {
  try {
    const products = await Product.find({
      price: { $gte: price[0], $lte: price[1] }
    })
      .populate("category", "_id name slug")
      .populate("subCategory", "_id name slug")
      .exec();

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

const handleCategory = async (req,res,category) => {
  console.log(category,"<---------category")
   try{
     let products = await Product.find({category})
     .populate("category")
     .populate("subCategory")
     .exec();

     res.json(products)

   }catch(err){
     console.log(err)
   }
}

const handleStar = async (req,res,stars) => {
  //product aggregate method basically creates a project inside our Product Model
  //it helps us in creating the avg of everu unique rating and gives the associate products related to it
    Product.aggregate([
      {
        $project:{
          document:'$$ROOT',
          floorAverage:{
            $floor:{$avg:"$ratings.star"},
          },
        },
      },
      {$match:{floorAverage:stars}}
    ])
    .limit(12)
    .exec((err,aggreagates)=>{
      if(err) console.log("aggregate error",err)
      Product.find({_id:aggreagates})
      .populate("category")
      .populate("subCategory")
      .exec((err,products)=>{
        if(err) console.log("Product aggregate error",err)
        res.json(products)
      });
    })
}

const handleSubCategory = async (req,res,subCategory) => {
    const products =await Product.find({subCategory})
    .populate("category")
    .populate("subCategory")
    .exec();
    res.json(products)
}

const handleShipping = async (req,res,shipping) => {
    const products = await Product.find({shipping})
    .populate("category")
    .populate("subCategory")
    .exec();
    res.json(products)
}
const handleColor = async (req,res,color) => {
  const products = await Product.find({color})
  .populate("category")
  .populate("subCategory")
  .exec();
  res.json(products)
}
const handleBrand = async (req,res,brand) => {
  const products = await Product.find({brand})
  .populate("category")
  .populate("subCategory")
  .exec();
  res.json(products)
}

exports.searchFilters = async (req, res) => {
  const { query, price , category ,stars,subCategory,shipping,color,brand } = req.body;
  if (query) {
    console.log("query", query);
    await handlequery(req, res, query);
  }

  //price will recieve as an array from frontend price=[200,45000]

  if (price != undefined) {
    await handlePrice(req, res, price);
  }
  if(category){
    await handleCategory(req,res,category)
  }
  if(stars){
    await handleStar(req,res,stars)
  }
  if(subCategory){
    await handleSubCategory(req,res,subCategory)
  }
  if(shipping){
    await handleShipping(req,res,shipping)
  }
  if(color){
    await handleColor(req,res,color)
  }
  if(brand){
    await handleBrand(req,res,brand)
  }
};
