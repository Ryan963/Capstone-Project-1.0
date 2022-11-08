/**
 * Merges two arrays of requirements
 * @param {Array} reqsArr Base requirements array
 * @param {Array} newReqs New requirements to add 
 */
function buildRequirements(reqsArr, newReqs) {
    for (var i=0; i < newReqs.length; i++) {
        reqsArr.push(newReqs[i]);
    };
}

/**
 * looks for stream in given major that matches given stream name
 * @param {String} stream_name Name of major stream
 * @param {Object} major Degree major
 * @returns A stream object, or null
 */
function getStream(stream_name, major) {
    var stream = null;
    for (var i=0; i<major.streams.length; i++) {
        if (stream_name === major.streams[i].name) {
            stream = major.streams[i];
            break;
        };
    };

    return stream;
}

/**
 * Takes an array of recommended course names,
 * matches to array of Course objects, and
 * compiles objects with course name and description
 * @param {Array} recsArr Array of recommended course names
 * @param {Array} courseArr Array of course objects
 * @returns An array of compiled course objects
 */
function compileCourses(recsArr, courseArr) {
    var compiledArr = [];
    for (var i=0; i<recsArr.length; i++) {
        for (var j=0; j<courseArr.length; j++) {
            if (recsArr[i] === courseArr[j].name) {
               
                compiledArr.push(new Object({course: courseArr[j], importance: 4-courseArr[j].level}));
                
                break;
            } else if (j === courseArr.length-1) {
                console.log(recsArr[i]);
                //compiledArr.push(new Object({name: recsArr[i], description: "No course found"}));
            }
        }
    }
    return compiledArr;
}

/**
 * Checks a course array to see if its prerequisites are completed
 * by the user.
 * @param {Array} courseArr Array of courses
 * @param {Array} completedArr Array of user's completed courses
 * @returns new array with only the courses whose prereqs are satisfied
 */
function prereqCheck(courseArr, completedArr) {
    var reducedArr = []
    
    // Loop through each course and evaluate prerequisites
    for(let course in courseArr) {
        var complete = true
        var prereqArr = courseArr[course].course.prerequisites
        
        // Loop through each prereq in course, and evaluate
        for (let prereq in prereqArr) {
            let quota = prereqArr[prereq].credits / 3 // Number of courses needed to fulfill prerequisite
            
            // Check each requisite course to see if in array of completed courses
            for (let req in prereqArr[prereq].courses) {
                if (completedArr.includes(prereqArr[prereq].courses[req])) {
                    quota = quota - 1; 
                }
                if (quota === 0) { // prereq is fulfilled
                    break;
                }
            }   

            if (quota > 0) { // prereq is unfulfilled
                complete = false;
                break;
            }
        }

        if (complete === true) { // all prereqs are fulfilled, recommend course
            reducedArr.push(courseArr[course])
        }
        
    }

    return reducedArr;
}

/**
 * Increments importance of course
 * based on the number of times it appears in other requirements prerequisites
 * @param {*} courseArr 
 * @param {*} requirements 
 * @returns 
 */
function prereqImportance(courseArr, requirements, compileArr) {
    // Compile array of required courses
    let requireCourses = [];
    for (var req in requirements) { 
        requireCourses = requireCourses.concat(requirements[req].courses);        
        /*if (requirements[req].courses.includes(courseArr[course].course.name)) {
            courseArr[course].importance = courseArr[course].importance + 1 ;
        }*/            
    }
    compiledReqs = compileCourses(requireCourses, compileArr);
    console.log(compiledReqs[0]);
    // Loop through courses and increment importance based on frequency in requirements and other courses prerequisites
    /*for (var course in courseArr) {

        
        
    }*/

    return courseArr;
}

module.exports = { buildRequirements, getStream, compileCourses, prereqCheck, prereqImportance };