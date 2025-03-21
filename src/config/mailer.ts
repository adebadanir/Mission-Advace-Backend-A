import nodemailer from "nodemailer";
import dotenv from "dotenv";
import SMTPTransport from "nodemailer/lib/smtp-transport";

dotenv.config();

const service = process.env.MAILER_SERVICE;
const user = process.env.MAILER_USER;
const pass = process.env.MAILER_PASSWORD;

export const transporter = nodemailer.createTransport({
  service: `${service}`,
  auth: {
    user: `${user}`,
    pass: `${pass}`,
  },
} as SMTPTransport.Options);
