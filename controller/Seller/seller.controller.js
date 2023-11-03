const Seller = require("../../model/Seller/seller.model");
const Token = require("../../model/Seller/seller.token");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Seller Register
exports.sellerRegister = async (req, res) => {
  try {
    const { first_name, last_name, email, password, confirm_Password, role } =
      req.body;

    if (password === confirm_Password) {
      const checkSeller = await Seller.findOne({ email });
      if (checkSeller) {
        return res
          .status(404)
          .json({ status: "Fail", message: "Seller is already exist" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const newSeller = await Seller.create({
        first_name,
        last_name,
        email,
        password: hashPassword,
        role,
      });

      const payload = {
        id: newSeller._id,
        first_name: newSeller.first_name,
        last_name: newSeller.last_name,
        email: newSeller.email,
        password: newSeller.password,
        role: newSeller.role,
      };

      const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "20d",
      });

      const newToken = new Token({
        admin_id: newSeller._id,
        token,
      });

      await newToken.save();

      await newSeller.save();

      res.status(201).json({
        status: "success",
        message: "Seller Profile created successfully",
        data: newSeller,
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

// Seller Login
exports.sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const checkSeller = await Seller.findOne({ email });
    if (!checkSeller) {
      return res
        .status(404)
        .json({ status: "Fail", message: "Required For SignUp" });
    }

    const isMatch = await bcrypt.compare(password, checkSeller.password);
    if (!isMatch) {
      return res
        .status(404)
        .json({ status: "Fail", message: "Seller password is incorrect" });
    }

    const existingToken = await Token.findOneAndUpdate(
      { seller_id: checkSeller._id, isActive: true },
      { $set: { isActive: false } }
    );

    if (!existingToken) {
      return res.status(403).json({
        status: "Fail",
        message: "Seller Is Login",
      });
    }

    const payload = {
      id: checkSeller._id,
      first_name: checkSeller.first_name,
      last_name: checkSeller.last_name,
      email: checkSeller.email,
      password: checkSeller.password,
      role: checkSeller.role,
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "20d",
    });

    const newToken = new Token({
      seller_id: checkSeller._id,
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

// Seller List
exports.sellerList = async (req, res) => {
  try {
    const sellers = await Seller.find().select("-password");
    res.status(201).json({
      status: "success",
      message: "Sellers All Fetch Successfully",
      data: sellers,
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

// Seller Info
exports.sellerInfo = async (req, res) => {
  try {
    const checkSeller = await Seller.findById(req.Seller.id).select("-password");
    if(!checkSeller){
      return res.status(404).json({
        status: "Fail", message: "Seller is Not Found"
      })
    }
    res.status(201).json({
      status: "success",
      message: "Seller Fetch Successfully",
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

// Seller Update
exports.sellerUpdate = async (req, res) => {
  try {
    const checkSeller = await Seller.findById(req.Seller.id);

    if (!checkSeller) {
      return res.status(404).json({
        status: "Fail",
        message: "Seller is not Found",
      });
    }
    
    const updateSeller = await Seller.findByIdAndUpdate(
      checkSeller._id,
      { $set: { ...req.body } },
      { new: true }
    ).select("-password");
    
    updateSeller.save();

    res.status(200).json({
      status: "Success",
      message: "update Seller successfully",
      data: updateSeller,
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
exports.sellerDelete = async (req, res) => {
  try {
    const SellerId = req.Seller.id;
    if(!SellerId){
      return res.status(404).json({
        status: "Fail",
        message: "Seller is Not Found",
      });
    }
    const checkSeller = await Seller.findByIdAndDelete(SellerId);
    res.status(201).json({
      status: "success",
      message: "Delete Seller Successfully",
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
