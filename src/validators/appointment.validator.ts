import { body } from "express-validator";

export const appointmentCreateValidator = [
  body(["doctorId"]).isInt().notEmpty(),
  body("type").isString().notEmpty(),
];
