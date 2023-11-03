const Customer = require('../../model/customer/customer.model');
const Token = require("../../model/customer/customer.token");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Customer Register
exports.customerRegister = async (req, res) => {
  try {
    const { first_name, last_name, email, password, confirm_Password, role } =
      req.body;

    if (password === confirm_Password) {
      const checkCustomer = await Customer.findOne({ email });
      if (checkCustomer) {
        return res
          .status(404)
          .json({ status: "Fail", message: "Customer is already exist" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const newCustomer = await Customer.create({
        first_name,
        last_name,
        email,
        password: hashPassword,
        role,
      });

      const payload = {
        id: newCustomer._id,
        first_name: newCustomer.first_name,
        last_name: newCustomer.last_name,
        email: newCustomer.email,
        password: newCustomer.password,
        role: newCustomer.role,
      };

      const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "20d",
      });

      const newToken = new Token({
        customer_id: newCustomer._id,
        token,
      });

      await newToken.save();

      await newCustomer.save();

      res.status(201).json({
        status: "success",
        message: "customer Profile created successfully",
        data: newCustomer,
        token: token,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Fail",
      message: "something went wrong please try again",
      data: error,
    });
  }
};

// Customer Login
exports.customerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const checkCustomer = await Customer.findOne({ email });
    if (!checkCustomer) {
      return res
        .status(404)
        .json({ status: "Fail", message: "Required For SignUp" });
    }

    const isMatch = await bcrypt.compare(password, checkCustomer.password);
    if (!isMatch) {
      return res
        .status(404)
        .json({ status: "Fail", message: "Seller password is incorrect" });
    }

    const existingToken = await Token.findOneAndUpdate(
      { customer_id: checkCustomer._id, isActive: true },
      { $set: { isActive: false } }
    );

    if (!existingToken) {
      return res.status(403).json({
        status: "Fail",
        message: "Seller Is Login",
      });
    }

    const payload = {
      id: checkCustomer._id,
      first_name: checkCustomer.first_name,
      last_name: checkCustomer.last_name,
      email: checkCustomer.email,
      password: checkCustomer.password,
      role: checkCustomer.role,
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "20d",
    });

    const newToken = new Token({
      customer_id: checkCustomer._id,
      token,
    });

    await newToken.save();

    res.status(201).json({
      status: "success",
      message: "Seller Is Login",
      data: newToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Fail",
      message: "something went wrong please try again",
      data: error,
    });
  }
};

// Customer List
exports.customerList = async (req, res) => {
  try {
    const customers = await Customer.find().select("-password");
    res.status(200).json({
      status: "success",
      message: "customers All Fetch Successfully",
      data: customers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Fail",
      message: "something went wrong please try again",
      data: error,
    });
  }
};

// Customer Info
exports.customerInfo = async (req, res) => {
  try {
    const checkSeller = await Customer.findById(req.Customer.id).select(
      "-password"
    );
    if (!checkSeller) {
      return res.status(404).json({
        status: "Fail",
        message: "Customer is Not Found",
      });
    }
    res.status(201).json({
      status: "success",
      message: "Customer Fetch Successfully",
      data: checkSeller,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Fail",
      message: "something went wrong please try again",
      data: error,
    });
  }
};

// Customer Update
exports.customerUpdate = async (req, res) => {
  try {
    const checkCustomer = await Customer.findById(req.Customer.id);

    if (!checkCustomer) {
      return res.status(404).json({
        status: "Fail",
        message: "Customer is not Found",
      });
    }

    const updateCustomer = await Customer
      .findByIdAndUpdate(checkCustomer._id, { $set: { ...req.body } }, { new: true })
      .select("-password");

    // updateCustomer.save();

    res.status(200).json({
      status: "Success",
      message: "update Customer successfully",
      data: updateCustomer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Fail",
      message: "something went wrong please try again",
      data: error,
    });
  }
};

// Seller Delete
exports.customerDelete = async (req, res) => {
  try {
    const CustomerId = req.Customer.id;
    if (!CustomerId) {
      return res.status(404).json({
        status: "Fail",
        message: "customer is Not Found",
      });
    }
    const checkSeller = await Customer.findByIdAndDelete(CustomerId);
    res.status(201).json({
      status: "success",
      message: "Delete Customer Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Fail",
      message: "something went wrong please try again",
      data: error,
    });
  }
};

// Customer Logout
exports.customerLogout = async (req, res) => {
  try {

    const customer_id = req.Customer.id; 

    // Find and deactivate the customer's active token
    const result = await Token.findOneAndUpdate(
      { customer_id, isActive: true },
      { $set: { isActive: false } }
    );

    if (!result) {
      return res.status(404).json({
        status: "Fail",
        message: "No active token found for this customer",
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Customer has been logged out successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Fail",
      message: "Something went wrong. Please try again.",
      data: error,
    });
  }
};
