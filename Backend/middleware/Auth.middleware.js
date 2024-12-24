const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.user || req.headers.authorization?.split(" ")[1];
    console.log(token)
    if (!token) {
      return res.status(401).json({ msg: "unauthorized" });
    }
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userModel.findById(decode._id);
      req.user = user;
      return next();
    } catch (error) {
      res.status(401).json({ msg: "Unauthorized" });
    }
  };