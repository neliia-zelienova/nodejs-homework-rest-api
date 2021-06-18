const Joi = require("joi");
const { Subscription } = require("../../../helpers/constants");

const emailPattern = /\S+@\S+.\S+/;

const schemaUser = Joi.object({
  email: Joi.string()
    .regex(emailPattern)
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "uk"] },
    })
    .required(),
  password: Joi.string().required(),
});

const schemaSubscription = Joi.object({
  subscription: Joi.string()
    .valid(...Object.values(Subscription))
    .required(),
});

const schemaRepeatedValidateUser = Joi.object({
  email: Joi.string()
    .regex(emailPattern)
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "uk", "ua"] },
    })
    .required(),
});

const validate = async (schema, body, next) => {
  console.log("In validate function");
  try {
    await schema.validateAsync(body);
    next();
  } catch (err) {
    next({ status: 400, message: `Field ${err.message.replace(/"/g, "")}` });
  }
};

const validateUser = (req, _res, next) => {
  return validate(schemaUser, req.body, next);
};

const validateSubscription = (req, _res, next) => {
  return validate(schemaSubscription, req.body, next);
};

const validateEmail = (req, _res, next) => {
  return validate(schemaRepeatedValidateUser, req.body, next);
};

module.exports = { validateUser, validateSubscription, validateEmail };
