import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import connectDB from "@/lib/db";
import Detail_Transaction from "@/models/detail_transaction/Detail_Transaction";
import Transaction from "@/models/transaction/Transaction";

export async function POST(request, { params }) {
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
    const resolvedParams = await params; 
    const { id: trxId } = resolvedParams;

    const trx = await Transaction.findOne({
        where: {
            id: trxId, user_id: userId
        }
    })

    if (!trx) {
        return NextResponse.json({ success: false, status_code: StatusCodes.NOT_FOUND, message: "Transaction Not Found" },
            { status: StatusCodes.NOT_FOUND }
        )
    }

    const NewDetail = await Detail_Transaction.create({
        id: uuidv4(),
        transaction_id: trxId,
        order_id: trx.order_id,
        payment_type: "",
        transaction_time: "",
        bank: "",
        va_numver: "",
        pdf_url
    }, { transaction })

    if (!NewDetail) {
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
      message: "Detail Transaction Successfully Created",
      data: NewDetail,
    }, { status: StatusCodes.CREATED });
  } catch (error) {
    await transaction.rollback();
    return Response.json(
      { success: false, status_code: StatusCodes.INTERNAL_SERVER_ERROR, message: "Failed create detail transaction", error },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
