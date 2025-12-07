import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import connectDB from "@/lib/db";
import User from "@/models/users/User";
import { userRegisterSchema } from "@/lib/validation";
import { v4 as uuidv4 } from "uuid";
import { ZodError } from "zod";

export async function POST(request) {
  const transaction = await connectDB.transaction();

  try {
    const body = await request.json();
    const parsed = userRegisterSchema.parse(body);

    const emailUser = await User.findOne({
      where: { email: parsed.email },
      transaction,
    });

    if (emailUser) {
      await transaction.rollback();
      return NextResponse.json(
        { statusCode: 400, success: false, message: "Email already exists" },
        { status: 400 }
      );
    }

    const userName = await User.findOne({
      where: { username: parsed.username },
      transaction,
    });

    if (userName) {
      await transaction.rollback();
      return NextResponse.json(
        { statusCode: 400, success: false, message: "Username already exists" },
        { status: 400 }
      );
    }

    if (parsed.password !== parsed.cfm_password) {
      await transaction.rollback();
      return NextResponse.json(
        { statusCode: 400, success: false, message: "Confirmation does not match" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(parsed.password, 12);

    const user = await User.create(
      {
        id: uuidv4(),
        username: parsed.username,
        first_name: parsed.first_name,
        last_name: parsed.last_name,
        email: parsed.email,
        phone: parsed.phone,
        password: hashedPassword,
        status: 0,
        role_id: 2,
        image: "default.png",
      },
      { transaction }
    );

    await transaction.commit();
    return NextResponse.json(
      {
        statusCode: 201,
        success: true,
        message: "Successfully Registered",
        data: {
          id: user.id,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone: user.phone,
          status: user.status,
          role_id: user.role_id,
          image: user.image,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    await transaction.rollback();

//     if (error instanceof ZodError) {
//     return NextResponse.json(
//         {
//         statusCode: 400,
//         success: false,
//         message: "Validation failed",
// errors: JSON.parse(JSON.stringify(error.errors)),
//         },
//         { status: 400 }
//     );
//     }

    console.error("Register error:", error);
    return NextResponse.json(
      {
        statusCode: 500,
        success: false,
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
