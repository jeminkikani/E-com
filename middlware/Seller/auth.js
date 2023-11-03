require("dotenv").config();
const Admin = require("../../model/Seller/seller.model");
const Token = require("../../model/Seller/seller.token");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;

const IsVerify = (actionRole) => async (req, res, next) => {
  const auth = req.headers["authorization"];
  if (!auth) {
    return res.status(402).json({
      status: "Fail",
      message: "token is not provide",
    });
  }
  const token = auth.split(" ")[1];

  jwt.verify(token, secret, async (error, SellerId) => {
    try {
      const tokenData = await Token.findOne({ token, isActive: true });
      if (!tokenData && error) {
        return res.status(403).json({
          status: "Fail",
          message: "Token is expired",
        });
      }

      // Fetch additional Admin data including role
      const admin = await Admin.findById(SellerId.id);
      if (!admin) {
        return res.status(404).json({
          status: "Fail",
          message: "Seller not found",
        });
      }

      const { role } = admin; // Assuming Admin has role and other properties

      req.Seller = {
        ...SellerId,
        role,
      };

      if (req.Seller.role !== actionRole) {
        return res.status(403).json({
          status: "Fail",
          message: "they Route Is Only Use For Seller",
        });
      }
      next();
    } catch (error) {
      return res.status(403).json({
        status: "Fail",
        message: "Token is Invalid",
      });
    }
  });
};

module.exports = { IsVerify };
