import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { AppError } from "./error-handler";

export class AuthMiddleware {
  static jwtVerify = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header("Authorization");
    const refreshToken = req.cookies.refreshToken;

    try {
      if (!authHeader || !authHeader.startsWith("Bearer ") || !refreshToken) {
        return next(
          new AppError({
            status: 401,
            success: "failed",
            message: "Access Denied: No token provided",
          })
        );
      }
      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as jwt.JwtPayload;

      (req as any).user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
}
