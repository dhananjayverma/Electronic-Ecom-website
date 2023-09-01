const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const OrderSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: ObjectId,
        ref: "Product",
      },
      count: Number,
      color: String,
    },
  ],
  paymentIntent: {},
  orderStatus: {
    type: String,
    default: "Not Processed",
    enum: [
      "Not Processed",
      "processing",
      "Dispatched",
      "Cancelled",
      "Completed",
      "Cash On Delivery"
    ],
  },
  orderedBy:{type:ObjectId,ref:"User"}
},{
    timestamps:true
});

module.exports = mongoose.model('Order',OrderSchema)
