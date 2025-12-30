import nodemailer from "nodemailer";
import { render } from "@react-email/render";

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: Number(process.env.MAILTRAP_PORT), // pastikan Number
  secure: false, // penting untuk port 2525/587
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

export async function sendEmail({ to, subject, component }) {
  const htmlString = await render(component); // pastikan hasilnya string
  console.log("typeof htmlString:", typeof htmlString); // harus "string"
  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html: htmlString,
  });
}
