const express = require("express");
const Routes = express.Router();

//Admin Routes
const AdminRoutes = require("./seller.Routes");
Routes.use("/seller", AdminRoutes);

module.exports = Routes;
