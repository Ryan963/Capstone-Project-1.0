const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");
const Degree = require('../models/degreeModel');
const asyncHandler = require('express-async-handler');


//@desc Gets ALL Degrees based on id
//@route GET /api/degree
//@access public - Should this be public?
const getAllDegree = asyncHandler( async(req,res) => {
    const degrees = await Degree.find()
    res.status(200).json(degrees)
})

//@desc Gets ONE Degree based on id
//@route GET /api/degree
//@access public - Should this be public?
/**Dev note: Make sure degree has id connected to it somewhere in front end */
const getDegree = asyncHandler( async (req,res) => {
    //const degreeName = req.body
    const searchOneDegree = await Degree.findById(req.params.id)
    res.status(200).json(searchOneDegree)
})

//@desc Create Degree. Creates a new degree entry in
//@route POST /api/degree
//@access public - Should this be public?
const createDegree = asyncHandler (async (req,res) => {
    const {name,requirement} = req.body
    //Checks to make sure no fields are empty
    if(!name || !requirement) {
        res.status(400) /**Dev notes: add error handler middleware */
        throw new Error('Please add fields')
    }

    //Check if degree already exists
    const degreeExists = await Degree.findOne({name})
    if(degreeExists){
        res.status(400)
        throw new Error('Cannot add Degree. Degree is already added.')
    }

    //Creates degree
    const degree = await Degree.create({
        name,
        requirement
    })

    //Checks if user is created so send 200, if not then throw error
    if(degree){
        res.status(201).json({
            _id: degree.id,
            name: degree.name,
            requirement: degree.requirement,
            //token: generateToken(user._id)//passes id into generate id token
        })
    } else {
        res.status(400)
            throw new Error('Invalid User Data')
        
    }

})

//@desc Update Degree
//@route POST /api/degree/id
//@access public - Should this be public?
const updateDegree = asyncHandler( async(req,res) => {
    const degree = await Degree.findById(req.params.id)

    if(!degree){
        res.status(400)
        throw new Error('Degree not found')
    }

    const updatedDegree = await Degree.findByIdAndUpdate(req.params.id, req.body, {new:true})
    res.status(200).json(updatedDegree)
})


//@desc Delete Degree
//@route POST /api/degree/id
//@access public - Should this be public?
const deleteDegree = asyncHandler( async (req,res) => {
    const degree = await Degree.findById(req.params.id)

    if(!degree){
        res.status(400)
        throw new Error('Degree not found')
    }
    const degreeName = degree.name
    await degree.remove()
    
    res.status(200).json({message: `Degree: ${degreeName} deleted`})

})

module.exports ={
    getAllDegree,
    getDegree,
    createDegree,
    updateDegree,
    deleteDegree
}