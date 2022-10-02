// this is the only requirement type we have so far
// add more requirements along with the array of the required keys in a requirement object for that type
// object key is the requirement type
// the value is an array of the keys of a requirement object of that type
REQUIREMENT_TYPES = {
  credits_of_group: ["type", "numberOfCredits", "courses", "excluded"],
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
  switch (requirement.type.toUpperCase()) {
    case "CREDITS_OF_GROUP":
      const keys = REQUIREMENT_TYPES.credits_of_group;
      // check if all poperties are there
      keys.map((key) => {
        if (!requirement[key]) {
          throw new Error("requirement type is missing a property");
        }
      });

      if (requirement.numberOfCredits > requirement.courses.length * 3) {
        throw new Error(
          "Courses to choose from or less than courses required!"
        );
      }
      return requirement;

    default:
      break;
  }
}

function getRequirmentKeys(type) {
  return REQUIREMENT_TYPES[type];
}
module.exports = {
  processRequirements,
  getRequirmentKeys,
};
