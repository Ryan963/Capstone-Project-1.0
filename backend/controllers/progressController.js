const asyncHandler = require("express-async-handler");
const {
  buildRequirements,
  getStream,
  compileCourses,
  prereqCheck,
  prereqImportance,
} = require("../helpers/recommendationsHelper");
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
  for (var i = 0; i < newReqs.length; i++) {
    reqsArr.push(newReqs[i]);
  }
}

/**
 * Degree Regulation 1: Minimum 120 credits (40 courses) of non-duplicative coursework
 * Determines the percent of courses taken/ the required 120 credits
 * Currently all courses are assumed to be 3 credits only.
 * This function is separate in case there will be 4 credit courses later
 * @param {Array} userCourses  the array of user courses
 */
function checkMin120cred(userCourses) {
  const requiredCoursesToTake = 40;
  return (userCourses.length / requiredCoursesToTake) * 100;
}

/**
 * Degree Regulation 6: Maximum of 60 credits (20 courses) in any one discipline
 * @param {Array} userCourses  the array of user courses
 * The Array of disciplines over 60 credits is returned.
 * If returned array is empty, then they have no disciplines over 60 credits
 */
function checkMaxByAllDisciplines(userCourses, limitCredits) {
  var limitCourses = limitCredits / 3;
  let uniqueCourses = [...new Set(userCourses)];
  var discipline = [];
  var chars;
  var numbs;
  var overMaximum = [];
  for (var i = 0; i < uniqueCourses.length; i++) {
    chars = uniqueCourses[i].slice(0, uniqueCourses[i].search(/\d/));
    numbs = uniqueCourses[i].replace(chars, "");
    discipline.push(chars);
  }
  var occurrences = {};
  for (var i = 0, j = discipline.length; i < j; i++) {
    occurrences[discipline[i]] = (occurrences[discipline[i]] || 0) + 1;
    if (occurrences[discipline[i]] > limitCourses) {
      overMaximum.push(discipline[i]);
    }
  }
  return overMaximum;
}

/**
 *  Checks to see if there are the user has too many credits based on the Disciplines given
 * @param {Array} userCourses  the array of user courses
 * The Array of disciplines over the number of credits is returned.
 * If returned array is empty, then they have no disciplines over the given number of credits
 */
function checkMaxByDiscipline(userCourses, limitCredits, disciplinesToCheck) {
  var limitCourses = limitCredits / 3;
  var userDiscipline;
  var userCourseNum;
  var coursesInDiscipline = [];
  var overMaximum = [];
  //Deconstructs the course names into Discipline and course number E.g. CMPT101 => 'CMPT' and '101'
  for (var i = 0; i < userCourses.length; i++) {
    userDiscipline = userCourses[i].slice(0, userCourses[i].search(/\d/));
    userCourseNum = userCourses[i].replace(userDiscipline, "");
    //Then checks if the given user course name from the user course's array
    //matches any of the Disciplines passed in then add to the array
    for (var j = 0; j < disciplinesToCheck.length; j++) {
      if (userDiscipline === disciplinesToCheck[j]) {
        coursesInDiscipline.push(userDiscipline);
      }
    }
  }
  var occurrences = {};
  for (var i = 0, j = coursesInDiscipline.length; i < j; i++) {
    occurrences[coursesInDiscipline[i]] =
      (occurrences[coursesInDiscipline[i]] || 0) + 1;
    if (occurrences[coursesInDiscipline[i]] > limitCourses) {
      overMaximum.push(discipline[i]);
    }
  }
  return overMaximum;
}

// /**
//  * Checks to see if there are the user has too many credits at the level given
//  * @param {Array} userCourses  the array of user courses
//  * The Array of courses is returned IF it is over the limit passed
//  * * If returned array is empty, then they have no disciplines over 60 credits
//  */
// function checkMaxByCourseLevel(userCourses, limitCredits, level) {
//   var limitCourses = limitCredits / 3;
//   //let uniqueCourses = [...new Set(userCourses)]
//   var chars;
//   var numbs;
//   var coursesAtLevel = [];
//   for (var i = 0; i < userCourses.length; i++) {
//     chars = userCourses[i].slice(0, userCourses[i].search(/\d/));
//     numbs = userCourses[i].replace(chars, "");
//     if (numbs < level) {
//       coursesAtLevel.push(userCourses[i]);
//     }
//   }
//   if (coursesAtLevel.length > limitCourses) {
//     return coursesAtLevel;
//   }
//   return [];
// }

/**
 * Checks if user satisfies requirement
 */
function checkReqSatisfaction(userCourses, requirements) {
  var completed = 0;
  for (var i = 0; i < requirements.length; i++) {
    //Compare against the user courses already taken
    //If user has taken requirement then completed++
    if (userCourses.includes(requirements[i])) {
      completed++;
    }
  }
  return completed;
}
/**
 * Compares two arrays
 * @param {
 * } req
 * @param {*} res
 */
