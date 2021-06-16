const User = require("./schemas/user");

const findById = async (id) => {
  return await User.findOne({ _id: id });
};

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const create = async (options) => {
  const user = new User(options);
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const updateSubscription = async (id, subscription) => {
  const result = await User.findOneAndUpdate(
    { _id: id },
    { subscription },
    { new: true }
  );
  return result;
};

const updateAvatar = async (id, avatarURL) => {
  return await User.updateOne({ _id: id }, { avatarURL });
};

module.exports = {
  findById,
  findByEmail,
  create,
  updateToken,
  updateSubscription,
  updateAvatar,
};
