const express = require('express')

const {
  getMinors,
  addMinor,
  updateMinor,
  deleteMinor,
} = require("../controllers/minorController");

const router = express.Router()
const { protect } = require('../middleware/adminAuthMiddleware') // admins can edit Minor

router.route('/').get(protect, getMinors).post(protect, addMinor)
router.route('/:id').delete(protect, deleteMinor).put(protect, updateMinor)

module.exports = router