//array1 = ["CMPT110","CMPT200","CMPT103","CMPT101"];
//array2 = ["CMPT200","CMPT110","CMPT101","CMPT104"];
function compare(userCourses, requirements) {
  if (array1.length != array2.length) {
    return false;
  }

  array1 = array1.slice();
  array1.sort();
  array2 = array2.slice();
  array2.sort();

  for (var i = 0; i < array1.length; i++) {
    if (array1[i] != array2[i]) {
      return false;
    }
  }

  return true;
}


// @desc Get major progress check
// @route GET /api/progress/major
// @access private
const majorProgressCheck = async (req, res) => {
  // Access data
  const user = await User.findById(req.user.id);
  //const courses = await Course.find();
  const coursesTaken = user.courses; // Create completed courses array
  var majorRequirements = [];
  var completion = [];
  // Create d/M/m requirements array
  for (var i = 0; i < user.majors.length; i++) {
    var major = null;
    if (user.majors.length > i) {
      // add major
      major = await Major.findById(user.majors[i]);
      //get requirements for major(s)
      buildSpecificRequirements(majorRequirements, major.requirements);
      // stream reqs is now built in to major reqs
    }
    completion = getCreditGroups(coursesTaken, majorRequirements);
  }
  res.status(200).json(completion);
};

// @desc Get minor progress check
// @route GET /api/progress/major
// @access private
const minorProgressCheck = async (req, res) => {
  // Access data
  const user = await User.findById(req.user.id);
  const coursesTaken = user.courses; // Create completed courses array
  var minorRequirements = [];
  var completion = [];
  // Create minor requirements array
  for (var i = 0; i < user.minors.length; i++) {
    var minor = null;
    if (user.minors.length > i) {
      // add minor
      minor = await Minor.findById(user.minors[i]);
      //get requirements for major(s)
      buildSpecificRequirements(minorRequirements, minor.requirements);
      // stream reqs is now built in to major reqs
    }
    completion = getCreditGroups(coursesTaken, minorRequirements);
  }
  res.status(200).json(completion);
};

// @desc Get minor progress check
// @route GET /api/progress/breadth
// @access private
const breadthProgressCheck = async (req, res) => {
  // Access data
  const user = await User.findById(req.user.id);
  const coursesTaken = user.courses; // Create completed courses array
  var completion = [];
  const degree = await Degree.findById(user.degree);
  const degreeRequirements = [...degree.requirements];
  completion = getCreditGroups(coursesTaken, degreeRequirements);
  res.status(200).json(completion);
};

/**
 * Gets the largest amount of credits for either major or minor requirements
 * Uses that amount / 120 to get percentage either major or minor towards degree
 * E.g. if Major has 42/120 = 35% then major counts 30% towards degree total
 * @param {*} requirements: are either major or minor requirements
 * @returns percentage of major or minor towards degree
 */
function getPercentMajorMinor(requirements) {
  var largest = 0;
  const totalDegreeCredits = 120;
  for (var i = 0; i < requirements.length; i++) {
    largest = Math.max(largest, requirements[i].credits);
  }
  return (largest / totalDegreeCredits) * 100;
}

// /**
//  *
//  * @param {*} requirements
//  * @returns
//  */
// function getBreadthPercentage(requirements) {
//   var largest = 0;
//   const totalDegreeCredits = 120;
//   for (var i = 0; i < requirements.length; i++) {
//     largest = Math.max(largest, requirements[i].credits);
//   }
//   return (largest / totalDegreeCredits) * 100;
// }

/**
 *
 * @param {*} type
 * @param {*} courses
 * @param {*} requirements
 * @returns The percentage that the requirements are done. E.g. If Major requirements are 50% and it composes 40% of the total
 * degree requirements then it will return 50% * 40 = 20% is returned
 */
