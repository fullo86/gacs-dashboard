import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import connectDB from "@/lib/db";
import { sendEmail } from "@/lib/mailer";
import { ForgotPasswordSchema } from "@/lib/validation";
import User from "@/models/users/User";
import ResetPasswordEmail from "@/components/Email/templates/ResetPasswordEmail";
import PasswordReset from "@/models/reset_password/ResetPassword";

export async function POST(req) {
    const transaction = await connectDB.transaction();    

  try {
    const body = await req.json();

    const { email } = ForgotPasswordSchema.parse(body);

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return NextResponse.json({ success: false, status_code: StatusCodes.NOT_FOUND, message: "Email Isn't Registered" }, 
        { status: StatusCodes.NOT_FOUND }
      )    
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

    await sendEmail({
      to: user.email,
      subject: "Forgot Password",
      component: (
        <ResetPasswordEmail
          name={user.first_name}
          resetLink={resetLink}
        />
      ),
    }, { transaction });

    await transaction.commit();
    
    return NextResponse({ success: true, status_code: StatusCodes.OK, message: "Reset Link Successfully Send to Email" }, 
      { status: StatusCodes.OK }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse({ success:false, status_code: StatusCodes.BAD_REQUEST, message: error.errrors }, 
        { status: StatusCodes.BAD_REQUEST }
    )}

    return NextResponse({ success: false, status_code: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Internal Server Error' }, 
      { status: StatusCodes.INTERNAL_SERVER_ERROR })
  }
}
