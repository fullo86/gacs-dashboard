// src/app/api/auth/register/route.js
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
    // Ambil body request
    const body = await request.json();

    // Validasi dengan Zod
    const parsed = userRegisterSchema.parse(body);

    // Cek email
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

    // Cek username
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

    // Cek password & konfirmasi
    if (parsed.password !== parsed.cfm_password) {
      await transaction.rollback();
      return NextResponse.json(
        { statusCode: 400, success: false, message: "Confirmation does not match" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(parsed.password, 12);

    // Buat user baru dengan UUID
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

    // Commit transaction
    await transaction.commit();

    // Return response sukses
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
    // Rollback jika ada error
    await transaction.rollback();

    // Tangani error validasi Zod
    if (error instanceof ZodError) {
    return NextResponse.json(
        {
        statusCode: 400,
        success: false,
        message: "Validation failed",
errors: JSON.parse(JSON.stringify(error.errors)),
        },
        { status: 400 }
    );
    }

    // Error lainnya
    console.error("Register error:", error);
    return NextResponse.json(
      {
        statusCode: 500,
        success: false,
        message: "Internal Server Error",
        error: error.message, // optional, bisa dihapus di production
      },
      { status: 500 }
    );
  }
}
