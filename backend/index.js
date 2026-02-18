const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const json = require("jsonwebtoken");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

app.use(cors());
app.use(express.json());

const app = express();
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});