const mongoose = require("mongoose");

const minorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add name of minor"],
      unique: true,
    },
    requirements: {
      type: [
        {
          type: Object,
          strict: false,
        },
      ],
      required: [true, "Please add a requirements"],
    },
  },
  {
    timeStamps: true,
  }
);

module.exports = mongoose.model("Minor", minorSchema);
