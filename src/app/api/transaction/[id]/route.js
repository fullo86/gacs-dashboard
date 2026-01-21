import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import { GetSessionFromServer } from "@/lib/GetSessionfromServer";
import Transaction from "@/models/transaction/Transaction";
import Detail_Transaction from "@/models/detail_transaction/Detail_Transaction";
import { initDB } from "@/lib/initDb";

export async function GET(request, { params }) {
  await initDB();
  try {
    const session = await GetSessionFromServer();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          status_code: StatusCodes.UNAUTHORIZED,
          message: "Unauthorized",
        },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    const userId = session?.user?.id;
    const resolvedParams = await params;
    const { id: trxId } = resolvedParams;

    if (!trxId) {
      return NextResponse.json(
        {
          success: false,
          status_code: StatusCodes.BAD_REQUEST,
          message: "trxid is required",
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const trx = await Transaction.findOne({
      where: {
        id: trxId,
        user_id: userId,
      },
      include: [{ model: Detail_Transaction }],
    });

    if (!trx) {
      return NextResponse.json(
        {
          success: false,
          status_code: StatusCodes.NOT_FOUND,
          message: "Transaction not found",
          data: null,
        },
        { status: StatusCodes.NOT_FOUND }
      );
    }

    return NextResponse.json(
      {
        success: true,
        status_code: StatusCodes.OK,
        message: "Get Transaction Success",
        data: trx,
      },
      { status: StatusCodes.OK }
    );
  } catch (error) {
    console.error("GET TRANSACTION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        status_code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Failed to Get Transaction Data",
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
