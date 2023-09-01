const User = require("../models/user");
const Cart = require("../models/cart");
const Product = require("../models/product");
const Coupon = require("../models/coupon");
const stripe = require("stripe")("sk_test_51Ke17ESBjLRlvMAklkiApoRnYfcIC6BweE9KZZU5hdYchLOM3r2qucwpoSwfjIKivKVSJLtdW7kxTJo5LLn3RP3P00cUDvrLJU");

exports.createPaymentIntent = async (req, res) => {
  const { couponApplied } = req.body;

  //1. find user
  const user = await User.find({ email: req.user.email }).exec();

  //2. get user cart total
  const { cartTotal, totalAfterDiscount } = await Cart.findOne({
    orderedBy: user[0]._id,
  }).exec();
  
  // console.log("totalAfterDiscount:", cartTotal, totalAfterDiscount);

  let finalAmount = 0;
  if (couponApplied && totalAfterDiscount) {
    finalAmount = totalAfterDiscount * 100;
  } else {
    finalAmount = cartTotal * 100;
  }

  //   3. create payment intent with order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: finalAmount,
    currency: "INR",
  });

  console.log("payementIntent----------->", paymentIntent);

  res.send({
    clientSecret: paymentIntent.client_secret,
    cartTotal,
    totalAfterDiscount,
    payable: finalAmount,
  });
};
