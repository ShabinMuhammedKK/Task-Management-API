const jwt = require("jsonwebtoken");
const User = require("../models/userModel");




//this authentication middleware for verifying the user is authenticated or longen in or not

const authenticte = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findOne({ _id: tokenDecoded.id });
    if (!user) {
      return res.status(401).json({ message: "Please authenticate" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Authentication error".error);
    return res.status(401).json({ message: "Please authenticate" });
  }
};



//this for protected routes ,that admin have only access

const authorize = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Access denied,Admin can only access" });
    }
    next();
  };
};

module.exports = { authenticte, authorize };
