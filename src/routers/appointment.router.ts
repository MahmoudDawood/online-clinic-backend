import { Router } from "express";
import { AppointmentController } from "../controllers/appointment.controller";
import { auth } from "../utils/authentication";
import { authorize } from "../utils/authorization";
import { appointmentCreateValidator } from "../validators/appointment.validator";

const appointmentRouter = Router();

appointmentRouter.post(
  "/",
  ...appointmentCreateValidator,
  auth.authenticate,
  AppointmentController.create
);

appointmentRouter.get("/", AppointmentController.find);
appointmentRouter.get(
  "/doctor",
  authorize.authorizeUser,
  AppointmentController.findByDoctor
);
appointmentRouter.get(
  "/patient",
  authorize.authorizeUser,
  AppointmentController.findByPatient
);
appointmentRouter.delete("/", AppointmentController.deleteById);
export { appointmentRouter };
