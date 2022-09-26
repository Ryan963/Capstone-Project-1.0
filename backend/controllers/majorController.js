const Major = require("../models/majorModel")

// @desc Get majors
// @route GET /api/majors
// @access private
const getMajors = async (req, res) => {
  const majors = await Major.find()
  res.status(200).json(majors)
}

// @desc add major
// @route POST /api/majors
// @access private
const addMajor = async (req, res) => {
  try {
    const { name, requirements } = req.body;
    // name, and requirements required
    if (!name || !requirements) {
      res.status(400)
      throw new Error('Please enter all required fields')
    } 

    // check if major already exists (check if major name already exists)
    const checkMajor = await Major.findOne({ name });
    if (checkMajor) {
      res.status(400)
      throw new Error("Major already exists" )
    }

    const major = await Major.create({
      name,
      requirements,
      streams: req.body.streams,
    }) 

    res.status(200).json(major)
  } catch (error) {
    console.log(error);
    res.status(200).json({ success: false, message: error.message });
  }
}

// @desc update major
// @route PUT /api/majors/:id
// @access private
const updateMajor = async (req, res) => {
  const major = await Major.findById(req.params.id)
  if (!major) {
    res.status(400)
    throw new Error('Goal not found')
  }

  const updatedMajor = await Major.findByIdAndUpdate(req.params.id, req.body, {new: true,})
  res.status(200).json(updatedMajor)
}

// @desc Delete major
// @route DELETE /api/majors/:id
// @access private
const deleteMajor = async (req, res) => {
  const major = await Major.findById(req.params.id)
  if (!major) {
    res.status(400)
    throw new Error('Major not found')
  }

  await major.remove()
  res.status(200).json({id: req.params.id})
}

module.exports = {
  getMajors,
  addMajor,
  updateMajor,
  deleteMajor,
}