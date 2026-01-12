import { NextResponse } from "next/server";
import randomstring from "randomstring";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import connectDB from "@/lib/db";
import { GetSessionFromServer } from "@/lib/GetSessionfromServer";
import Transaction from "@/models/transaction/Transaction";

export async function POST(req) {
  const transaction = await connectDB.transaction();    

  try {
    const session = await GetSessionFromServer()

    if (!session) {
      return NextResponse.json(
        { success: false, status_code: StatusCodes.UNAUTHORIZED, message: "Unauthorized" },
        { status: StatusCodes.UNAUTHORIZED }
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
        { success: false, status_code: StatusCodes.BAD_REQUEST, message: "Failed Create New Transaction" },
        { status: StatusCodes.BAD_REQUEST }
      );        
    }

    await transaction.commit();
    return NextResponse.json({
      success: true,
      status_code: StatusCodes.CREATED,
      message: "New Transaction Successfully Created",
      data: Newtransaction,
    }, { status: StatusCodes.CREATED });
  } catch (error) {
    await transaction.rollback();
    return Response.json(
      { success: false, status_code: StatusCodes.INTERNAL_SERVER_ERROR, message: "Failed create transaction", error },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function GET() {
  try {
    const session = await GetSessionFromServer();

    if (!session) {
      return NextResponse.json(
        { success: false, status_code: StatusCodes.UNAUTHORIZED, message: "Unauthorized" },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }
    const userId = await session?.user?.id
    const trx = await Transaction.findAll({
      where: { user_id: userId },
      order: [['updated_at', 'DESC']] 
    });

    if (!trx || trx.length === 0) {
      return NextResponse.json({ success: false, status_code: StatusCodes.NOT_FOUND, message: "No transactions found", data: [] },
        { status: StatusCodes.NOT_FOUND }
      )
    }

    return NextResponse.json({ success: true, status_code: StatusCodes.OK, message: "Get Transaction Success", data: trx },
      { status: StatusCodes.OK }
    )
  } catch (error) {
    return NextResponse.json({ success: false, status_code: StatusCodes.INTERNAL_SERVER_ERROR, message: "Failed to Get Transaction Data", error: error },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    )
  }
}
