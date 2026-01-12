import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import connectDB from "@/lib/db";
import { GetSessionFromServer } from "@/lib/GetSessionfromServer";
import Transaction from "@/models/transaction/Transaction";
import Detail_Transaction from "@/models/detail_transaction/Detail_Transaction";
import User from "@/models/users/User";

export async function POST(request, { params }) {
  const trxDb = await connectDB.transaction();

  try {
    const session = await GetSessionFromServer();
    if (!session) {
      return NextResponse.json({ success: false, status_code: StatusCodes.UNAUTHORIZED, message: "Unauthorized" }, 
        { status: StatusCodes.UNAUTHORIZED }
    );
    }

    const userId = session?.user?.id;

    const resolvedParams = await params; 
    const { id: trxId } = resolvedParams;
    if (!trxId) {
      return NextResponse.json({ success: false, status_code: StatusCodes.BAD_REQUEST, message: "Transaction ID missing" }, 
        { status: StatusCodes.BAD_REQUEST }
    )}

    const body = await request.json();
    const { payment_method } = body;
    if (!["bca", "bri", "mandiri", "qris", "gopay"].includes(payment_method)) {
      return NextResponse.json({ success: false, status_code: StatusCodes.BAD_REQUEST, message: "Invalid payment method" }, 
        { status: StatusCodes.BAD_REQUEST }
    )}

    const trx = await Transaction.findOne({
      where: { id: trxId, user_id: userId },
      include: [{ model: User }]
    });

    if (!trx) {
      return NextResponse.json({ success: false, status_code: StatusCodes.NOT_FOUND, message: "Transaction Not Found" }, 
        { status: StatusCodes.NOT_FOUND }
    )}

    // Setup Midtrans Core API
    const coreApi = new midtransClient.CoreApi({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    let parameter = {
      transaction_details: { order_id: trx.order_id, gross_amount: trx.gross_amount },
      customer_details: {
        first_name: trx.User.first_name,
        last_name: trx.User.last_name,
        email: trx.User.email,
        phone: trx.User.phone
      }
    };

    if (["bca", "bri", "mandiri"].includes(payment_method)) {
      parameter.payment_type = "bank_transfer";
      parameter.bank_transfer = { bank: payment_method };
    } else if (payment_method === "qris") {
      parameter.payment_type = "qris";
    } else if (payment_method === "gopay") {
      parameter.payment_type = "gopay";
    }

    // Charge transaction ke Midtrans
    const midtransResponse = await coreApi.charge(parameter);

    const NewDetail = await Detail_Transaction.create({
      id: uuidv4(),
      transaction_id: trxId,
      order_id: trx.order_id,
      payment_type: payment_method,
      transaction_time: midtransResponse.transaction_time || "",
      bank: midtransResponse.va_numbers?.[0]?.bank || "",
      va_number: midtransResponse.va_numbers?.[0]?.va_number || "",
      pdf_url: midtransResponse.pdf_url || "",
      redirect_url: midtransResponse.redirect_url || ""
    }, { transaction: trxDb });

    if (!NewDetail) {
      return NextResponse.json({ success: false, status_code: StatusCodes.BAD_REQUEST, message: "Failed Create the detail Transaction" },
        { status: StatusCodes.BAD_REQUEST }
      )
    }

    await Transaction.update(
      { status: "pending" },
      { where: { 
          id: NewDetail.transaction_id,
          order_id: NewDetail.order_id
        } 
      }
    )
    await trxDb.commit();

    return NextResponse.json({
      success: true,
      status_code: StatusCodes.CREATED,
      message: "Detail Transaction Successfully Created",
      data: NewDetail,
      midtrans: midtransResponse
    }, { status: StatusCodes.CREATED });

  } catch (error) {
    await trxDb.rollback();
    console.log(error);
    return NextResponse.json({
      success: false,
      status_code: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || error
    }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
}
