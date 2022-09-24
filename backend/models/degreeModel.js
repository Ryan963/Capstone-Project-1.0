const mongoose = require("mongoose");

const degreeSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a degree name"],
        unique: true
    },
    requirements: {
        type: [{
            type: String, 
            number: Number, 
            courses_to_choose: [{course_id: mongoose.Schema.Types.ObjectId, course_name: String}]
        }],
        required: [true, "Please add a requirements"]
    }}, 
    {
    timeStamps: true
});

module.exports = mongoose.model("Degree", degreeSchema);

