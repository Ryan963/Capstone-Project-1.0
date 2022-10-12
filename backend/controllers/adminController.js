const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

const Admin = require("../models/adminModel");

const User = require("../models/userModel");

const asyncHandler = require('express-async-handler');

//@desc Update admin
//@route PUT /api/admin/id
//@access private = requires password/token to update admin info
/** Dev notes: An admin can only update their own info */
const updateAdmin = asyncHandler(async(req,res)=>{

  try {
    const { email, firstname, lastname, password } = req.body;
    if (!email || !firstname || !lastname || !password) {
      res.status(400).json({ message: "Please add all required fields" });
    }

    //Find logged in admin or throw error if not fouund
    const adminLoggedIn = await Admin.findById(req.params.id)
    if(!adminLoggedIn){
      res.status(400)
      throw new Error('Administrator not found')
    }

    /* Dev note: Need to add protection to ensure that one admin
     * is not able to update another admin's info unless
     * that is part of design
     * Maybe change endpoint to login?/
    */
    //const adminToUpdate = await Admin.find({email : email.toString()})
    //console.log(adminToUpdate.email.toString())
    if(adminLoggedIn.email.toString() !== email.toString()){
            res.status(401)
            throw new Error('You can only update your account')
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //update admin
    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, 
      { firstname,
        lastname,
        email,
        password: hashedPassword,
      },{new:true})                                                          
    res.status(200).json(updatedAdmin)

  } catch (error) {
    console.log(error);
    res.status(200).json({ success: false, message: error.message });
  }
})

/**
 * Francis O
 * 632c9a96ee9e48a55aeb56f7
 * eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzMmM5YTk2ZWU5ZTQ4YTU1YWViNTZmNyIsImlhdCI6MTY2NTUzMzY4NywiZXhwIjoxNjY1NTU1Mjg3fQ.XUprK1oB0YqE2ce-6z8UD4vZGXHlAby24qER9F4Vqco
 * *
 */


// @desc register  admin
// @route POST /api/admin
// @access public

const registerAdmin = async (req, res) => {
  try {
    const { email, firstname, lastname, password } = req.body;
    if (!email || !firstname || !lastname || !password) {
      res.status(400).json({ message: "Please add all required fields" });
    }

    // check if admin is already registered
    const checkAdmin = await Admin.findOne({ email });
    if (checkAdmin) {
      res.status(400).json({ success: false, message: "Admin exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await Admin.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    if (admin) {
      res.status(200).json({
        success: true,
        message: "Admin registered",
        token: generateToken(admin._id),
      });
    } else {
      res.status(200).json({ success: false, message: "Invalid data" });
    }
  } catch (error) {
    console.log(error);
    res.status(200).json({ success: false, message: error.message });
  }
};

// @desc login admin
// @route POST /api/admin/login
// @access public

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    // check if admin exists nad compare passwords
    if (admin && await bcrypt.compare(password, admin.password)) {
      res
        .status(200)
        .json({ success: true, admin: admin, token: generateToken(admin._id) });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(200).json({ success: false, message: error.message });
  }
};

// function to access protected routes that are only accessible by admin
// should run after the middleware that will verify the token
const getMe = async (req, res) => {
  const admin = await Admin.findById(req.admin.id).select("-password");
  res.status(200).json({ success: true, admin: admin });
};

// @desc get user info
// @route GET /api/admin/getUser
// @access private
const getUserInfo = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({email});
    // check if admin exists nad compare passwords
    if (user) {
      res.status(200).json({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        degree: user.degree
    });
      /*res
        .status(200)
        .json({success: true, user: user});*/
    } else {
      res.status(400).json({ message: "User Not Found" });
    }
  } catch (error) {
    res.status(200).json({ success: false, message: error.message });
  }
};

// @desc get user info
// @route GET /api/admin/getUserInfo/courses
// @access private
const getUserCourses = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({email});
    // check if admin exists nad compare passwords
    if (user) {
      res.status(200).json({
        course: user.courses,
    });
    } else {
      res.status(400).json({ message: "User Not Found" });
    }
  } catch (error) {
    res.status(200).json({ success: false, message: error.message });
  }
};

// helper function to generates token on register or login
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_ADMIN_SECRET, {
    expiresIn: "6h",
  });
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getMe,
  updateAdmin,
  getUserInfo,
  getUserCourses,
};
