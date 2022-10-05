const Course = require("../models/courseModel");
const asyncHandler = require('express-async-handler');

// @desc Gets FULL course list
// @route GET /api/courses
// @access public
const getCourses = asyncHandler (async(req,res) => {
    const courses = await Course.find();    
    res.status(200).json(courses);
});

/// @desc Creates new course
/// @route POST /api/courses
/// @access private
const createCourse = asyncHandler (async(req,res) => {
    const { name, prerequisites, corequisites, description, credits, discipline } = req.body;

    if (!name || !description || !credits || !discipline) {
        res.status(400);
        throw new Error("Please add all fields");
    };

    const courseExists = await Course.findOne({name});
    if (courseExists) {
        res.status(400);
        throw new Error("Course already exists");
    };

    // Create Course
    const course = await Course.create({
        name,
        prerequisites,
        corequisites,
        description,
        credits,
        discipline
    });



    // Check course created without issue
    if (course) {
        res.status(201).json({
            name: course.name
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    };
});

// @desc Update Course
// @route PUT /api/courses/:id
// @access private
const updateCourse = asyncHandler (async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
      res.status(400);
      throw new Error('Course not found');
    };
  
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.status(200).json(updatedCourse);
});

// @desc Delete specified course
// @route POST /api/courses/id
// @access private
const deleteCourse = asyncHandler( async (req,res) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(400);
        throw new Error("Course not found");
    };

    const courseName = course.name;
    await course.remove();

    res.status(200).json({message: `Course: ${courseName} deleted`});
});

module.exports = {
    getCourses, createCourse, deleteCourse, updateCourse
};