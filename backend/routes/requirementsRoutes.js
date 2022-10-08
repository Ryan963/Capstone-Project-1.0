const express = require("express");
const {
  addRequirement,
  deleteRequirement,
} = require("../controllers/requirementsController");

const router = express.Router();
const { protect } = require("../middleware/adminAuthMiddleware");
router
  .route("/")
  .post(protect, addRequirement)
  .delete(protect, deleteRequirement);

module.exports = router;
