const express = require("express");
const router = express.Router();

//importing middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

//importing controllers
const {
  create,
  remove,
  list,
} = require("../controllers/coupon");

//routes
router.post("/coupon", authCheck, adminCheck, create);
router.get("/coupons", list);
// router.get("/subCategory/:slug", read);
// router.put("/subCategory/:slug", authCheck, adminCheck, update);
router.delete("/coupon/:couponId", authCheck, adminCheck, remove);

module.exports = router;
