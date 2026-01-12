import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import { GetSessionFromServer } from "@/lib/GetSessionfromServer";
import Transaction from "@/models/transaction/Transaction";
import User from "@/models/users/User";

export async function GET(request, { params }) {
  try {
    const session = await GetSessionFromServer();
    if (!session) {
      return NextResponse.json({ success: false, status_code: StatusCodes.UNAUTHORIZED, message: "Unauthorized" }, 
        { status: StatusCodes.UNAUTHORIZED }
    );
    }

    const resolvedParams = await params; 
    const { id } = resolvedParams;
    if (!id) {
      return NextResponse.json({ success: false, status_code: StatusCodes.BAD_REQUEST, message: "Transaction ID missing" }, 
        { status: StatusCodes.BAD_REQUEST }
    );
    }

    const trx = await Transaction.findOne({
      where: { id, user_id: session.user.id }, 
      include: [
        {
          model: User,
          attributes: ["id", "first_name", "last_name", "phone", "email"],
        },
      ],
    });

    if (!trx) {
      return NextResponse.json({ success: false, status_code: StatusCodes.NOT_FOUND, message: "Transaction Not Found" }, 
        { status: StatusCodes.NOT_FOUND }
    )}

    return NextResponse.json({ success: true, status_code: StatusCodes.OK, message: "Get Transaction Success", data: trx }, 
        { status: StatusCodes.OK }
    );
  } catch (error) {
    return NextResponse.json({ success: false, status_code: StatusCodes.INTERNAL_SERVER_ERROR, message: error.message || "Internal Server Error" }, 
        { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
