const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  getMe,
  updateAdmin,
  getUserInfo,
  getUserCourses,
} = require("../controllers/adminController");

const { protect } = require("../middleware/adminAuthMiddleware");
const router = express.Router();

router.post("/", registerAdmin);
router.post("/login", loginAdmin);
router.get("/me", protect, getMe);
router.put("/:id",protect, updateAdmin);
router.get("/getUserInfo",protect, getUserInfo);
router.get("/getUserInfo/courses",protect, getUserCourses);
module.exports = router;
