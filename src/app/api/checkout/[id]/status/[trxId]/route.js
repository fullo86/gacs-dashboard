import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import Transaction from "@/models/transaction/Transaction";
import Detail_Transaction from "@/models/detail_transaction/Detail_Transaction";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const trxId = searchParams.get("trxId");

  if (!trxId) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const trx = await Transaction.findOne({
    where: { id: trxId }
  })

  if (!trx) {
    return NextResponse.json({ 
        success: false,
        status_code: StatusCodes.NOT_FOUND, 
        message: "Transaction not found" 
    }, { status: 404 });
  }

  const detail = await Detail_Transaction.findOne({
    where: { transaction_id: trx.id, order_id: trx.order_id }
  });

  if (!detail) {
    return NextResponse.json({ 
        success: false,
        status_code: StatusCodes.NOT_FOUND, 
        message: "Transaction detail not found" 
    }, { status: 404 });
  }

  const { transaction_status, va_number, bank, qr_url, gopay_url, payment_type } = detail;

  let status = transaction_status;
  if (status === "settlement") status = "paid";
  if (status === "expire") status = "expired";
  if (status === "cancel") status = "failed";

  return NextResponse.json({
    success: true,
    status_code: StatusCodes.OK,
    status,
    payment_type,
    va_number,
    bank,
    qr_url,
    gopay_url,
    expiry_time: detail.transaction_time,
  });
}
