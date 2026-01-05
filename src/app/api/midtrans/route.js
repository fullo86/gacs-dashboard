import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const { order_id, gross_amount, customer } = await req.json();

    const body = {
      transaction_details: {
        order_id,
        gross_amount,
      },
      customer_details: customer,
    };

    const auth = Buffer.from(process.env.MIDTRANS_SERVER_KEY + ":").toString("base64");

    const response = await axios.post(
      `${process.env.MIDTRANS_BASE_URL}/charge`,
      body,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({ success: true, message: "Success", data: response.data}, 
        { status: 200 }
    )
  } catch (error) {
    console.error(error.response?.data || error.message);
    return NextResponse.json({ success: false, message: "Failed", error: error.message }, 
        { status: 500 }
    )
  }
}
