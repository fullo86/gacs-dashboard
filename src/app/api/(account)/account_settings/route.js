import { NextResponse } from "next/server";
import { GetSessionFromServer } from "@/lib/GetSessionfromServer";
import User from "@/models/users/User";
import { compare } from "bcrypt";
import connectDB from "@/lib/db";

export async function PATCH(req) {
  const transaction = await connectDB.transaction();
  try {
    const session = await GetSessionFromServer();

    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, 
        { status: 401 }
      ) 
    }

    const body = await req.json();
    const { first_name, last_name, email, phone, password } = body;

    const user = await User.findOne({ where: { id: session.user.id }}, { transaction });

    if (!user) {
      await transaction.rollback();
      return NextResponse.json({ success: false, message: "User not found"}, 
        { status: 404 }
      ) 
    }

    const cmprepswd = await compare(password, user.password)
      if (!password || !cmprepswd) {
        return NextResponse.json({ success: false, message: "Wrong Password" }, 
          { status: 404 }
        )      
    }

    await user.update({
      first_name,
      last_name,
      email,
      phone,
    }, { transaction });

    await transaction.commit();
    return NextResponse.json({ success: true, message: "Account Successfully Updated", data: user }, { status: 200 })    
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    return NextResponse.json({ success: false, message: error || "Internal Server Error" }, 
      { status: 500 }
    )    
  }
}
