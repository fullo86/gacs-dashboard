import { NextResponse } from "next/server";
import randomstring from "randomstring";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import connectDB from "@/lib/db";
import Transaction from "@/models/transaction/Transaction";
import { GetSessionFromServer } from "@/lib/GetSessionfromServer";

export async function POST(req) {
  try {
    const session = await GetSessionFromServer();
    if (!session) {
      return NextResponse.json(
        { success: false, status_code: StatusCodes.UNAUTHORIZED, message: "Unauthorized" },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    const userId = session.user.id;
    const { service, gross_amount, duration } = await req.json();

    const order_id = "ORD-" + randomstring.generate(8).toUpperCase();
    const startDate = new Date();

    // Hitung end date sesuai UTC +7 (Jakarta)
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + duration);
    endDate.setHours(0, 0, 0, 0); // set ke jam 00:00:00

    // Gunakan transaction callback otomatis
    const Newtransaction = await connectDB.transaction(async (trx) => {
      return await Transaction.create(
        {
          id: uuidv4(),
          user_id: userId,
          order_id,
          service,
          gross_amount,
          status: "inactive",
          start_date: startDate,
          end_date: endDate,
        },
        { transaction: trx }
      );
    });

    return NextResponse.json(
      {
        success: true,
        status_code: StatusCodes.CREATED,
        message: "New Transaction Successfully Created",
        data: Newtransaction,
      },
      { status: StatusCodes.CREATED }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, status_code: StatusCodes.INTERNAL_SERVER_ERROR, message: "Failed create transaction", error: error.message || error },
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

    const userId = session.user.id;

    const trx = await Transaction.findAll({
      where: { user_id: userId },
      order: [['updated_at', 'DESC']]
    });

    return NextResponse.json(
      {
        success: true,
        status_code: StatusCodes.OK,
        message: trx.length ? "Get Transaction Success" : "No transactions found",
        data: trx
      },
      { status: StatusCodes.OK }
    );

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        status_code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Failed to Get Transaction Data"
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
