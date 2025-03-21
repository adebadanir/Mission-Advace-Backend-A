import jwt from "jsonwebtoken";
import { TokenPayload } from "../model/auth-model";

export class Jwt {
  static generateAccessToken = (payload: TokenPayload) => {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
      expiresIn: "15m",
    });
  };

  static generateRefreshToken = (payload: TokenPayload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
      expiresIn: "1d",
    });
  };

  static verifyAccessToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
  };

  static verifyRefreshToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
  };
}
