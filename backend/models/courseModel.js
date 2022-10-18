const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add Course Name"]
    },
    prerequisites: {
        type: [String],
        required: false
    },
    corequisites: {
        type: [String],
        required: false
    },
    description: {
        type: String,
        required: [true, "Please add a description"]
    },
    credits: {
        type: Number,
        required: [true, "Please add amount of credits"]
    },
    discipline: {
        type: String,
        required: [true, "Please add discipline"]
    },
    level: {
        type: Number,
        required: [true, "Please add level"]
    }
    },
    {
        timeStamps: true
    }   
);

module.exports = mongoose.model("Course", courseSchema);