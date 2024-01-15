import { body } from "express-validator";

export const createValidator = [
  body(["street", "city", "governorate"])
    .isString()
    .trim()
    .escape()
    .isLength({ min: 3 })
    .withMessage("Must be atleast 3 characters long")
    .isLength({ max: 12 })
    .withMessage("Must be no more than 12 characters long."),
  body("coordinates").isLatLong(),
];

export const updateValidator = [
  body(["street", "city", "governorate"])
    .isString()
    .trim()
    .escape()
    .isLength({ min: 3 })
    .withMessage("Must be atleast 3 characters long")
    .isLength({ max: 12 })
    .withMessage("Must be no more than 12 characters long.")
    .optional(),
  body("coordinates").isLatLong().optional(),
];
