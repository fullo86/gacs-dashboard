import { NextResponse } from "next/server";
import bcrypt from "bcrypt"; 
import { z } from "zod";
import connectDB from "@/lib/db";
import User from "@/models/users/User";
import { ChangePasswordSchema } from "@/lib/validation";

export async function PATCH(req) {
  const transaction = await connectDB.transaction();
  try {
    const body = await req.json();
    const { new_password } = ChangePasswordSchema.parse(body);

    const user_id = body.user_id;
    const user = await User.findOne({ where: { id: user_id } });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const isOldPasswordCorrect = await bcrypt.compare(body.old_password, user.password);
    
    if (!isOldPasswordCorrect) {
      return NextResponse.json(
        { success: false, message: "Old password is incorrect" },
        { status: 400 }
      );
    }
    const hashedNewPassword = await bcrypt.hash(new_password, 12);

    await user.update(
      { password: hashedNewPassword },
      { transaction }
    );

    await transaction.commit();

    return NextResponse.json(
      { success: true, message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    await transaction.rollback();
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
