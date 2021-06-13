const Users = require("../model/users");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { HttpCode } = require("../helpers/constants");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const reg = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: "error",
        code: HttpCode.CONFLICT,
        message: "Email in use",
      });
    }
    const newUser = await Users.create(req.body);
    const { id, email, subscription, avatarURL } = newUser;
    return res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      data: { id, email, subscription, avatarURL },
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    const isValidPassword = await user?.validPassword(password);
    if (!user || !isValidPassword) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Email or password is wrong",
      });
    }

    const payload = { id: user.id };
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "2h" });
    await Users.updateToken(user.id, token);
    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: { token },
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await Users.findById(userId);
    console.log("logout", userId, user);
    if (!user) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Not authorized",
      });
    }

    await Users.updateToken(user.id, null);
    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
    });
  } catch (e) {
    next(e);
  }
};

const current = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const user = await Users.findById(userId);
    if (user) {
      const { subscription, email } = user;
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        data: { email, subscription },
      });
    } else {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Not authorized",
      });
    }
  } catch (e) {
    next(e);
  }
};

const updSubscription = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const data = await Users.updateSubscription(userId, req.body.subscription);
    if (data) {
      const { subscription, email } = data;
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        data: { subscription, email },
      });
    } else {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Not authorized",
      });
    }
  } catch (e) {
    next(e);
  }
};

const avatars = async (req, res, next) => {
  try {
    return res.json({});
  } catch (e) {
    next(e);
  }
};

module.exports = {
  reg,
  login,
  logout,
  current,
  updSubscription,
  avatars,
};
