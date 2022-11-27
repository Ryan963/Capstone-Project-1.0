const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/userAuthMiddleware");
const {
  recommendCourses,
  requirementsSatisfied,
  getAllUserRequirements,
} = require("../controllers/recommendationsController");

router.route("/").get(protect, recommendCourses);
router.route("/requirements").get(protect, getAllUserRequirements);
router.route("/:id").get(protect, requirementsSatisfied);

module.exports = router;
