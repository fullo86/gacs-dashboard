import ResetPasswordEmail from "@/components/Email/templates/ResetPasswordEmail";
import connectDB from "@/lib/db";
import { sendEmail } from "@/lib/mailer";
import crypto from "crypto";
import { ForgotPasswordSchema } from "@/lib/validation";
import User from "@/models/users/User";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import PasswordReset from "@/models/reset_password/ResetPassword";

export async function POST(req) {
    const transaction = await connectDB.transaction();    
  try {
    const body = await req.json();

    const { email } = ForgotPasswordSchema.parse(body);

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return new Response(
        JSON.stringify({ message: "Email Isn't Registered" }),
        { status: 404 }
      );
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await PasswordReset.create({
      id: uuidv4(),
      user_id: user.id,
      token,
      expires,
      used: 0
    }, { transaction });

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${token}`;
    console.log("Reset link:", resetLink);

    await sendEmail({
      to: user.email,
      subject: "Forgot Password",
      component: (
        <ResetPasswordEmail
          name={user.first_name}
          resetLink={resetLink}
        />
      ),
    });

    await transaction.commit();
    
    return new Response(
      JSON.stringify({ status: true, message: "Link reset password sudah dikirim" }),
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ errors: error.errors }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Terjadi kesalahan server" }),
      { status: 500 }
    );
  }
}
