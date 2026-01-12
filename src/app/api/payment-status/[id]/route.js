import { NextResponse } from "next/server";
import Detail_Transaction from "@/models/detail_transaction/Detail_Transaction";
import { StatusCodes } from "http-status-codes";

export async function GET(request, { params }) {
  const resolvedParams = await params; 
  const { id: trxId } = resolvedParams;    

  const detail = await Detail_Transaction.findOne({
    where: { transaction_id: trxId }
  });

  if (!detail) {
    return NextResponse.json({ success: false, status_code: StatusCodes.NOT_FOUND, message: "Not found" }, 
      { status: StatusCodes.NOT_FOUND });
  }

  return NextResponse.json({
    success: true,
    status_code: StatusCodes.OK,
    data: detail
  }, { status: StatusCodes.OK });
}
