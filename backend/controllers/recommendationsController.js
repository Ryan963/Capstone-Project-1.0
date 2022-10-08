const asyncHandler = require('express-async-handler');
const Course = require("../models/courseModel");
const User = require("../models/userModel");
const Major = require("../models/majorModel");
const Minor = require("../models/minorModel");
const Degree = require("../models/degreeModel");

const recommendCourses = asyncHandler (async (req, res) => {

});

module.exports = { recommendCourses };
