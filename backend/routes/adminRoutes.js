const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  getMe,
  updateAdmin,
} = require("../controllers/adminController");

const { protect } = require("../middleware/adminAuthMiddleware");
const router = express.Router();

router.post("/", registerAdmin);
router.post("/login", loginAdmin);
router.get("/me", protect, getMe);
router.put("/:id",protect, updateAdmin);
module.exports = router;
