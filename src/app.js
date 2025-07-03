const express = require("express");
const mongoose = require("mongoose");
const customerRoutes = require("./routes/customerRoutes");
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use(cors());

connectDB();

app.use("/api", authRoutes);
app.use("/api", customerRoutes);

app.listen(PORT, () => {
  console.log(`Customer service running on port ${PORT}`);
});
