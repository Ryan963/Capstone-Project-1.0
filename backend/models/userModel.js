const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: [true, "Please add a First Name"]
    },
    lastname: {
        type: String,
        required: [true, "Please add a Last Name"]
    },
    email: {
        type: String,
        required: [true, "Please add an Email"],
        unique: true
    },    
    password: {
        type: String,
        required: [true, "Please add a Password"]
    },
    majors: {
        type: Array,
        required: false
    },
    minors: {
        type: Array,
        required: false
    },
    degree: {
        type: String,
        required: [true, "Please add a Degree"]
    },
    courses: {
        type: Array,
        required: false
    },
    currentyear: {
        type: Number,
        required: false
    },
    currentsemester: {
        type: String,
        required: false
    },
    graduated: {
        type: Boolean,
        required: false
    },
    gpa: {
        type: Number,
        required: false
    }},
    {
        timeStamps: true
    }   
);

module.exports = mongoose.model("User", userSchema);