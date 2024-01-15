import { body } from "express-validator";

export const createReviewValidator = [
  body("review").isString().not().isEmpty(),
  body("rating").isNumeric().not().isEmpty(),
];
