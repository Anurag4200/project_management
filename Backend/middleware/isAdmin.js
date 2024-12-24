const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

module.exports.isAdmin = async (req, res, next) => {
  try {
    // Check if authorization header is provided
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    // Verify the token and decode the user info
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.userId);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied: Admins only" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ msg: "Unauthorized" });
  }
};
