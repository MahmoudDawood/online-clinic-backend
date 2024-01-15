import { NextFunction, Request, Response } from "express";
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!err.message) {
    err.message = "Something went wrong!";
  }
  if (err.name === "Validation Error") {
    return res.status(400).json({ message: err.message, stack: err.stack });
  }
  return res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
};
