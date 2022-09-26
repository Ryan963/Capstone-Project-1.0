const express = require("express");
const {
  getDegree,
  createDegree,
  updateDegree,
  deleteDegree,
  getAllDegree
} = require("../controllers/degreeController");
const router = express.Router();

/**
 * Dev notes: Protect not needed since no authentication needed
 * Will we need middleware to verify the user related to the degree?
 */
//const { protect } = require("../middleware/...");


/**
 * CRUD Endpoints
 * To update or delete degree, id is needed
 * Dev notes: Protect taken out for now - will authentication be needed
 */
router.route('/').get(getAllDegree).post(createDegree)
router.route('/:id').put(updateDegree).delete(deleteDegree).get(getDegree)
module.exports = router;