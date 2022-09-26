const mongoose = require('mongoose')

const majorSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please add name of major"],
            unique: true
        },
        requirements: [
            {
                credits: Number,
                courses: [String]
            }
        ],
        streams: [
            {
                streamName: String,
                streamRequirements: [
                    {
                        credits: Number,
                        courses: [String]
                    }
                ]
                
            }
        ],
    },
    {
        timeStamps: true,
    }
)

module.exports = mongoose.model("Major", majorSchema)