import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { AppointmentService } from "../services/appointment.service";
import { bookingSMS, cancelationSMS } from "../utils/sms";

export namespace AppointmentController {
  export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const errors = validationResult(req);
      const { doctorId, type, prescriptionId, patientId, at } = req.body;
      if (!errors.isEmpty()) {
        const error = new Error("Bad Request");
        error.name = "Validation Error";
        throw error;
        // next(error); Executes the create service anyway
      }
      const newAppointment = await AppointmentService.create({
        doctorId,
        type,
        prescriptionId,
        patientId,
        at,
      });
      await bookingSMS(doctorId, patientId, at);
      return res.json({ newAppointment });
    } catch (error: any) {
      next(error);
    }
  };

  // Extra utility to authorize reviewers who had a past appointment only.
  export const find = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { doctorId, patientId } = req.body;
      const appointments = await AppointmentService.find({
        doctorId,
        patientId,
      });
      if (appointments.length == 0) {
        throw new Error(
          "Not authorized for a review, finish your first appointment"
        );
      }
      // res.json({ appointments });
      next();
    } catch (error: any) {
      next(error);
    }
  };

  export const findByDoctor = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const doctorId = parseInt(req.params.id);
      const appointments = await AppointmentService.findByDoctor({
        doctorId,
      });
      res.json({ appointments });
    } catch (error: any) {
      next(error);
    }
  };

  export const findByPatient = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const patientId = req.body.id;
      const appointments = await AppointmentService.findByPatient({
        patientId,
      });
      res.json({ appointments });
    } catch (error: any) {
      next(error);
    }
  };

  export const deleteById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const appointmentId = parseInt(req.body.id);
      if (!appointmentId) {
        // Doesn't handle starting at id = 0
        throw new Error("Provide an appointment id in request body");
      }
      const deletedAppointment = await AppointmentService.deleteById(
        appointmentId
      );
      res.json({ deletedAppointment });
      const { doctorId, patientId, at } = deletedAppointment;
      await cancelationSMS(doctorId, patientId, at);
    } catch (error: any) {
      next(error);
    }
  };
}
