import Detail_Transaction from "@/models/detail_transaction/Detail_Transaction";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const resolvedParams = await params; 
  const { id: trxId } = resolvedParams;    

  const detail = await Detail_Transaction.findOne({
    where: { transaction_id: trxId }
  });

  if (!detail) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: detail
  });
}
