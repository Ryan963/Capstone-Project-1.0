const express = require("express");
const router = express.Router();

const {progressCheck} = require("../controllers/progressController");
const {protect} = require("../middleware/userAuthMiddleware");


router.route("/").get(protect, progressCheck);

module.exports = router;