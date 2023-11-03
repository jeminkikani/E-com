const mongoose = require("mongoose");

const tokenSchemas = mongoose.Schema({
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
  },
  token: {
    type: String,
    require: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("SellerToken", tokenSchemas);
