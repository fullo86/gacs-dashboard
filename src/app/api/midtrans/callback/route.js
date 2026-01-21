import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import { convertToUTC7 } from "@/lib/DateConvert";
import Detail_Transaction from "@/models/detail_transaction/Detail_Transaction";
import Transaction from "@/models/transaction/Transaction";
import User from "@/models/users/User";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      transaction_time,
      settlement_time
    } = body;

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const payload = order_id + status_code + String(gross_amount) + serverKey;
    const expectedSignature = crypto.createHash("sha512").update(payload).digest("hex");

    if (signature_key !== expectedSignature) {
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 403 }
      );
    }

    let status = "pending";
    if (transaction_status === "settlement") status = "paid";
    else if (transaction_status === "expire") status = "expired";
    else if (transaction_status === "cancel") status = "failed";

    const trxTimeJakarta = transaction_time ? convertToUTC7(transaction_time) : null;
    const settleTimeJakarta = settlement_time ? convertToUTC7(settlement_time) : null;

    await connectDB.transaction(async (trx) => {
      await Detail_Transaction.update(
        {
          transaction_status: status,
          status_code,
          transaction_time: trxTimeJakarta,
          settlement_time: settleTimeJakarta
        },
        { where: { order_id }, transaction: trx }
      );

      if (status === "paid") {
        const trxData = await Transaction.findOne({
          where: { order_id },
          transaction: trx
        });

        await Transaction.update(
            { status: "active" },
            { where: { id: trxData.id,order_id } }
        )

        if (trxData) {
          await User.update(
            { active_trx: 1 },
            { where: { id: trxData.user_id }, transaction: trx }
          );
        }
      }
    });

    return NextResponse.json(
      { success: true, message: "Callback processed successfully in UTC+7" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
