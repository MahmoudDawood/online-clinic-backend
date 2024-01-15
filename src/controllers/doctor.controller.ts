import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { DoctorService } from "../services/doctor.service";

export namespace DoctorController {
  export const signup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Bad Request");
      res.json(errors.array()); // Show the validation errors
      error.name = "Validation Error";
      return next(error);
    }
    try {
      const {
        name,
        email,
        username,
        gender,
        password,
        phoneNumber,
        specialization,
        workingHoursStart,
        workingHoursEnd,
        visitFee = null,
        locationId,
        about,
      } = req.body;
      // NOTE: workingHoursStart, and workingHoursEnd will be sent as strings
      // They must be parsed here
      // (Code for parsing)

      const result = await DoctorService.create({
        name,
        email,
        gender,
        password,
        phoneNumber,
        username,
        specialization,
        workingHoursStart,
        workingHoursEnd,
        visitFee,
        locationId,
        about,
      });
      if (result) {
        return res.json({
          message: "User Signed Up Successfully",
          user: { username: result.username, token: result.token },
        });
      }
    } catch (error) {
      next(error);
    }
  };
  export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Bad Request");
      error.name = "Validation Error";
      next(error);
    }
    try {
      const { username, password } = req.body;
      const token = await DoctorService.login({ username, password });
      return res.json({
        message: "User Logged In Successfully",
        token,
      });
    } catch (error) {
      next(error);
    }
  };
  export const updateById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;
    if (!id) {
      return next(new Error("User id must be provided"));
    }
    try {
      const updateData = req.body;
      const updatedUser = await DoctorService.updateById(id, updateData);
      return res.json({
        message: "User data is updated successfully",
        data: { username: updatedUser.username, email: updatedUser.email },
      });
    } catch (error) {
      next(error);
    }
  };
  export const deleteById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;
    if (!id) {
      return next(new Error("User id must be provided"));
    }
    try {
      await DoctorService.deleteById(id);
      return res.json({ message: "User is deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
  export const findBySpecialization = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const spec = String(req.query.spec);
      const doctors = await DoctorService.findBySpecialization(spec);
      return res.json({ doctors });
    } catch (error: any) {
      next(new Error(error));
    }
  };
  export const findByLocation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const locationId = Number(req.query.location);
      const doctors = await DoctorService.findByLocationId(locationId);
      return res.json({ doctors });
    } catch (error: any) {
      next(new Error(error));
    }
  };
  // export const searchByName = async (
  export const searchByName = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const name = String(req.query.name);
      // const doctors = await DoctorService.searchByName(name);
      const doctors = await DoctorService.searchByName(name);
      return res.json({ doctors });
    } catch (error: any) {
      next(new Error(error));
    }
  };
  export const findAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const doctors = await DoctorService.findAll();
      return res.json({ doctors });
    } catch (error: any) {
      next(new Error(error));
    }
  };
  export const getCardInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
      const page = req.query.page ? Number(req.query.page) : 0;
      const governorate = req.query.governorate
        ? String(req.query.governorate)
        : null;
      const spec = req.query.spec ? String(req.query.spec) : null;
      const search = req.query.search ? String(req.query.search) : null;
      const result = await DoctorService.getCardInfo({
        pageSize,
        page,
        governorate,
        spec,
        search,
      });
      return res.json(result);
    } catch (error: any) {
      next(new Error(error));
    }
  };
  export const findByName = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const name = req.params.name;
      const doctor = await DoctorService.findByName(name);
      res.json({ doctor });
    } catch (error: any) {
      next(new Error(error));
    }
  };

  export const findById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      const doctor = await DoctorService.findById(id);
      res.json({ doctor });
    } catch (error: any) {
      next(new Error(error));
    }
  };

  export const findByToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.body.id);
      const doctorProfile = await DoctorService.findById(id);
      res.json({ doctorProfile });
    } catch (error: any) {
      next(new Error(error));
    }
  };
}
