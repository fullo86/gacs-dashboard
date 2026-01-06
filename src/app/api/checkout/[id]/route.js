import { NextResponse } from "next/server";
import { GetSessionFromServer } from "@/lib/GetSessionfromServer";
import Transaction from "@/models/transaction/Transaction";
import User from "@/models/users/User";

export async function GET(request, { params }) {
  try {
    const session = await GetSessionFromServer();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, 
        { status: 401 }
    );
    }

    const resolvedParams = await params; 
    const { id } = resolvedParams;
    if (!id) {
      return NextResponse.json({ success: false, message: "Transaction ID missing" }, 
        { status: 400 }
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
      return NextResponse.json({ success: false, message: "Transaction Not Found" }, 
        { status: 404 }
    )}

    return NextResponse.json({ success: true, message: "Get Transaction Success", data: trx }, 
        { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, 
        { status: 500 }
    );
  }
}
