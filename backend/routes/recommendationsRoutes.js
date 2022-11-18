const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/userAuthMiddleware");
const {
  recommendCourses,
  requirementsSatisfied,
} = require("../controllers/recommendationsController");

router.route("/").get(protect, recommendCourses);

router.route("/:id").get(protect, requirementsSatisfied);

module.exports = router;
