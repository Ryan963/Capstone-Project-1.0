const {
  processRequirements,
  getRequirmentKeys,
} = require("../helpers/processRequirements");
const Major = require("../models/majorModel");
const Minor = require("../models/minorModel");
const Degree = require("../models/degreeModel");

const addRequirement = async (req, res) => {
  const { collection, name, requirement } = req.body;
  try {
    if (!collection || !requirement) {
      throw new Error("some fields are missing!");
    }
    const databaseRequirement = processRequirements(requirement);
    switch (collection.toLowerCase()) {
      case "degree":
        const degree = await Degree.findOne({ name });
        if (!degree) {
          throw new Error("Degree was not found!");
        }
        const newDegreeReqs = [...degree.requirements].push(
          databaseRequirement
        );
        await Degree.findOneAndUpdate(
          { name },
          {
            $set: {
              requirements: newDegreeReqs,
            },
          }
        );
        break;
      case "major":
        const major = await Major.findOne({ name });
        if (!major) {
          throw new Error("Major was not found!");
        }
        const newMajorReqs = [...major.requirements].push(databaseRequirement);
        await Major.findOneAndUpdate(
          { name },
          {
            $set: {
              requirements: newMajorReqs,
            },
          }
        );
        break;
      case "minor":
        const minor = await Minor.findOne({ name });
        if (!minor) {
          throw new Error("minor was not found!");
        }
        const newMinorReqs = [...minor.requirements].push(databaseRequirement);
        await Minor.findOneAndUpdate(
          { name },
          {
            $set: {
              requirements: newMinorReqs,
            },
          }
        );
        break;
      default:
        res.status(400).json();
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(200).json({ success: false, message: error.message });
  }
};

const deleteRequirement = async (req, res) => {
  const { collection, name, requirement } = req.body;
  try {
    if (!collection || !requirement) {
      throw new Error("some fields are missing!");
    }
    let Model;
    switch (collection.toLowerCase()) {
      case "degree":
        Model = Degree;
        break;
      case "major":
        Model = Major;
        break;
      case "minor":
        Model = Minor;
        break;
      default:
        res.status(400).json({ message: "collection does not exist" });
    }
    const model = await Model.findOne({ name });
    if (!model) {
      throw new Error(`${collection} was not found!`);
    }

    // filter the requirements to delete the requirement passed in from the frontend
    const newModelReqs = model.requirements.filter((req) => {
      if (req.type !== requirement.type) {
        return true;
      }
      const reqKeys = getRequirmentKeys(req.type);
      for (let key of reqKeys) {
        if (req[key] !== requirement[key]) {
          return true;
        }
      }
      return false;
    });

    if (newModelReqs.length === model.requirements.length) {
      throw new Error("Requirment was not found");
    }
    await Model.findOneAndUpdate(
      { name },
      {
        $set: {
          requirements: newModelReqs,
        },
      }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(200).json({ success: false, message: error.message });
  }
};

module.exports = {
  addRequirement,
  deleteRequirement,
};
