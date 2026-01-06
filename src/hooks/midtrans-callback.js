import { NextResponse } from "next/server";
import crypto from "crypto";
import Detail_Transaction from "@/models/detail_transaction/Detail_Transaction";
import User from "@/models/users/User";
import Transaction from "@/models/transaction/Transaction";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status
    } = body;

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const payload = order_id + status_code + gross_amount + serverKey;
    const expectedSignature = crypto
      .createHash("sha512")
      .update(payload)
      .digest("hex");

    if (signature_key !== expectedSignature) {
      return NextResponse.json({ success: false, message: "Invalid signature" }, 
        { status: 403 }
    )}

    let status = "pending";

    if (transaction_status === "settlement") {
      status = "paid";
    } else if (transaction_status === "expire") {
      status = "expired";
    } else if (transaction_status === "cancel") {
      status = "failed";
    }

    await Detail_Transaction.update(
      { status, status_code },
      { where: { order_id } }
    );

    if (status_code === 200) {
      const trx = await Transaction.findOne({
        where: {
          order_id
        }
      })

      await User.update(
        { active_trx: 1 },
        { where: { id: trx.user_id }}
      )
    }
 
    return NextResponse.json({ success: true, message: "Data Callback Success" }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, 
        { status: 500 }
    );
  }
}
