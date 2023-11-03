require("dotenv").config();
const Customer = require("../../model/customer/customer.model");
const CustomerToken = require("../../model/customer/customer.token");
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

  jwt.verify(token, secret, async (error, CustomerId) => {
    try {
      const tokenData = await CustomerToken.findOne({ token, isActive: true });
      console.log(tokenData);
      if (!tokenData && error) {
        return res.status(404).json({
          status: "Fail",
          message: "CustomerToken is expired",
        });
      }

      // Fetch additional Admin data including role
      const customer = await Customer.findById(CustomerId.id);

      if (!customer) {
        return res.status(404).json({
          status: "Fail",
          message: "Customer not found",
        });
      }

      const { role } = customer; // Assuming Admin has role and other properties

      req.Customer = {
        ...CustomerId,
        role,
      };

      if (req.Customer.role !== actionRole) {
        return res.status(403).json({
          status: "Fail",
          message: "they Route Is Only Use For Customer",
        });
      }
      next();
    } catch (error) {
      return res.status(403).json({
        status: "Fail",
        message: "CustomerToken is Invalid",
      });
    }
  });
};

module.exports = { IsVerify };
