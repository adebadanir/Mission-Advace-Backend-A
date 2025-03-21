import { NextFunction, Request, Response } from "express";
import { AuthService } from "../service/auth-service";
import { AppError } from "../middleware/error-handler";
import { Jwt } from "../util/jwt";

import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";

export class AuthController {
  static register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { fullname, username, email, password } = req.body;
      const uuid = uuidv4();
      const userExisting = await AuthService.findOneByEmail(email);

      if (userExisting && userExisting.email === email) {
        throw new AppError({
          status: 400,
          success: "failed",
          message: "Email already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const info = await AuthService.sendEmailVerification(email, uuid);

      if (!info) {
        throw new AppError({
          status: 500,
          success: "failed",
          message: "Failed to send email verification",
        });
      }

      await AuthService.create({
        fullname,
        username,
        email,
        password: hashedPassword,
        token: uuid,
      });

      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

      res.status(201).json({
        status: 201,
        success: "success",
        message: "User successfully registered, please check your email to verify your account",
      });
    } catch (error) {
      next(error);
    }
  };

  static login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
      const existingUser = await AuthService.findOneByEmail(email);

      if (!existingUser.id || !existingUser.fullname || !existingUser.username || !existingUser.email || !existingUser.password) {
        throw new AppError({
          status: 404,
          success: "failed",
          message: "User data not found",
        });
      }
      if (!existingUser.verified) {
        throw new AppError({
          status: 401,
          success: "failed",
          message: "Please verify your email",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, existingUser.password);

      if (existingUser.email !== email || !isPasswordValid) {
        throw new AppError({
          status: 401,
          success: "failed",
          message: "Invalid email or password",
        });
      }

      const accessToken = Jwt.generateAccessToken({
        id: existingUser.id,
        fullname: existingUser.fullname,
        username: existingUser.username,
        email: existingUser.email,
      });
      const refreshToken = Jwt.generateRefreshToken({
        id: existingUser.id,
        fullname: existingUser.fullname,
        username: existingUser.username,
        email: existingUser.email,
      });

      res.cookie("refreshToken", refreshToken, {
        // httpOnly: true,
        // secure: true,
        // sameSite: "none",
      });

      res.status(200).json({
        status: 200,
        success: "success",
        message: "User successfully logged in",
        data: {
          id: existingUser.id,
          fullname: existingUser.fullname,
          username: existingUser.username,
          email: existingUser.email,
          accessToken: accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  static logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("refreshToken");
      res.status(200).json({
        status: 200,
        success: "success",
        message: "User successfully logged out",
      });
    } catch (error) {
      next(error);
    }
  };

  static refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        throw new AppError({
          status: 401,
          success: "failed",
          message: "Access Denied: No token provided",
        });
      }

      const decoded = Jwt.verifyRefreshToken(refreshToken);
      if (typeof decoded === "string") {
        throw new AppError({
          status: 401,
          success: "failed",
          message: "Access Denied: Invalid token",
        });
      }

      const accessToken = Jwt.generateAccessToken({
        id: decoded.id,
        fullname: decoded.fullname,
        username: decoded.username,
        email: decoded.email,
      });

      res.status(200).json({
        status: 200,
        success: "success",
        message: "Token successfully refreshed",
        data: {
          accessToken: accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  static verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.params;
      if (!token) {
        throw new AppError({
          status: 404,
          success: "failed",
          message: "Invalid token",
        });
      }

      const user = await AuthService.findOneByToken(token);
      if (!user) {
        throw new AppError({
          status: 404,
          success: "failed",
          message: "User not found",
        });
      }

      if (user.verified) {
        throw new AppError({
          status: 400,
          success: "failed",
          message: "User already verified",
        });
      }

      await AuthService.verifyEmail(token);

      res.status(200).json({
        status: 200,
        success: "success",
        message: "User successfully verified",
      });
    } catch (error) {
      next(error);
    }
  };
}
