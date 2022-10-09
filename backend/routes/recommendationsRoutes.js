const express = require("express");
const router = express.Router();
const {protect} = require("../middleware/userAuthMiddleware");
const { recommendCourses } = require("../controllers/recommendationsController");

router.route("/").get(protect, recommendCourses);

module.exports = router;