const Contacts = require("../model/contacts");
const { HttpCode } = require("../helpers/constants");

const getAll = async (req, res, next) => {
  try {
    const data = await Contacts.listContacts();
    return res.json({ status: "success", code: HttpCode.OK, data });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const data = await Contacts.getContactById(req.params.contactId);
    if (data) return res.json({ status: "success", code: HttpCode.OK, data });
    return res.json({
      status: "error",
      code: HttpCode.NOT_FOUND,
      message: "Not Found",
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const data = await Contacts.addContact(req.body);
    return res
      .status(HttpCode.CREATED)
      .json({ status: "success", code: HttpCode.CREATED, data });
  } catch (error) {
    if (error.name === "ValidationError") {
      error.status = HttpCode.BAD_REQUEST;
    }
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const data = await Contacts.removeContact(req.params.contactId);
    if (data)
      return res
        .status(HttpCode.CREATED)
        .json({ status: "success", code: HttpCode.CREATED, data });
    return res.json({ status: "error", code: HttpCode.NOT_FOUND, message: "Not Found" });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const data = await Contacts.updateContact(req.params.contactId, req.body);
    if (data)
      return res
        .status(HttpCode.CREATED)
        .json({ status: "success", code: HttpCode.CREATED, data });
    return res.json({
      status: "error",
      code: HttpCode.NOT_FOUND,
      message: "Not Found",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  remove,
  update,
};
