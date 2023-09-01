const express = require("express");
const router = express.Router();

//importing middlewares
const {authCheck, adminCheck} = require('../middlewares/auth')

//importing controllers
const {create,read,update,remove,list,getSubCategory} = require("../controllers/category");

//routes
router.post('/category',authCheck,adminCheck,create)
router.get('/categories',list)
router.get('/category/:slug',read)
router.put('/category/:slug',authCheck,adminCheck,update)
router.delete('/category/:slug',authCheck,adminCheck,remove)

//for getting all subcategories at product creating stage on basis of categories
router.get('/category/subCategory/:_id',getSubCategory)

module.exports = router;
