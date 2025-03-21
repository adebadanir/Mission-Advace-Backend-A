import { db } from "../config/db";
import { v4 as uuidv4 } from "uuid";
import { RegisterRequest, UserType } from "../model/auth-model";
import { RowDataPacket } from "mysql2";
import { transporter } from "../config/mailer";

import dotenv from "dotenv";

dotenv.config();

export class AuthService {
  static create = async (user: RegisterRequest): Promise<UserType> => {
    const uuid = uuidv4();
    const result = await db.query("INSERT INTO users (id, fullname, username, email, password, token) VALUES (?, ?, ?, ?, ?, ?)", [
      uuid,
      user.fullname,
      user.username,
      user.email,
      user.password,
      user.token,
    ]);
    return result as UserType;
  };

  static findOneByEmail = async (email: string): Promise<UserType> => {
    const [result] = await db.query<RowDataPacket[]>(
      "SELECT id, fullname, username, email, password, verified FROM users WHERE email = ? AND deleted_at IS NULL LIMIT 1",
      [email]
    );
    return result[0] as UserType;
  };

  static findOneById = async (id: string): Promise<UserType> => {
    const [result] = await db.query<RowDataPacket[]>("SELECT id, fullname, username, email, token FROM users WHERE id = ? WHERE deleted_at IS NULL", [id]);
    return result[0] as UserType;
  };

  static findOneByToken = async (token: string): Promise<UserType> => {
    const [result] = await db.query<RowDataPacket[]>("SELECT id, fullname, username, email, token FROM users WHERE token = ? AND deleted_at IS NULL", [token]);
    return result[0] as UserType;
  };

  static verifyEmail = async (token: string): Promise<UserType> => {
    const [result] = await db.query<RowDataPacket[]>("UPDATE users SET verified = TRUE WHERE token = ? AND deleted_at IS NULL", [token]);
    return result[0] as UserType;
  };
  static sendEmailVerification = async (email: string, token: string) => {
    const option = {
      from: (("noreply <" + process.env.MAILER_USER) as string) + ">",
      to: email as string,
      subject: "Email Verification",
      html: `<p>Click the link below to verify your email address:</p>
      <p><a href="http://localhost:3000/auth/verify-email/${token}">Verify Email</a></p>`,
    };
    const info = await transporter.sendMail(option);
    return info;
  };
}
