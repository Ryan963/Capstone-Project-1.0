const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// @desc Register new User
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const {firstname, lastname, email, password, degree} = req.body;

    if (!firstname || !lastname || !email || !password) {
        res.status(400);
        throw new Error("Please add all fields");
    };

    // Check if user email exists
    const userExists = await User.findOne({email});
    if(userExists) {
        res.status(400);
        throw new Error("Email already in use");
    };

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Register User
    const user = await User.create({
        firstname,
        lastname,
        email,
        password: hashedPassword,
        degree: null,
        majors: [],
        minors: [],
        courses: [],
        currentyear: null,
        currentsemester: null,
        graduated: false,
        gpa: null
    });

    // Check user created without issue
    if (user) {
        res.status(201).json({
            _id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    };
});

// @desc  Login User
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
    const{email, password} = req.body;

    // Check user email exists and evaluate password
    const user = await User.findOne({email});
    if(user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            degree: user.degree,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error("Invalid credentials");
    };
});

// @desc  Get User Data
// @route GET /api/users/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
    const {_id, firstname, lastname, email} = await User.findById(req.user.id);

    res.status(200).json({
        id: _id,
        firstname,
        lastname,
        email
    });
});

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_USER_SECRET, {
        expiresIn: "6h"
    });
};

module.exports = {
    registerUser, loginUser, getMe
};