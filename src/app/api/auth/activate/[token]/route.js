import connectDB from "@/lib/db";
import User from "@/models/users/User";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const token = resolvedParams.token;

  if (!token) {
    return NextResponse.redirect(new URL(`/auth/sign-in?activated=false`, request.url));
    // return NextResponse.json({ statusCode: 400, success: false, message: "Token is required" }, { status: 400 });
  }

  const transaction = await connectDB.transaction();

  try {
    const user = await User.findOne({ where: { activation_token: token }, transaction });

    if (!user) {
      await transaction.rollback();
      return NextResponse.redirect(new URL(`/auth/sign-in?activated=false`, request.url));
      // return NextResponse.json({ statusCode: 404, success: false, message: "Invalid activation token" }, { status: 404 });
    }

    user.status = 1; // aktif
    user.activation_token = null;
    await user.save({ transaction });

    await transaction.commit();

    return NextResponse.redirect(new URL(`/auth/sign-in?activated=true`, request.url));
    // return NextResponse.json({ statusCode: 200, success: true, message: "Successfully active the account" }, { status: 200 });
  } catch (error) {
    await transaction.rollback();
    console.error("Activation error:", error);
    return NextResponse.redirect(new URL(`/auth/sign-in?activated=false`, request.url));
    // return NextResponse.json({ statusCode: 500, success: false, message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
