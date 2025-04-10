import express from "express";
import userModel from "../Models/usermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authtoken from "../MiddleWare/auth.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ status: "error", message: "Missing required fields" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Prepare user data
    const userData = {
      name: name,
      email: email,
      password: hashedPassword,
    };

    // Save user to database
    const newUser = new userModel(userData);
    const user = await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);

    res.json({
      status: "success",
      message: "User registered successfully",
      token,
      user: { name: user.name },
    });
  } catch (error) {
    console.error(error);
    res.json({ status: "error", message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.json({ status: "error", message: "User not found" });
    }

    // Compare passwords
    const IsMatch = await bcrypt.compare(password, user.password);
    if (IsMatch) {
      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);

      res.json({
        status: "success",
        message: "Login successfully",
        token,
        user: { name: user.name },
      });
    } else {
      return res.json({ status: "error", message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.json({ status: "error", message: error.message });
  }
};

const userCrenditals = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    res.json({
      status: "success",
      message: user.CreditBalance,
      user: { name: user.name },
    });
  } catch (error) {
    console.error(error);
    res.json({ status: "error", message: error.message });
  }
};

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/credit", authtoken, userCrenditals);
export default router;
