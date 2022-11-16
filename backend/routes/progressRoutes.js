const express = require("express");
const router = express.Router();

const {progressCheck, majorProgressCheck, minorProgressCheck} = require("../controllers/progressController");
const {protect} = require("../middleware/userAuthMiddleware");


router.route("/degree").get(protect, progressCheck);
router.route("/major").get(protect, majorProgressCheck);
router.route("/minor").get(protect, minorProgressCheck);
module.exports = router;