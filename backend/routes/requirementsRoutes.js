const express = require("express");
const {
  addRequirement,
  deleteRequirement,
} = require("../controllers/requirementsController");

const router = express.Router();

router.route("/").post(addRequirement).delete(deleteRequirement);

module.exports = router;
