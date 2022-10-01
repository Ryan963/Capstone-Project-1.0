const Minor = require("../models/minorModel")

// @desc Get minors
// @route GET /api/minors
// @access private
const getMinors = async (req, res) => {
  const minors = await Minor.find()
  res.status(200).json(minors)
}

// @desc add a minor
// @route POST /api/minors
// @access private
const addMinor = async (req, res) => {
  try {
    const { name, requirements } = req.body;
    // name, and requirements required
    if (!name || !requirements) {
      res.status(400)
      throw new Error('Please enter all required fields')
    } 

    // check if minor already exists (check if the minor name already exists)
    const checkMinor = await Minor.findOne({ name });

    if (checkMinor) {
      res.status(400)
      throw new Error("Minor already exists" )
    }

    const minor = await Minor.create({
      name,
      requirements,
      streams: req.body.streams,
    }) 

    res.status(200).json(minor)
  } catch (error) {
    console.log(error);
    res.status(200).json({ success: false, message: error.message });
  }
}


// @desc update a minor
// @route PUT /api/minors/:id
// @access private
const updateMinor = async (req, res) => {
  const minor = await Minor.findById(req.params.id)

  if (!minor) {
    res.status(400)
    throw new Error('Minor not found')
  }

  const updatedMinor = await Minor.findByIdAndUpdate(req.params.id, req.body, {new: true,})
  res.status(200).json(updatedMinor)
}


// @desc Delete minor
// @route DELETE /api/minors/:id
// @access private
const deleteMinor = async (req, res) => {
  const minor = await Minor.findById(req.params.id)

  if (!minor) {
    res.status(400)
    throw new Error('Minor not found')
  }

  await minor.remove()
  res.status(200).json({id: req.params.id})
}


module.exports = {
  getMinors,
  addMinor,
  updateMinor,
  deleteMinor,
}