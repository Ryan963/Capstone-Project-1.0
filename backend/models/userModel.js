const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "Please add a First Name"],
    },
    lastname: {
      type: String,
      required: [true, "Please add a Last Name"],
    },
    email: {
      type: String,
      required: [true, "Please add an Email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a Password"],
    },
    degree: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "Degree",
    },
    majors: {
      type: [mongoose.Schema.Types.ObjectId],
      required: false,
      ref: "Major",
    },
    minors: {
      type: [mongoose.Schema.Types.ObjectId],
      required: false,
      ref: "Minor",
    },
    courses: {
      type: [String],
      required: false,
    },
    futureCourses: {
      type: [String],
      required: false,
    },
    currentyear: {
      type: Number,
      required: false,
    },
    graduated: {
      type: Boolean,
      required: false,
    },
    gpa: {
      type: Number,
      required: false,
    },
  },
  {
    timeStamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
