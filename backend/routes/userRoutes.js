const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/userAuthMiddleware");
const adminProtect = require("../middleware/adminAuthMiddleware");
const {
  registerUser,
  loginUser,
  getMe,
  updateUser,
  getAllUsers,
  deleteUser,
  getFutureCourses,
  addFutureCourses,
  removeFutureCourses,
  completeCourse,
} = require("../controllers/userController");

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router
  .route("/futureCourses")
  .get(protect, getFutureCourses)
  .post(protect, addFutureCourses)
  .put(protect, completeCourse)
  .delete(protect, removeFutureCourses);
router.get("/", adminProtect.protect, getAllUsers);
router.put("/:id", adminProtect.protect, updateUser);
router.route("/:id").delete(adminProtect.protect, deleteUser);

module.exports = router;
