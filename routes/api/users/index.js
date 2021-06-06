const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/users");

router.post("/registration", ctrl.reg);
router.post("/login", ctrl.login);
router.post("/logout", ctrl.logout);

module.exports = router;
