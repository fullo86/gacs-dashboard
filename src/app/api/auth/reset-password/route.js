import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { ResetPasswordSchema } from "@/lib/validation";
import { Op } from "sequelize";
import PasswordReset from "@/models/reset_password/ResetPassword";
import connectDB from "@/lib/db";

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
      return NextResponse.json({ success: false, mesage: "Token Expired Or Not Valid" }, 
        { status: 400 }
      )      
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    reset.User.password = hashed;
    await reset.User.save();

    reset.used = true;
    await reset.save();
    await transaction.commit();

    return NextResponse.json({ success: true, message: "Password Successfully Changed" }, 
      { status: 200 }
    )
  } catch (error) {
    await transaction.rollback();
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: error.errrors }, 
        { status: 400 }
      )
    }
    console.error(error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, 
      { status: 400 }
    )      
  }
}
