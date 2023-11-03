const { validator } = require("./validation");
const Joi = require("joi");

module.exports.validationConstant = function (method) {
  const validateSchema = Joi.object({
    first_name: validator.FIRSTNAME,
    last_name: validator.LASTNAME,
    email: validator.EMAIL,
    password: validator.PASSWORD,
    confirm_Password: validator.CONFIRM_PASSWORD,
    // role: validator.ROLE,
  });

  switch (method) {
    case "register":
      return (req, res, next) => {
        const { error } = validateSchema.validate(req.body);
        if (error) {
          const errorMessage = error.details
            .map((err) => err.message.replace(/"/g, ""))
            .join(", ");
          return res.status(400).json({
            status: "fail",
            message: errorMessage,
          });
        }
        next();
      };

    case "login":
      return (req, res, next) => {
        const { error } = Joi.object({
          email: validator.EMAIL,
          password: validator.PASSWORD,
        }).validate(req.body);

        if (error) {
          const errorMessage = error.details
            .map((err) => err.message.replace(/"/g, ""))
            .join(", ");
          return res.status(400).json({
            status: "fail",
            message: errorMessage,
          });
        }
        next();
      };

    case "update":
      return (req, res, next) => {
        const validateSchemaUpdate = Joi.object({
          first_name: validator.FIRSTNAME,
          last_name: validator.LASTNAME,
          // role: validator.ROLE,
        });

        const { error } = validateSchemaUpdate.validate(req.body);
        if (error) {
          const errorMessage = error.details
            .map((err) => err.message.replace(/"/g, ""))
            .join(", ");
          return res.status(400).json({
            status: "fail",
            message: errorMessage,
          });
        }
        next();
      };

    default:
      throw new Error("Invalid validation method");
  }
};
