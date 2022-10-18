const asyncHandler = require('express-async-handler');
const { buildRequirements, getStream, compileCourses, prereqCheck, prereqImportance } = require("../helpers/recommendationsHelper");
const Course = require("../models/courseModel");
const User = require("../models/userModel");
const Major = require("../models/majorModel");
const Minor = require("../models/minorModel");
const Degree = require("../models/degreeModel");

// @desc Create list of recommended courses for student to take
//       prioritized by course level
// @route GET /api/recommendations
// @access private
const recommendCourses = asyncHandler (async (req, res) => {
    // Access data
    const user = await User.findById(req.user.id);
    const degree = await Degree.findById(user.degree);  
    const courses = await Course.find();  
    const coursesTaken = user.courses; // Create completed courses array
    
    // Create d/M/m requirements array
    var requirements = degree.requirements;
    for (var i=0; i<Math.max(user.majors.length, user.minors.length); i++) {
        var major, minor = null;       
        if (user.majors.length > i) { // add major
            major = await Major.findById(user.majors[i].majorID);
            buildRequirements(requirements, major.requirements);

            var stream = getStream(user.majors[i].stream, major);
            if (stream != null) { // add stream
                buildRequirements(requirements, stream.requirements);
            };
        };

        if (user.minors.length > i) { // add minor
            minor = await Minor.findById(user.minors[i].minorID);
            buildRequirements(requirements, minor.requirements);
        };
    };
    
    var recommendations = []; // Initialize recommendations array

    // Loop through all requirements
    for (var i=0; i < requirements.length; i++) {
        var req = requirements[i];
        var quota = req.credits/3; // number of courses to complete requirement (credits / 3 is one course)
        var incomplete_courses = [];

        // Compare requirement's courses to taken courses and add incomplete to incomplete_courses array
        for (var j=0; j < req.courses.length; j++) {
            // Check if course is incomplete and all prerequisites are complete
            if (!coursesTaken.includes(req.courses[j])) {
                incomplete_courses.push(req.courses[j]);
            } else {
                quota = quota - 1;
                if (quota <= 0) {
                    break;
                };
            };
        };

        // Add courses to recommend, until there are enough to satisfy requirement
        while (quota > 0) {
            recommendations.push(incomplete_courses[quota-1]);
            quota = quota-1;
        };
    };

    recommendations = [...new Set(recommendations)]; // Make entries unique (removes duplicates)
   
    // Compile courses from course database, and remove any courses that have incomplete prerequisites
    recommendations = prereqCheck(compileCourses(recommendations, courses), coursesTaken);

    recommendations = prereqImportance(recommendations, requirements);

    // Sort recommendations
    recommendations.sort((a,b) => b.importance - a.importance);

    
    
    if (recommendations.length > 10) { // Recommend top 10 courses
        recommendations.splice(10,recommendations.length-10);
    };

    res.status(200).json({recommendations});  
});

module.exports = { recommendCourses };
