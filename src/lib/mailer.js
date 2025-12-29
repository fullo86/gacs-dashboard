import { render } from "@react-email/render";
import { Resend } from "resend";

export async function sendEmail({
  to,
  subject,
  component,
}) {
  return Resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html: render(component),
  });
}

// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export default transporter;
