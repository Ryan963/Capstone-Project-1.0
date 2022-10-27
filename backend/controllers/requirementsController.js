const {
  processRequirements,
  getRequirementKeys,
} = require("../helpers/processRequirements");
const Major = require("../models/majorModel");
const Minor = require("../models/minorModel");
const Degree = require("../models/degreeModel");

const checkIfRequirementExist = (requirement, requirements) => {
  const requirementExist = requirements.filter((req) => {
    if (req.type !== requirement.type) {
      return false;
    }
    const reqKeys = getRequirementKeys(req.type);
    for (let key of reqKeys) {
      //console.log(req[key], requirement[key]);
      if (req[key] !== requirement[key]) {
        if (Array.isArray(req[key])) {
          if (req[key].length !== requirement[key].length) {
            return false;
          }
          if (
            req[key].sort((a, b) => a - b).join("") !==
            requirement[key].sort((a, b) => a - b).join("")
          ) {
            return false;
          }
        } else {
          return false;
        }
      }
    }
    return true;
  });

  return requirementExist.length > 0 ? true : false;
};

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
        const newDegreeReqs = degree.requirements;
        if (checkIfRequirementExist(requirement, newDegreeReqs)) {
          throw new Error("Requirement already exists");
        }
        console.log(newDegreeReqs);
        newDegreeReqs.push(databaseRequirement);
        await Degree.findOneAndUpdate(
          { name },
          {
            requirements: newDegreeReqs,
          }
        );
        break;
      case "major":
        const major = await Major.findOne({ name });
        if (!major) {
          throw new Error("Major was not found!");
        }
        const newMajorReqs = [...major.requirements];
        if (checkIfRequirementExist(requirement, newMajorReqs)) {
          throw new Error("Requirement already exists");
        }
        newMajorReqs.push(databaseRequirement);
        await Major.findOneAndUpdate(
          { name },
          {
            requirements: newMajorReqs,
          }
        );
        break;
      case "minor":
        const minor = await Minor.findOne({ name });
        if (!minor) {
          throw new Error("minor was not found!");
        }
        const newMinorReqs = [...minor.requirements];
        if (checkIfRequirementExist(requirement, newMinorReqs)) {
          throw new Error("Requirement already exists");
        }
        newMinorReqs.push(databaseRequirement);
        await Minor.findOneAndUpdate(
          { name },
          {
            requirements: newMinorReqs,
          }
        );
        break;
      default:
        res.status(400).json();
        break;
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(200).json({ success: false, message: error.message });
  }
};

const deleteRequirement = async (req, res) => {
  var { collection, name, requirement } = req.body;
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
      const reqKeys = getRequirementKeys(req.type);
      for (let key of reqKeys) {
        console.log(req[key], requirement[key]);
        if (req[key] !== requirement[key]) {
          if (Array.isArray(req[key])) {
            if (req[key].length !== requirement[key].length) {
              return true;
            }
            if (
              req[key].sort((a, b) => a - b).join("") !==
              requirement[key].sort((a, b) => a - b).join("")
            ) {
              return true;
            }
          } else {
            return true;
          }
        }
      }
      return false;
    });

    if (newModelReqs.length === model.requirements.length) {
      throw new Error("Requirement was not found");
    }
    await Model.findOneAndUpdate(
      { name },
      {
        requirements: newModelReqs,
      }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(200).json({ success: false, message: error.message });
  }
};

const updateRequirement = async (req, res) => {
  const { collection, name, oldRequirement, newRequirement } = req.body;
  try {
    if (!collection || !oldRequirement || !newRequirement) {
      throw new Error("some fields are missing!");
    }
    const databaseRequirement = processRequirements(newRequirement);
    
    switch (collection.toLowerCase()) {
      case "degree":
        const degree = await Degree.findOne({ name });
        if (!degree) {
          throw new Error("Degree was not found!");
        }
        const newDegreeReqs = degree.requirements;
        if (checkIfRequirementExist(newRequirement, newDegreeReqs)) {
          throw new Error("Requirement unchanged");
        }
        
        // Loop to find old requirement index and update
        for (let req in newDegreeReqs) {
          let reqArr = [];
          reqArr.push(newDegreeReqs[req]);
          if (checkIfRequirementExist(oldRequirement, reqArr)) {
            newDegreeReqs[req] = databaseRequirement;
            
            break;
          }
        }
        
        await Degree.findOneAndUpdate(
          { name },
          {
            requirements: newDegreeReqs,
          }
        );
        break;
      case "major":
        const major = await Major.findOne({ name });
        if (!major) {
          throw new Error("Major was not found!");
        }
        const newMajorReqs = [...major.requirements];
        if (checkIfRequirementExist(newRequirement, newMajorReqs)) {
          throw new Error("Requirement unchanged");
        }
        
        // Loop to find old requirement index and update
        for (let req in newMajorReqs) {
          let reqArr = [];
          reqArr.push(newMajorReqs[req]);
          if (checkIfRequirementExist(oldRequirement, reqArr)) {
            newMajorReqs[req] = databaseRequirement;
            break;
          }
        }

        await Major.findOneAndUpdate(
          { name },
          {
            requirements: newMajorReqs,
          }
        );
        break;
      case "minor":
        const minor = await Minor.findOne({ name });
        if (!minor) {
          throw new Error("minor was not found!");
        }
        const newMinorReqs = [...minor.requirements];
        if (checkIfRequirementExist(newRequirement, newMinorReqs)) {
          throw new Error("Requirement unchanged");
        }
        
        // Loop to find old requirement index and update
        for (let req in newMinorReqs) {
          let reqArr = [];
          reqArr.push(newMinorReqs[req]);
          if (checkIfRequirementExist(oldRequirement, reqArr)) {
            newMinorReqs[req] = databaseRequirement;
            break;
          }
        }

        await Minor.findOneAndUpdate(
          { name },
          {
            requirements: newMinorReqs,
          }
        );
        break;
      default:
        res.status(400).json();
        break;
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(200).json({ success: false, message: error.message });
  }
};

module.exports = {
  addRequirement,
  deleteRequirement,
  updateRequirement,
};
