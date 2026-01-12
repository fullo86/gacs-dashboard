import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import connectDB from "@/lib/db";
import { ResetPasswordSchema } from "@/lib/validation";
import PasswordReset from "@/models/reset_password/ResetPassword";

export async function POST(req) {
  const transaction = await connectDB.transaction();
  try {
    const body = await req.json();
    const { token, newPassword } = ResetPasswordSchema.parse(body);

    const reset = await PasswordReset.findOne({
      where: {
        token,
        used: 0,              
        expires: { [Op.gt]: new Date() },
      }
    }, { transaction });

    if (!reset) {
      await transaction.rollback();
      return NextResponse.json({ success: false, status_code: StatusCodes.UNAUTHORIZED , message: "Token Expired Or Not Valid" }, 
        { status: StatusCodes.UNAUTHORIZED }
      )      
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    reset.User.password = hashed;
    await reset.User.save();

    reset.used = true;
    await reset.save();
    await transaction.commit();

    return NextResponse.json({ success: true, status_code: StatusCodes.OK, message: "Password Successfully Changed" }, 
      { status: StatusCodes.OK }
    )
  } catch (error) {
    await transaction.rollback();
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, status_code: StatusCodes.BAD_REQUEST, message: error.errrors }, 
        { status: StatusCodes.BAD_REQUEST }
      )
    }
    console.error(error);
    return NextResponse.json({ success: false, status_code: StatusCodes.INTERNAL_SERVER_ERROR, message: "Internal Server Error" }, 
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    )      
  }
}
