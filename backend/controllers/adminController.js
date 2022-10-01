const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

const Admin = require("../models/adminModel");

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
 * eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzMmM5YTk2ZWU5ZTQ4YTU1YWViNTZmNyIsImlhdCI6MTY2Mzg4ODQ1MywiZXhwIjoxNjYzOTEwMDUzfQ.6PRYDyNNzGy-hXHzp_qF8pyCKE0GW1RKj4teQpWOO30
 *
 */

 /**
  * Test Profile
  * id: 6331e4376160a018bd4058f5
  * eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzMzFlNDM3NjE2MGEwMThiZDQwNThmNSIsImlhdCI6MTY2NDQxMjg5OSwiZXhwIjoxNjY0NDM0NDk5fQ.vV7V1jyOMF3oD85bxEy1ROeBxWPM-w_6iB7wLz29x6g
  * 
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
};
