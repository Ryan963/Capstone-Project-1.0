const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

const Admin = require("../models/adminModel");
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
    if (admin && bcrypt.compare(password, admin.password)) {
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
};
