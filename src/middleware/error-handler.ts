import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";
import { ErrorResponse } from "../model/error-model";

// Custom Error Handler
export class AppError extends Error {
  status: number;
  success: string;
  error?: any;

  constructor({ message, status, success, error }: { message: string; status: number; success: string; error?: any }) {
    super(message);
    this.status = status;
    this.success = success;
    this.error = error;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Middleware untuk menangani error
export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  // Jika error yang dilempar adalah instance AppError, gunakan properti-nya
  if (error instanceof AppError) {
    logger.error(`Error ${error.status}: ${error.message} | Path: ${req.path} | Method: ${req.method}`);
    res.status(error.status).json({
      status: error.status,
      success: error.success,
      message: error.message,
    });
  } else {
    res.status(500).json({
      errors: error.message,
    });
  }
};
