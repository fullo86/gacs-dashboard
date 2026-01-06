import connectDB from "@/lib/db";
import Detail_Transaction from "@/models/detail_transaction/Detail_Transaction";
import Transaction from "@/models/transaction/Transaction";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
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
    const resolvedParams = await params; 
    const { id: trxId } = resolvedParams;

    const trx = await Transaction.findOne({
        where: {
            id: trxId, user_id: userId
        }
    })

    if (!trx) {
        return NextResponse.json({ success: false, message: "Transaction Not Found" },
            { status: 404 }
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
        { success: false, message: "Failed Create New Transaction" },
        { status: 400 }
      );        
    }

    await transaction.commit();

    return NextResponse.json({
      success: true,
      message: "Detail Transaction Successfully Created",
      data: NewDetail,
    }, { status: 201 });
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    return Response.json(
      { success: false, message: "Failed create detail transaction", error },
      { status: 500 }
    );
  }
}
