const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Degree = require("../models/degreeModel");
const mongoose = require("mongoose");

// @desc Register new User
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, password, degree } = req.body;

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

  // Check if degree exists and store degree objectId
  const degreeExists = await Degree.findOne({ name: degree });
  if (!degreeExists) {
    res.status(400);
    throw new Error("Degree not found");
  } else {
    var degreeId = degreeExists._id;
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
    degree: degreeId,
    majors: [],
    minors: [],
    courses: [],
    currentyear: null,
    currentsemester: null,
    graduated: false,
    gpa: null,
  });

  // Check user created without issue
  if (user) {
    res.status(201).json({
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
// @route POST /api/users/login
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
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

// @desc  Get User Data
// @route GET /api/users/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
  const { _id, firstname, lastname, email, degree } = await User.findById(
    req.user.id
  );

  res.status(200).json({
    id: _id,
    firstname,
    lastname,
    email,
    degree,
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    users,
  });
});

// @desc  update User Data
// @route PUT /api/users/
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

const getCourses = async (id) => {
  const user = await User.findById(id);
  return user.courses;
};


 //@description pulling all requirements of a user then checking requirement match 
 //@param id   user id for finding user's courses
 // notMatchCourses array for collecting courses dont match requirements
 // requirements array for all major and minor courses
 const checkUserRequirements = async (id) => {
  const user = await User.findById(id);
  const userCourses = user.courses;
  const userMajor = user.majors;
  const userMinor = user.minors;
  const userDegree = user.degree;
  const majorReqCourses = [];
  const minorReqCourses = [];
  const degreeRequire = [];
  const requireCourses = [];
  const notMatchCourses = [];
  //Confirm the user's Major and find the course required by the corresponding Major Req Courses
  if (userMajor == "Computer Science" ){
    majorReqCourses = majors.requirements.find(courses);
  } else if (userMajor == "English"){
    majorReqCourses = majors.requirements.find(courses);
  } else {
    throw new Error("No such major exists in the database.");
  }
  //Confirm the user's Minor and find the course required by the corresponding Minor Req Courses
  if (userMinor == "Mathematics" ){
    minorReqCourses = minors.requirements.find(courses);
  } else if (userMinor == "Political Science"){
    minorReqCourses = minors.requirements.find(courses);
  } else {
    throw new Error("No such minor exists in the database.");
  }
  //Confirm the user's Degree id and find the course required by the corresponding Degree Req Courses
  if (userDegree == "632ce70d7f9a8c15c65aea56" ){
    degreeRequire = degree.requirements.find(courses);
  } else if (userDegree == "632ce71d7f9a8c15c65aea59"){
    degreeRequire = degree.requirements.find(courses);
  } else {
    throw new Error("No such degree exists in the database.");
  }
  //Combine the corresponding courses found
  requireCourses = majorReqCourses.concat(minorReqCourses)
  requireCourses = requireCourses.concat(degreeRequire)
  
  for(let i = 0; i < requireCourses.length; i++){
    if( !requireCourses.includes(userCourses[i]) ){
      throw new Error("Course " + userCourses[i] + " don't match user's degree requirement");
      notMatchCourses.push(userCourses[i]);
    } else{
      return true;
    }
  }
 };


module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateUser,
  getAllUsers,
};
