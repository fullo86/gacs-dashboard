import { NextResponse } from "next/server";
import randomstring from "randomstring";
import { v4 as uuidv4 } from "uuid";
import connectDB from "@/lib/db";
import { GetSessionFromServer } from "@/lib/GetSessionfromServer";
import Transaction from "@/models/transaction/Transaction";
import Detail_Transaction from "@/models/detail_transaction/Detail_Transaction";

export async function POST(req) {
  const transaction = await connectDB.transaction();    
  try {
    const session = await GetSessionFromServer()

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    const userId = session?.user?.id
    const { service, gross_amount, duration } = await req.json();

    const order_id = "ORD-" + randomstring.generate(8).toUpperCase();

    const startDate = new Date();
    const endDate = new Date();
    const status = "inactive"
    endDate.setMonth(endDate.getMonth() + duration);

    const Newtransaction = await Transaction.create({
      id: uuidv4(),
      user_id: userId,
      order_id,
      service,
      gross_amount,
      status,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
    }, { transaction });

    if (!Newtransaction) {
      await transaction.rollback();
      return NextResponse.json(
        { success: false, message: "Failed Create New Transaction" },
        { status: 400 }
      );        
    }

    await transaction.commit();

    return NextResponse.json({
      success: true,
      message: "New Transaction Successfully Created",
      data: Newtransaction,
    }, { status: 201 });
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    return Response.json(
      { success: false, message: "Failed create transaction", error },
      { status: 500 }
    );
  }
}
