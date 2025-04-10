const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

exports.signUpBodyValidation = (body) => {
  const schema = Joi.object({
    username: Joi.string()
      .min(3)
      .max(30)
      .pattern(/^[a-zA-Z0-9_]+$/)
      .required()
      .label("Username")
      .messages({
        "string.pattern.base":
          "Username can only contain letters, numbers, and underscores",
      }),

    password: passwordComplexity({
      min: 8,
      max: 26,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
      requirementCount: 4,
    })
      .required()
      .label("Password"),
  });
  return schema.validate(body, {
    abortEarly: false,
  });
};

exports.loginBodyValidation = (body) => {
  const schema = Joi.object({
    username: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(body, {
    abortEarly: false,
  });
};

exports.refreshTokenBodyValidation = (body) => {
  const schema = Joi.object({
    refreshToken: Joi.string().required().label("Refresh Token"),
  });
  return schema.validate(body, {
    abortEarly: false,
  });
};
