const express = require('express')
const {
  getMajors,
  addMajor,
  updateMajor,
  deleteMajor,
} = require("../controllers/majorController");

const router = express.Router()
const { protect } = require('../middleware/adminAuthMiddleware') // admins can edit majors

router.route('/').get(protect, getMajors).post(protect, addMajor)
router.route('/:id').delete(protect, deleteMajor).put(protect, updateMajor)

module.exports = router