const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/users");
const guard = require("../../../helpers/guard");
const upload = require("../../../helpers/uploads");

const {
  validateUser,
  validateSubscription,
  validateEmail,
} = require("./validation");

router.get("/verify/:verifyToken", ctrl.verify);
router.post("/verify", validateEmail, ctrl.repeatVerify);
router.post("/signup", validateUser, ctrl.reg);
router.post("/login", validateUser, ctrl.login);
router.post("/logout", guard, ctrl.logout);
router.get("/current", guard, ctrl.current);
router.patch("/", guard, validateSubscription, ctrl.updSubscription);
router.patch("/avatars", [guard, upload.single("avatar")], ctrl.avatars);

module.exports = router;
