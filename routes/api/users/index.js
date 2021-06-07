const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/users");

const validateUser = require("./validation");

router.post("/signup", validateUser, ctrl.reg);
router.post("/login", validateUser, ctrl.login);
router.post("/logout", ctrl.logout);

module.exports = router;
