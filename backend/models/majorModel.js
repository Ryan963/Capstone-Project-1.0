const mongoose = require("mongoose");

const majorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add name of major"],
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
    stream: {
      type: String,
    },
  },
  {
    timeStamps: true,
  }
);
majorSchema.index({ name: 1, stream: 1 }, { unique: true });
module.exports = mongoose.model("Major", majorSchema);
