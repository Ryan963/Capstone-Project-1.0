// this is the only requirement type we have so far
// add more requirements along with the array of the required keys in a requirement object for that type
// object key is the requirement type
// the value is an array of the keys of a requirement object of that type
REQUIREMENT_TYPES = {
  credits_of_group: ["type", "credits", "courses", "description"],
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
  switch (requirement.type.toUpperCase()) {
    case "CREDITS_OF_GROUP":
      const keys = REQUIREMENT_TYPES.credits_of_group;
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
    case "max_by_level":
      break;
    // need desciplines and number of credits maximum
    case "max_by_descipline":
      break;
    // need only number of credits and the check will check any descipline
    case "max_by_all_desciplines":
      break;
    case "max_by_course":
      break;
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
