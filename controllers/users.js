const Users = require("../model/users");
const jwt = require("jsonwebtoken");
const UploadAvatar = require("../services/upload-avatars-local");
require("dotenv").config();
const { HttpCode } = require("../helpers/constants");
const EmailService = require("../services/email");
const { CreateSenderNM } = require("../services/email-sender");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const USERS_AVATARS = process.env.USERS_AVATARS;

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
    const { id, email, subscription, avatarURL, verifyToken } = newUser;
    try {
      const emailService = new EmailService(
        process.env.NODE_ENV,
        new CreateSenderNM()
      );
      await emailService.sendVerifyEmail(verifyToken, email);
    } catch (error) {
      console.log(error.message);
    }

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
    if (!user.verify) {
      return res.status(HttpCode.BAD_REQUEST).json({
        status: "error",
        code: HttpCode.BAD_REQUEST,
        message: "Verify your email!",
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
    const id = req.user.id;
    const uploads = new UploadAvatar(USERS_AVATARS);
    const avatarUrl = await uploads.saveAvatarToStatic({
      userId: id,
      filePath: req.file.path,
      name: req.file.filename,
      oldFile: req.user.avatarURL,
    });
    await Users.updateAvatar(id, avatarUrl);
    return res.json({
      status: "success",
      code: HttpCode.OK,
      data: { avatarUrl },
    });
  } catch (e) {
    next(e);
  }
};

const verify = async (req, res, next) => {
  try {
    const user = await Users.findByVerifyToken(req.params.verifyToken);
    if (user) {
      await Users.updateVefiryToken(user._id, null, true);
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        message: "Verification successful",
      });
    } else {
      return res.status(HttpCode.NOT_FOUND).json({
        status: "error",
        code: HttpCode.NOT_FOUND,
        message: "User not found",
      });
    }
  } catch (e) {
    next(e);
  }
};
const repeatVerify = async (req, res, next) => {
  const user = await Users.findByEmail(req.body.email);
  if (user) {
    const { email, verifyToken, verify } = user;
    if (verify)
      return res.status(HttpCode.BAD_REQUEST).json({
        status: "error",
        code: HttpCode.BAD_REQUEST,
        message: "Verification has already been passed",
      });
    else {
      try {
        const emailService = new EmailService(
          process.env.NODE_ENV,
          new CreateSenderNM()
        );
        await emailService.sendVerifyEmail(verifyToken, email);
      } catch (error) {
        console.log(error.message);
      }
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        message: "Verification email sent",
      });
    }
  }
};

module.exports = {
  reg,
  login,
  logout,
  current,
  updSubscription,
  avatars,
  verify,
  repeatVerify,
};
