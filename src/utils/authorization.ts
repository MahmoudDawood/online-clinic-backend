import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
dotenv.config();

export namespace authorize {
  export const authorizeUser = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    try {
      const authorizationHeader = req.headers.authorization;
      const token = authorizationHeader?.split(" ")[1];
      const payload = jwt.verify(
        token as string,
        process.env.JWT_SECRET as string
      ) as JwtPayload;
      req.body.id = payload.id;
      next();
    } catch (err) {
      res.status(401);
      res.json("Access denied, Invalid token: " + err);
    }
  };
}
