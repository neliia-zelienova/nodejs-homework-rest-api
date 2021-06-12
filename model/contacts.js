const Contact = require("./schemas/contact");

const listContacts = async (userID, query) => {
  const result = await Contact.find({ owner: userID, ...query });
  return result;
};

const getContactById = async (userID, contactId) => {
  const result = await Contact.findOne({ _id: contactId, owner: userID });
  return result;
};

const removeContact = async (userID, contactId) => {
  const result = await Contact.findByIdAndRemove({
    _id: contactId,
    owner: userID,
  });
  return result;
};

const addContact = async (body) => {
  const result = await Contact.create(body);
  return result;
};

const updateContact = async (userID, contactId, body) => {
  const result = await Contact.findOneAndUpdate(
    {
      _id: contactId,
      owner: userID,
    },
    { ...body },
    { new: true }
  );
  return result;
};

const updateStatusContact = async (userID, contactId, body) => {
  const result = await Contact.findOneAndUpdate(
    {
      _id: contactId,
    },
    { ...body },
    { new: true }
  );
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
