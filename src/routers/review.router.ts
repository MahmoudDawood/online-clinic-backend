import { Router } from "express";
import { AppointmentController } from "../controllers/appointment.controller";
import { ReviewController } from "../controllers/review.controller";
import { authorize } from "../utils/authorization";
import { createReviewValidator } from "../validators/review.validator";
const reviewRouter = Router();

reviewRouter.post(
  "/",
  ...createReviewValidator,
  AppointmentController.find,
  ReviewController.create
);
reviewRouter.get("/", ReviewController.findAll);
reviewRouter.get(
  "/doctor/:id",
  // authorize.authorizeUser,
  ReviewController.getByDoctorId
);
reviewRouter.get(
  "/patient",
  authorize.authorizeUser,
  ReviewController.getByPatientId
);
export { reviewRouter };
