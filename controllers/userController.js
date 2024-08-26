const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");




//user register,by default the user role is "user" if the is specifie "admin" by the admin
// it will update according to that.

const registerUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await newUser.save();

    req.io.emit('userRegistered', {
      message: "A new user has been registered",
      user: {
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
      }
    });

    return res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    console.log("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



//here is the login wih jwt token with expiration time around 1 hr

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isPasswrodMatch = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswrodMatch) {
      res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: existingUser._id, role: existingUser.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1hr" }
    );
    if(existingUser.role==="user"){
      return res.status(200).json({ message: "Login successfull", token });
    }
    if(existingUser.role==="admin"){
      return res.status(200).json({ message: "Login successfull", token });
    }
    
  } catch (error) {
    console.log("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
