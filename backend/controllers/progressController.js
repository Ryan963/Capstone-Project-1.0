const asyncHandler = require('express-async-handler');
const { buildRequirements, getStream, compileCourses, prereqCheck, prereqImportance } = require("../helpers/recommendationsHelper");
const Course = require("../models/courseModel");
const User = require("../models/userModel");
const Major = require("../models/majorModel");
const Minor = require("../models/minorModel");
const Degree = require("../models/degreeModel");

/**
 * Merges two arrays of requirements
 * @param {Array} reqsArr Base requirements array
 * @param {Array} newReqs New requirements to add 
 */
 function buildSpecificRequirements(reqsArr, newReqs) {
    for (var i=0; i < newReqs.length; i++) {
        reqsArr.push(newReqs[i]);
    };
}

// @desc Get minors
// @route GET /api/minors
// @access private
const progressCheck = async (req, res) => {
    // Access data
    const user = await User.findById(req.user.id);
    const degree = await Degree.findById(user.degree);  
    //const courses = await Course.find();  
    const coursesTaken = user.courses; // Create completed courses array
    const degreeRequirements = degree.requirements;
    var majorRequirements = [];
    var minorRequirements = [];
    // Create d/M/m requirements array
    var allRequirements = degree.requirements;
    for (var i=0; i<Math.max(user.majors.length, user.minors.length); i++) {
        var major, minor = null;       
        if (user.majors.length > i) { // add major
            major = await Major.findById(user.majors[i]);
            //get requirements for major(s) and for entire degree 
            buildSpecificRequirements(majorRequirements, major.requirements);
            buildSpecificRequirements(allRequirements, major.requirements);

            // stream reqs is now built in to major reqs         
        };

        //console.log("minor " + user.minors);
        if (user.minors.length > i) { // add minor
            minor = await Minor.findById(user.minors[i]);
            //get requirements for minor(s) and for entire degree 
            buildSpecificRequirements(minorRequirements, minor.requirements);
            buildSpecificRequirements(allRequirements, minor.requirements);
        };
    };
    //console.log("req[0] " + JSON.stringify(requirements[0]));
    
    console.log("major req:\n " + JSON.stringify(majorRequirements));
    console.log("minor req:\n" + JSON.stringify(minorRequirements));
    //console.log("minor " + coursesTaken);
    res.status(200).json({allRequirements});  
  }
  
module.exports = { progressCheck };