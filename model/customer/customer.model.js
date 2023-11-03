const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerLoginSchemas = Schema({
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
    enum: ["Customer"],
    default: "Customer",
  },
});

module.exports = mongoose.model("Customer", customerLoginSchemas);
