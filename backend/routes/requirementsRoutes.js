const express = require("express");
const {
  addRequirement,
  deleteRequirement,
  updateRequirement,
} = require("../controllers/requirementsController");

const router = express.Router();
const { protect } = require("../middleware/adminAuthMiddleware");
router
  .route("/")
  .post(protect, addRequirement)
  .delete(protect, deleteRequirement)
  .put(protect, updateRequirement);

module.exports = router;
