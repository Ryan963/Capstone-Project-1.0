const express = require("express");
const {
  getDegree,
  createDegree,
  updateDegree,
  deleteDegree,
  getAllDegree,
} = require("../controllers/degreeController");
const router = express.Router();
const { protect } = require("../middleware/adminAuthMiddleware");

/**
 * CRUD Endpoints
 * To update or delete degree, id is needed
 * Dev notes: Protect taken out for now - will authentication be needed
 */
router.route("/").get(getAllDegree).post(protect, createDegree);
router
  .route("/:id")
  .put(protect, updateDegree)
  .delete(protect, deleteDegree)
  .get(protect, getDegree);
module.exports = router;
