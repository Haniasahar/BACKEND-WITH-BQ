import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

const registerUser = async (req, res) => {
  try {
    //get data from frontend
    //validations :empty files or email etc
    //check if user already exists
    //create a user and remove password field
    //generate a token with the help of jwt

    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing" });
    }

    const { userName, email, password, dob } = req.body;

    if (!userName || !email || !password || !dob) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existedUser = await User.findOne({
      $or: [{ email }, { userName }],
    });

    if (existedUser) {
      return res
        .status(400)
        .json({ message: "User with email or username already exists" });
    }

    const user = await User.create({
      userName: userName.toLowerCase(),
      email,
      password,
      dob,
    });

    const checkedUser = await User.findById(user._id).select("-password ");

    if (!checkedUser) {
      return res
        .status(401)
        .json({ message: "Something went wrong while registering the user" });
    }

    const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });

    if (!token) {
      return res.status(400).json({ message: "Token not found" });
    }

    res
      .status(201)
      .json({ token, checkedUser, message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

const loginUser = async (req, res) => {
  try {
    //get data from frontend
    //validations :empty files or email etc
    //check if user is new
    //compare hashed password and remove passowrd
    //generate a token with the help of jwt

    const { userName, email, password } = req.body;
    console.log(req.body);

    if (!userName || !email) {
      return res.status(401).json({ message: "Username or email is required" });
    }

    const user = await User.findOne({
      $or: [{ email }],
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials or email" });
    }

    const loggedInUser = await User.findById(user._id).select("-password");

    const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });

    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }

    return res
      .status(200)
      .json({ token, loggedInUser, message: "User logged in successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    console.table(users.map(user => ({
      ID: user._id,
      Username: user.userName,
      Email: user.email,
      Joined: user.createdAt.toISOString().split('T')[0]
    })));

    res.status(200).json({ users, message: "All users fetched" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export { registerUser, loginUser, getAllUsers };