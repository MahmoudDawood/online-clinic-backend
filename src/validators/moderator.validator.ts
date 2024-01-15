import { body } from "express-validator";

export const moderatorLoginValidator = [
  body(["username"])
    .isString()
    .trim()
    .toLowerCase()
    .escape()
    .isLength({ min: 3 })
    .withMessage("Must be atleast 3 characters long")
    .isLength({ max: 12 })
    .withMessage("Must be no more than 12 characters long."),
  body("password").isString().isLength({ max: 16, min: 4 }),
];
export const moderatorSignupValidator = [
  body(["username"])
    .isString()
    .trim()
    .toLowerCase()
    .escape()
    .isLength({ min: 3 })
    .withMessage("Must be atleast 3 characters long")
    .isLength({ max: 12 })
    .withMessage("Must be no more than 12 characters long."),
  body("email").isEmail().normalizeEmail(),
  body("password").isString().isLength({ max: 16, min: 4 }),
  body("permissions").isArray({ min: 1 }),
];

export const moderatorUpdateValidator = [
  body(["username"])
    .isString()
    .trim()
    .toLowerCase()
    .escape()
    .isLength({ min: 3 })
    .withMessage("Must be atleast 3 characters long")
    .isLength({ max: 12 })
    .withMessage("Must be no more than 12 characters long.")
    .optional(),
  body("email").isEmail().normalizeEmail().optional(),
  body("password").isString().isLength({ max: 16, min: 4 }).optional(),
  body("permissions").isArray({ min: 1 }).isString().optional(),
];
