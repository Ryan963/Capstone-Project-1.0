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
                compiledArr.push(new Object({name: recsArr[i], description: "No course found"}));
            }
        }
    }
    return compiledArr;
}

function prereqCheck(courseArr, completedArr) {
    var reducedArr = []
    for(var course in courseArr) {
        var complete = true;
        var prereqArr = courseArr[course].course.prerequisites
        for (var prereq in prereqArr) {
            if (!completedArr.includes(prereqArr[prereq])) {
                complete = false;
                break;
            }
        }

        if (complete === true) {
            reducedArr.push(courseArr[course])
        }
    }

    return reducedArr;
}

function prereqImportance(courseArr, requirements) {
    for (var course in courseArr) {
        
        for (var req in requirements) {
            //console.log(requirements[req])
            if (requirements[req].courses.includes(courseArr[course].course.name)) {
                
                courseArr[course].importance = courseArr[course].importance + 1 ;
            }
        }
        
    }

    return courseArr;
}

module.exports = { buildRequirements, getStream, compileCourses, prereqCheck, prereqImportance };