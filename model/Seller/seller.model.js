const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sellerLoginSchemas = Schema({
  first_name: {
    type: String,
    require: true,
  },
  last_name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    enum: ["Seller"],
    default: "Seller",
  },
});

module.exports = mongoose.model("Seller", sellerLoginSchemas);
