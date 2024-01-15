import { Request, Response, NextFunction } from "express";
import { LocationService } from "../services";
import { validationResult } from "express-validator";

export namespace LocationController {
  export const getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const locations = await LocationService.getAll();
      return res.json({ locations });
    } catch (error) {
      next(error);
    }
  };
  export const getById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;
      const location = await LocationService.getById(id);
      return res.json({ location });
    } catch (error) {
      next(error);
    }
  };

  export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error();
        error.name = "Validation Error";
        error.message = "Cannot create location, the provided data is invalid";
        throw error;
      }
      const { street, city, coordinates, governorate } = req.body;
      const locationData = {
        street,
        city,
        governorate,
        coordinates,
      };
      const newLocation = await LocationService.create(locationData);
      return res.json({ newLocation });
    } catch (error) {
      next(error);
    }
  };

  export const updateById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error();
        error.name = "Validation Error";
        error.message = "Cannot update location, the provided data is invalid";
        throw error;
      }
      const id = req.params.id;
      const updateData = req.body;
      const updatedLocation = await LocationService.updateById(id, updateData);
      return res.json({ updatedLocation });
    } catch (error) {
      next(error);
    }
  };

  export const deleteById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;
      const deletedLocation = await LocationService.deleteById(id);
      return res.status(202).json({ deletedLocation });
    } catch (error) {
      next(error);
    }
  };
}
