const mongoose = require("mongoose");

const degreeSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a degree name"],
        unique: true
    },
    requirements: {
        type: [{
            type: Object,
            strict: false, 
        }],
        required: [true, "Please add a requirements"]
    }}, 
    {
    timeStamps: true
});

module.exports = mongoose.model("Degree", degreeSchema);

