require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/mongodb");
const morgan = require("morgan");
const port = process.env.PORT;

// ApplicationBased Middleware
app.use(express.json());
app.use(morgan("dev"));

//Project Routes
const Routes = require("./routes/Seller/index");
app.use("/api", Routes);

//Project customer Routes
const cusRoutes = require("./routes/customer/index");
app.use("/api", cusRoutes);



//mongoDB Connection
connectDB();

//server
app.listen(port, () => console.log(`E-commerce app listening on port ${port}`));
