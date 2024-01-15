import { Router } from "express";
import { LocationController } from "../controllers/location.controller";
import {
  createValidator,
  updateValidator,
} from "../validators/location.validator";
const locationRouter = Router();

locationRouter.get("/", LocationController.getAll);
locationRouter.get("/:id", LocationController.getById);
locationRouter.post("/", ...createValidator, LocationController.create);
locationRouter.put("/:id", ...updateValidator, LocationController.updateById);
locationRouter.delete("/:id", LocationController.deleteById);

export { locationRouter };
