import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import connectDB from "@/lib/db";
import { GetSessionFromServer } from "@/lib/GetSessionfromServer";
import { sendEmail } from "@/lib/mailer";
import TransactionEmail from "@/components/Email/templates/TransactionEmail";
import Transaction from "@/models/transaction/Transaction";
import Detail_Transaction from "@/models/detail_transaction/Detail_Transaction";
import User from "@/models/users/User";

export async function POST(request, { params }) {
  let trxDb;

  try {
    const session = await GetSessionFromServer();
    if (!session) {
      return NextResponse.json(
        { success: false, status_code: StatusCodes.UNAUTHORIZED, message: "Unauthorized" },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    const userId = session.user.id;
    const resolvedParams = await params;
    const { id: trxId } = resolvedParams;

    if (!trxId) {
      return NextResponse.json(
        { success: false, status_code: StatusCodes.BAD_REQUEST, message: "Transaction ID missing" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const body = await request.json();
    const { payment_method } = body;

    if (!["bca", "bni", "permata", "otherbank", "qris", "gopay"].includes(payment_method)) {
      return NextResponse.json(
        { success: false, status_code: StatusCodes.BAD_REQUEST, message: "Invalid payment method" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const trx = await Transaction.findOne({
      where: { id: trxId, user_id: userId },
      include: [{ model: User }],
    });

    if (!trx) {
      return NextResponse.json(
        { success: false, status_code: StatusCodes.NOT_FOUND, message: "Transaction Not Found" },
        { status: StatusCodes.NOT_FOUND }
      );
    }

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
        phone: trx.User.phone,
      },
    };

    if (["bca", "bni", "permata", "otherbank"].includes(payment_method)) {
      parameter.payment_type = "bank_transfer";
      parameter.bank_transfer = { bank: payment_method };
    } else if (payment_method === "qris") {
      parameter.payment_type = "qris";
      parameter.qris = { qr_pay_mode: "dynamic" };
    } else if (payment_method === "gopay") {
      parameter.payment_type = "gopay";
    }

    const midtransResponse = await coreApi.charge(parameter);

    trxDb = await connectDB.transaction();

    const lockedTrx = await Transaction.findOne({
      where: { id: trxId, user_id: userId },
      lock: trxDb.LOCK.UPDATE,
      transaction: trxDb,
    });

    if (!lockedTrx) {
      await trxDb.rollback();
      return NextResponse.json(
        { success: false, status_code: StatusCodes.NOT_FOUND, message: "Transaction not found during lock" },
        { status: StatusCodes.NOT_FOUND }
      );
    }

    const NewDetail = await Detail_Transaction.create(
      {
        id: uuidv4(),
        transaction_id: trxId,
        order_id: trx.order_id,
        payment_type: payment_method,
        transaction_time: midtransResponse.transaction_time || "",
        bank: midtransResponse.va_numbers?.[0]?.bank || payment_method || "",
        va_number: midtransResponse.va_numbers?.[0]?.va_number || midtransResponse.permata_va_number || "",
        pdf_url: midtransResponse.pdf_url || midtransResponse.actions?.find(a => a.name === "generate-qr-code")?.url || "",
        redirect_url: midtransResponse.redirect_url || "",
      },
      { transaction: trxDb }
    );

    await Transaction.update(
      { status: "pending" },
      {
        where: { id: trxId },
        transaction: trxDb,
      }
    );

    await trxDb.commit();

    await sendEmail({
      to: session.user.email,
      subject: "Order Summary",
      component: (
        <TransactionEmail
          transaction={{
            User: {
              first_name: session.user.first_name,
              last_name: session.user.last_name,
              email: session.user.email,
              phone: session.user.phone || "",
            },
            service: lockedTrx.service,
            gross_amount: lockedTrx.gross_amount,
            tax_amount: lockedTrx.gross_amount * 0.11,
            total_amount: lockedTrx.gross_amount + lockedTrx.gross_amount * 0.11,
            payment_method,
            virtual_account: midtransResponse.va_numbers?.[0]?.va_number || "",
            order_id: lockedTrx.order_id,
            created_at: midtransResponse.transaction_time || "",
            bank_name: midtransResponse.va_numbers?.[0]?.bank || ""
          }}
        />
      ),
    });  

    return NextResponse.json(
      {
        success: true,
        status_code: StatusCodes.CREATED,
        message: "Detail Transaction Successfully Created",
        data: NewDetail,
        midtrans: midtransResponse,
      },
      { status: StatusCodes.CREATED }
    );
  } catch (error) {
    if (trxDb) await trxDb.rollback();
    console.log("Transaction Error:", error);
    return NextResponse.json(
      { success: false, status_code: StatusCodes.INTERNAL_SERVER_ERROR, error: error.message || error },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
