import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import { GetSessionFromServer } from "@/lib/GetSessionfromServer";
import User from "@/models/users/User";
import { compare } from "bcrypt";
import connectDB from "@/lib/db";

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
    const { first_name, last_name, email, phone, password } = body;

    const user = await User.findOne({ where: { id: session.user.id }}, { transaction });

    if (!user) {
      await transaction.rollback();
      return NextResponse.json(
        { 
          success: false, 
          status_code: StatusCodes.NOT_FOUND, 
          message: "User not found"
        }, 
        { 
          status: StatusCodes.NOT_FOUND
        }
      ) 
    }

    const cmprepswd = await compare(password, user.password)
      if (!password || !cmprepswd) {
        return NextResponse.json(
          { 
            success: false, 
            status_code: StatusCodes.UNAUTHORIZED,
            message: "Wrong Password" 
          }, 
          { 
            status: StatusCodes.UNAUTHORIZED,
          }
        )      
    }

    await user.update({
      first_name,
      last_name,
      email,
      phone,
    }, { transaction });

    await transaction.commit();
    return NextResponse.json(
      { 
        success: true, 
        status_code: StatusCodes.OK,
        message: "Account Successfully Updated", 
        data: user 
      }, 
      { 
        status: StatusCodes.OK
      })    
  } catch (error) {
    await transaction.rollback();
    return NextResponse.json(
      { success: false, 
        status_code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error || "Internal Server Error" 
      }, 
      { 
        status: INTERNAL_SERVER_ERROR
      }
    )    
  }
}
