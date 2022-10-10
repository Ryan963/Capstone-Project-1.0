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
               
                compiledArr.push(new Object({name: courseArr[j].name, description: courseArr[j].description}));
                
                break;
            }
        }
    }
    return compiledArr;
}

module.exports = { buildRequirements, getStream, compileCourses };