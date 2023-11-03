const express = require("express");
const customerRoutes = express.Router();
const {
  customerRegister,
  customerLogin,
  customerList,
  customerInfo,
  customerUpdate,
  customerDelete,
  customerLogout,
} = require("../../controller/customer/customer.controller");
const { IsVerify } = require("../../middlware/Customer/auth");
const { validationConstant } = require("../../constant/validate.constant");

// customer Register
customerRoutes.post("/register", validationConstant("register"), customerRegister);

// customer Login
customerRoutes.post("/login", customerLogin);

// customer List
customerRoutes.get("/list", customerList);

// customer Info
customerRoutes.get("/info", IsVerify("Customer"), customerInfo);

// customer Update
customerRoutes.put("/update", IsVerify("Customer"), validationConstant("update"),customerUpdate);

// customer Delete
customerRoutes.delete("/delete", IsVerify("Customer"), customerDelete);

// customerLogout
customerRoutes.post("/logout", IsVerify("Customer"), customerLogout);

module.exports = customerRoutes;
