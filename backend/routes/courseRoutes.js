const express = require("express");
const router = express.Router();
const {getCourses, createCourse, deleteCourse, updateCourse} = require("../controllers/courseController");
const {protect} = require("../middleware/adminAuthMiddleware"); // admin can create/delete courses

router.route("/").get(getCourses).post(protect, createCourse);
router.route("/:id").delete(protect, deleteCourse).put(protect, updateCourse);


module.exports = router;