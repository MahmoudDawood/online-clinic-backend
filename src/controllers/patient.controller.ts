import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { PatientService } from "../services/patient.service";

export namespace PatientController {
  export const signup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        const error = new Error("Bad Request");
        error.name = "Validation Error";
        throw error;
      }
      let {
        name,
        email,
        password,
        phoneNumber,
        username,
        gender,
        dateOfBirth,
      } = req.body;

      dateOfBirth = new Date(dateOfBirth); // Parse the date string

      const result = await PatientService.create({
        name,
        username,
        email,
        password,
        gender,
        phoneNumber,
        dateOfBirth,
      });
      if (result) {
        res.cookie("jwt", result.token, {
          httpOnly: true,
          maxAge: 12 * 60 * 60 * 1000,
        });
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
      const token = await PatientService.login({ username, password });
      return res.json({
        message: "User Logged In Successfully",
        token,
      });
    } catch (error) {
      next(error);
    }
  };

  export const findById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      const patient = await PatientService.findById(id);
      return res.json({ patient });
    } catch (error) {
      next(error);
    }
  };

  export const findByToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.body.id);
      const patientProfile = await PatientService.findById(id);
      return res.json({ patientProfile });
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
      await PatientService.deleteById(id);
      return res.json({ message: "User is deleted successfully" });
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
      const updatedUser = await PatientService.updateById(id, updateData);
      return res.json({
        message: "User data is updated successfully",
        data: { username: updatedUser.username, email: updatedUser.email },
      });
    } catch (error) {
      next(error);
    }
  };
}
