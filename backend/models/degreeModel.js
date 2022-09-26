const mongoose = require("mongoose");

const degreeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name for the degree"],
    },
    requirement: {
      type: String,
      required: [true, "Please add requirement"],
    },
  },
  {
    timeStamps: true,
  }
);

module.exports = mongoose.model("Degree", degreeSchema);
