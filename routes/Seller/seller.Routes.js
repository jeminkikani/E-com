const express = require("express");
const AdminRoutes = express.Router();
const {
  sellerRegister,
  sellerLogin,
  sellerList,
  sellerInfo,
  sellerUpdate,
  sellerDelete,
} = require("../../controller/Seller/seller.controller");
const { IsVerify } = require("../../middlware/Seller/auth");
const { validationConstant } = require("../../constant/validate.constant");

// Admin Register
AdminRoutes.post("/register", validationConstant("register"), sellerRegister);

// Admin Login
AdminRoutes.post("/login", IsVerify("Seller"), sellerLogin);

// Admin List
AdminRoutes.get("/list", sellerList);

// admin Info
AdminRoutes.get("/info", IsVerify("Seller"), sellerInfo);

// seller Update
AdminRoutes.put("/update", IsVerify("Seller"), validationConstant("update"), sellerUpdate);

// seller Delete
AdminRoutes.delete("/delete", IsVerify("Seller"), sellerDelete);

module.exports = AdminRoutes;
