const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Degree = require("../models/degreeModel");
const mongoose = require("mongoose");

// @desc Register new User
// @route POST /api/user
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    password,
    degree,
    currentyear,
    currentsemester,
    graduated,
    gpa,
    majors,
    minors,
    courses,
    futureCourses,
  } = req.body;

  if (!firstname || !lastname || !email || !password || !degree) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // Check if user email exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Email already in use");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Register User
  const user = await User.create({
    firstname,
    lastname,
    email,
    password: hashedPassword,
    degree: degree,
    majors: majors,
    minors: minors,
    courses: courses,
    futureCourses: [],
    currentyear: Number.parseInt(currentyear),
    currentsemester: Number.parseInt(currentsemester),
    graduated: graduated,
    gpa: Number.parseFloat(gpa),
  });

  // Check user created without issue
  if (user) {
    res.status(201).json({
      success: true,
      _id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      degree: user.degree,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc  Login User
// @route POST /api/user/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check user email exists and evaluate password
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      degree: user.degree,
      success: true,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

// @desc  Get User Data
// @route GET /api/user/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.query.email });

  if (!user) {
    res.status(400).json({ message: "User does not exist" });
  }

  res.status(200).json({
    user,
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    users,
  });
});

// @desc  update User Data
// @route PUT /api/user/
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(updatedUser);
});

// @desc Delete user
// @route DELETE /api/user/
// @access private
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(401);
    throw new Error("Major not found");
  }

  await user.remove();
  res.status(200).json({ success: true, id: req.params.id });
};


// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_USER_SECRET, {
    expiresIn: "6h",
  });
};

/**
 * @description add courses to a user (User.courses field)
 * @param {array} newCourses array of courses to add
 * @param  id id of user to add courses to
 */
const addCourses = async (id, newCourses) => {
  const user = await User.findById(id);
  const courses = user.courses;

  // check if user has already completed any of the new courses
  // return false if any overlap detected
  if (newCourses.some((r) => courses.includes(r))) {
    return false;
  }
  const updatedCourses = [...courses, ...newCourses];
  const update = { courses: updatedCourses };
  await User.findByIdAndUpdate(id, update);
  return;
};

/**
 * @description remove courses from a user (User.courses field)
 * @param {array} coursesToRemove array of courses to be deleted
 * @param  id id of user to add courses to
 */
const removeCourses = async (id, coursesToRemove) => {
  const user = await User.findById(id);
  const courses = user.courses;
  const updatedCourses = courses.filter((el) => !coursesToRemove.includes(el));
  const update = { courses: updatedCourses };
  await User.findByIdAndUpdate(id, update);
  return;
};
// @desc  Get Courses
// @route GET /api/user/courses
// @access Private
const getCourses = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email });

  console.log(user);
  res.status(200).json({
    _id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    degree: user.degree,
    courses: user.courses,
  });
});

const getFutureCourses = asyncHandler(async (req, res) => {
  const { futureCourses } = await User.findById(req.user.id);
  res.status(200).json({
    futureCourses,
  });
});

// @desc  add future courses to User
// @route PUT /api/user/futureCourses
// @access Private
const addFutureCourses = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const futureCourses = req.body.futureCourses;

    // check if value entered
    if (!futureCourses) {
      res.status(400);
      throw new Error("Please enter value");
    }

    //* do checks on front end?
    if (
      futureCourses.filter((c) => user.futureCourses.includes(c)).length > 0
    ) {
      res.status(400);
      throw new Error("selected course(s) already saved");
    }

    for (let course of futureCourses) {
      user.futureCourses.push(course);
    }
    user.save();
    res.status(200).json({ success: true, futureCourses: user.futureCourses });
  } catch (error) {
    console.log(error);
    res.status(200).json({ success: false, message: error.message });
  }
});

// @desc  remove User's future courses
// @route DELETE /api/user/futureCourses
// @access Private
const removeFutureCourses = asyncHandler(async (req, res) => {
  try {
    const coursesToRemove = req.body.coursesToRemove;
    const user = await User.findById(req.body.id);

    console.log(req.body);
    if (!user) {
      throw new Error("Could not find user ");
    }
    user.futureCourses = user.futureCourses.filter(
      (course) => !coursesToRemove.includes(course)
    );

    user.save();
    res.status(200).json({ success: true, futureCourses: user.futureCourses });
  } catch (error) {
    console.log(error);
    res.status(200).json({ success: false, message: error.message });
  }
});

const completeCourse = async (req, res) => {
  try {
    const course = req.body.course;
    if (!course) {
      throw new Error("Course is not found");
    }
    const user = await User.findById(req.body.id);

    if (!user) {
      throw new Error("Could not find user ");
    }
    user.futureCourses = user.futureCourses.filter((c) => c !== course);

    user.courses.push(course);
    user.save();
    res.status(200).json({ success: true, futureCourses: user.futureCourses });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateUser,
  deleteUser,
  getAllUsers,
  getCourses,
  getFutureCourses,
  addFutureCourses,
  removeFutureCourses,
  completeCourse,
};
