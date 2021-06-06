const express = require("express");
const router = express.Router();
const { validateContact, validateFavorite } = require("./validation");
const ctrl = require("../../../controllers/contacts");
const guard = require("../../../helpers/guard");

router.get("/", guard, ctrl.getAll);

router.get("/:contactId", guard, ctrl.getById);

router.post("/", guard, validateContact, ctrl.create);

router.delete("/:contactId", guard, ctrl.remove);

router.put("/:contactId", guard, validateContact, ctrl.update);

router.patch("/:contactId/favorite", guard, validateFavorite, ctrl.update);

module.exports = router;
