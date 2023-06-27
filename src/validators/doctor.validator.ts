import { body } from "express-validator";

export const doctorLoginValidator = [
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

export const doctorSignupValidator = [
  body(["name", "username"])
    .isString()
    .trim()
    .toLowerCase()
    .escape()
    .isLength({ min: 3 })
    .withMessage("Must be atleast 3 characters long")
    .isLength({ max: 12 })
    .withMessage("Must be no more than 12 characters long."),
  body("email").isEmail().normalizeEmail(),
  body("gender").isIn(["male", "female"]), // added
  body("password").isString().isLength({ max: 16, min: 4 }),
  body("phoneNumber").isMobilePhone("ar-EG"),
  body("specialization").isString(),
  body("visitFee").isFloat().optional(), // updated
  body("locationId").isNumeric().notEmpty(),
];
export const doctorUpdateValidator = [
  body(["firstName", "lastName", "username"])
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
  body("phoneNumber").isMobilePhone("ar-EG").optional(),
  body("specialization").isString().optional(),
  body("visitFee").isFloat().optional().optional(),
  body("locationId").isString().notEmpty().optional(),
];