function progressChecker(type, courses, requirements, breadthPerc) {
  var percFinishedDegreeAndSelf = new Object();
  var percentDMm = getPercentMajorMinor(requirements);
  if(type === "breadth"){
    percentDMm = parseFloat(breadthPerc);
  }
  const majorMinorProgress = getCreditGroups(courses, requirements);
  //Then Calculate how much percentage is actually done by user for major and minor
  var max = 0;
  var indexMax = 0;
  var percentFinished = [];
  var creditsFinishedPerReq;
  requirements = requirements.filter(
    (req) => req.type.toLowerCase() === "credits_of_group"
  );
  const eachReqWeightPerc =  percentDMm / (requirements.length - 1)
  
  for (var x = 0; x < requirements.length; x++) {
    if (requirements[x].type === "credits_of_group") {
      //Calculate the percentage finished of each requirement. Assumes each requirement has equal wieght.
      creditsFinishedPerReq = (majorMinorProgress[x].percentage / 100) * eachReqWeightPerc;
      percentFinished.push(creditsFinishedPerReq);
      //Remove largest credit requirements as it is just overall requirements if its major
      if ((type != "minor" || "") &&
          max < Math.max(max, requirements[x].credits)) {
        indexMax = x;
        max = Math.max(max, requirements[x].credits);
      }
    }
  }
  // console.log(percentFinished);
  //Gets actual percentage of Major or Minor done
  var totalPercentFinished = 0;
  for (var y = 0; y < requirements.length; y++) {
    percentFinished[y];
    if (y != indexMax && type != "minor") {
      totalPercentFinished += percentFinished[y];
    }
    if (type === "minor") {
      totalPercentFinished += percentFinished[y];
    }
  }

  if(totalPercentFinished > percentDMm){
    totalPercentFinished = percentDMm;
  };

  // Then multiply the percentage done by how much the Major, minor, or breadth count towards the degree
  
  
  if(type === "major"){
    percFinishedDegreeAndSelf.selfMajPerc = (totalPercentFinished / percentDMm) * 100;
    percFinishedDegreeAndSelf.degreeMajPerc = totalPercentFinished;
  }
  if(type === "minor"){
    percFinishedDegreeAndSelf.selfMinPerc = (totalPercentFinished / percentDMm) * 100;
    percFinishedDegreeAndSelf.degreeMinPerc = totalPercentFinished;
    
  }
  if(type === "breadth"){
    percFinishedDegreeAndSelf.selfBreadthPerc = (totalPercentFinished / percentDMm) * 100;
    percFinishedDegreeAndSelf.degreeBreadthPerc = totalPercentFinished;
  }
  return percFinishedDegreeAndSelf;
}

/**
 *
 * @param {*} userCourses
 * @param {*} requirements
 * @returns The amount of courses
 */
function getCreditGroups(userCourses, requirements) {
  const creditValue = 3;
  var completion = [];
  for (var i = 0; i < requirements.length; i++) {
    //console.log(requirements[i].courses)
    var percentCompleted = 0;
    var obj = new Object();
    //Get all requirements that are "credits_of_group"
    //Compare against the user courses already taken
    //Create percentage = courses taken/credits required from "credits of group"
    if (requirements[i].type === "credits_of_group") {
      percentCompleted = Math.round(
        ((checkReqSatisfaction(userCourses, requirements[i].courses) *
          creditValue) /
          requirements[i].credits) *
          100
      );
      obj.description = requirements[i].description;
      percentCompleted = percentCompleted > 100 ? 100 : percentCompleted;
      obj.percentage = percentCompleted;
      completion.push(obj);
    }
  }
  // console.log(completion);

  return completion;
}

// @desc Get degree progress check
// @route GET /api/minors
// @access private
const progressCheck = async (req, res) => {
  // Access data
  const user = await User.findById(req.user.id);
  const degree = await Degree.findById(user.degree);
  const coursesTaken = user.courses; // Create completed courses array
  const degreeRequirements = [...degree.requirements];
  var majorRequirements = [];
  var minorRequirements = [];
  //var completion = [];
  var completion = new Object();
  // Create d/M/m requirements array
  var allRequirements = [...degree.requirements];

  for (var i = 0; i < Math.max(user.majors.length, user.minors.length); i++) {
    var major,
      minor = null;

    if (user.majors.length > i) {
      // add major
      major = await Major.findById(user.majors[i]);
      //get requirements for major(s) and for entire degree
      buildSpecificRequirements(majorRequirements, major.requirements);
      buildSpecificRequirements(allRequirements, major.requirements);
      // stream reqs is now built in to major reqs
    }
    if (user.minors.length > i) {
      // add minor
      minor = await Minor.findById(user.minors[i]);
      //get requirements for minor(s) and for entire degree
      buildSpecificRequirements(minorRequirements, minor.requirements);
      buildSpecificRequirements(allRequirements, minor.requirements);
    }
    const percentMajor = progressChecker(
      "major",
      coursesTaken,
      majorRequirements,
      0

    );
    const percentMinor = progressChecker(
      "minor",
      coursesTaken,
      minorRequirements,
      0
    );
    
    const breadthMaxPerc = 100 - (parseFloat(percentMajor.degreeMajPerc) + parseFloat(percentMinor.degreeMinPerc));
    const percentBreadth = progressChecker(
      "breadth",
      coursesTaken,
      degreeRequirements,
      breadthMaxPerc
    );

    completion.percentMajor = Math.ceil(percentMajor.degreeMajPerc);
    completion.finishedMajor = Math.ceil(percentMajor.selfMajPerc);
    completion.percentMinor = Math.ceil(percentMinor.degreeMinPerc);
    completion.finishedMinor = Math.ceil(percentMinor.selfMinPerc);
    completion.percentBreadth = Math.ceil(percentBreadth.degreeBreadthPerc);
    completion.finishedBreadth = Math.ceil(percentBreadth.selfBreadthPerc);
    // console.log(completion);
  }
  res.status(200).json(completion);
};

module.exports = { progressCheck, majorProgressCheck, minorProgressCheck, breadthProgressCheck};
