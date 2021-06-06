const Contacts = require("../model/contacts");

const getAll = async (req, res, next) => {
  try {
    const data = await Contacts.listContacts();
    return res.json({ status: "success", code: 200, data });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const data = await Contacts.getContactById(req.params.contactId);
    if (data) return res.json({ status: "success", code: 200, data });
    return res.json({ status: "error", code: 404, message: "Not Found" });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const data = await Contacts.addContact(req.body);
    return res.status(201).json({ status: "success", code: 201, data });
  } catch (error) {
    if (error.name === "ValidationError") {
      error.status = 400;
    }
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const data = await Contacts.removeContact(req.params.contactId);
    if (data)
      return res.status(201).json({ status: "success", code: 201, data });
    return res.json({ status: "error", code: 404, message: "Not Found" });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const data = await Contacts.updateContact(req.params.contactId, req.body);
    if (data)
      return res.status(201).json({ status: "success", code: 201, data });
    return res.json({ status: "error", code: 404, message: "Not Found" });
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
