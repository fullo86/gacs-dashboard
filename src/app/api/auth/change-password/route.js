import { NextResponse } from "next/server";
import bcrypt from "bcrypt"; 
import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import connectDB from "@/lib/db";
import User from "@/models/users/User";
import { GetSessionFromServer } from "@/lib/GetSessionfromServer";
import { ChangePasswordSchema } from "@/lib/validation";

export async function PATCH(req) {
  const transaction = await connectDB.transaction();
  try {
    const session = await GetSessionFromServer();

    if (!session?.user) {
      return NextResponse.json(
        { 
          success: false, 
          status_code: StatusCodes.UNAUTHORIZED, 
          message: "Unauthorized" 
        }, 
        { 
          status: StatusCodes.UNAUTHORIZED
        }
      ) 
    }

    const body = await req.json();
    const { new_password } = ChangePasswordSchema.parse(body);

    const user_id = body.user_id;
    const user = await User.findOne({ where: { id: user_id } });

    if (!user) {
      return NextResponse.json(
        { success: false, status_code: StatusCodes.NOT_FOUND, message: "User not found" },
        { status: StatusCodes.NOT_FOUND }
      );
    }

    const isOldPasswordCorrect = await bcrypt.compare(body.old_password, user.password);
    
    if (!isOldPasswordCorrect) {
      return NextResponse.json(
        { success: false, status_code: StatusCodes.BAD_REQUEST, message: "Old password is incorrect" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
    const hashedNewPassword = await bcrypt.hash(new_password, 12);

    await user.update(
      { password: hashedNewPassword },
      { transaction }
    );

    await transaction.commit();

    return NextResponse.json(
      { success: true, status_code: StatusCodes.OK, message: "Password updated successfully" },
      { status: StatusCodes.OK }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, status_code: StatusCodes.BAD_REQUEST, message: error.message },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    await transaction.rollback();
    return NextResponse.json(
      { success: false, status_code: StatusCodes.INTERNAL_SERVER_ERROR, message: "Internal Server Error" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
