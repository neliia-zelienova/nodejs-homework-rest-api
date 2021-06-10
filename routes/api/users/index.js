const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/users");
const guard = require("../../../helpers/guard");

const { validateUser, validateSubscription } = require("./validation");

router.post("/signup", validateUser, ctrl.reg);
router.post("/login", validateUser, ctrl.login);
router.post("/logout", guard, ctrl.logout);
router.get("/current", guard, ctrl.current);
router.patch("/", guard, validateSubscription, ctrl.updSubscription);

module.exports = router;
