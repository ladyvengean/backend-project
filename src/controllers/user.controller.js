


import { asyncHandler } from "../utils/asyncHandler.js";
import { Apierror } from "../utils/Apierror.js";
import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// **REGISTER USER**
const registerUser = asyncHandler(async (req, res) => {
    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
        throw new Apierror(400, "All fields are required");
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
        throw new Apierror(409, "User with this phone number already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        name,
        phone,
        password: hashedPassword,
        todos: [],
    });

    return res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
            _id: newUser._id,
            name: newUser.name,
            phone: newUser.phone,
        },
    });
});

// **LOGIN USER**
const loginUser = asyncHandler(async (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        throw new Apierror(400, "Phone number and password are required");
    }

    const user = await User.findOne({ phone }).select("+password");
    if (!user) {
        throw new Apierror(401, "Invalid phone number or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Apierror(401, "Invalid phone number or password");
    }

    const token = generateToken(user._id);
    return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
            _id: user._id,
            name: user.name,
            phone: user.phone,
        },
    });
});

// **GET CURRENT USER**
const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.userId);
    if (!user) {
        throw new Apierror(404, "User not found");
    }

    return res.status(200).json({
        success: true,
        user: {
            _id: user._id,
            name: user.name,
            phone: user.phone,
            todos: user.todos,
        },
    });
});

// **LOGOUT USER**
const logoutUser = asyncHandler(async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "User logged out successfully",
    });
});

export { registerUser, loginUser, getCurrentUser, logoutUser };
