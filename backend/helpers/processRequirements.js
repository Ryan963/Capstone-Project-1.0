// this is the only requirement type we have so far
// add more requirements along with the array of the required keys in a requirement object for that type
// object key is the requirement type
// the value is an array of the keys of a requirement object of that type
REQUIREMENT_TYPES = {
  credits_of_group: ["type", "credits", "courses", "description"],
  max_by_level: ["type", "credits", "level", "description"],
  max_by_discipline: ["type", "credits", "disciplines", "description"],
  max_by_all_disciplines: ["type", "credits", "description"],
  max_by_course: ["type", "credits", "courses", "description"],
};

/**
 * function will take the requirements passed from the frontend
 * it will check for the requirement type
 * @param {Object} requirement
 */
function processRequirements(requirement) {
  if (!requirement.type) {
    throw new Error("Requirement type is not provided");
  }
  /**
   * Dev notes: The check xpects courses to always be 3 credits long
   */
  const keys = REQUIREMENT_TYPES[requirement.type.toLowerCase()];
  switch (requirement.type.toUpperCase()) {
    case "CREDITS_OF_GROUP":
      // check if all poperties are there
      keys.map((key) => {
        if (!requirement[key]) {
          throw new Error("requirement type is missing a property");
        }
      });

      if (requirement.credits > requirement.courses.length * 3) {
        throw new Error(
          "Courses to choose from are less than courses required!"
        );
      }
      return requirement;
    // need level and number of credits
    case "MAX_BY_LEVEL":
      keys.map((key) => {
        if (!requirement[key]) {
          throw new Error("requirement type is missing a property");
        }
      });
      if (requirement.level > 8 || requirement.level < 1) {
        throw new Error("level is out of range");
      }

      return requirement;
    // need desciplines and number of credits maximum
    case "MAX_BY_DISCIPLINE":
      keys.map((key) => {
        if (!requirement[key]) {
          throw new Error("requirement type is missing a property");
        }
      });
      return requirement;
    // need only number of credits and the check will check any descipline
    case "MAX_BY_ALL_DISCIPLINES":
      keys.map((key) => {
        if (!requirement[key]) {
          throw new Error("requirement type is missing a property");
        }
      });
      return requirement;
    case "MAX_BY_COURSE":
      keys.map((key) => {
        if (!requirement[key]) {
          throw new Error("requirement type is missing a property");
        }
      });
      return requirement;
    default:
      throw new Error("type does not exist");
  }
}

function getRequirementKeys(type) {
  return REQUIREMENT_TYPES[type.toLowerCase()];
}
module.exports = {
  processRequirements,
  getRequirementKeys,
};
