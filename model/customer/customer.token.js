const mongoose = require("mongoose");

const tokenSchemas = mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
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

module.exports = mongoose.model("CustomerToken", tokenSchemas);
