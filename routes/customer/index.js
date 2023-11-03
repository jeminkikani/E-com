const express = require("express");
const cusRoutes = express.Router();

//customer34 Routes
const customerRoutes = require("./customer.Routes");
cusRoutes.use("/customer", customerRoutes);

module.exports = cusRoutes;
