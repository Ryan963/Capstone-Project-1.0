const asyncHandler = require('express-async-handler');
const Course = require("../models/courseModel");
const User = require("../models/userModel");
const Major = require("../models/majorModel");
const Minor = require("../models/minorModel");
const Degree = require("../models/degreeModel");

const recommendCourses = asyncHandler (async (req, res) => {
    // Access user data
    const user = await User.findById(req.user.id);
    const degree = await Degree.findById(user.degree);
    const major = await Major.findById(user.majors[0].majorID);
    const minor = await Minor.findById(user.minors);

    // find stream
    console.log(major.streams[0].requirements);
    var stream_name = user.majors[0].stream;
    var stream = null;
    for (var i=0; i<major.streams.length; i++) {
        if (stream_name === major.streams[i].name) {
            stream = major.streams[i];
            break;
        }
    }
    
    // Create completed courses array
    const coursesTaken = user.courses;
    
    // Create d/M/m requirements array
    var requirements = degree.requirements;
    if (major != null){ //add major requirements    
        buildRequirements(requirements, major.requirements);
    };
    
    if (stream != null) { //add stream requirements
        buildRequirements(requirements, stream.requirements);
    }

    //console.log(requirements);

    if (minor != null) { //add minor requirements
        buildRequirements(requirements, minor.requirements);
    };    
    // Initialize recommendations array
    var recommendations = [];

    // Loop through all requirements
    for (var i=0; i < requirements.length; i++) {
        var r = requirements[i]
        var quota = r.credits/3 // number of courses to complete requirement (credits / 3 is one course)
        var incomplete_courses = [];

        // Compare requirement's courses to taken courses and add incomplete to incomplete_courses array
        for (var j=0; j < r.courses.length; j++) {
            if (!coursesTaken.includes(r.courses[j])) {
                incomplete_courses.push(r.courses[j]);
            } else {
                quota = quota - 1;
                if (quota <= 0) {
                    break;
                }
            };
        };

        while (quota > 0) {
            recommendations.push(incomplete_courses[quota-1]);
            quota = quota-1;
        };
    }

    recommendations = [...new Set(recommendations)];

    recommendations.sort((a,b) => Number(a.slice(a.length - 3) - Number(b.slice(b.length - 3))));

    if (recommendations.length > 10) {
        recommendations.splice(10,recommendations.length-10);
    };

    res.status(200).json({recommendations});
    
});

/*
const buildRequirements = asyncHandler(async (req, res, user) => {
    var degree = await Degree.findById("632ce71d7f9a8c15c65aea59");
    res.status(200).json(user);
    console.log(user);
    return degree;
})*/

function buildRequirements(reqsArr, newReqs) {
    for (var i=0; i < newReqs.length; i++) {
        reqsArr.push(newReqs[i]);
    };
}

module.exports = { recommendCourses };
