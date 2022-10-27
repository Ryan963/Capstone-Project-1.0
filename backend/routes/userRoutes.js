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
} = require("../controllers/userController");

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/:id", protect, updateUser);
router.get("/", adminProtect.protect, getAllUsers);

module.exports = router;
