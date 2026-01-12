import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import connectDB from '@/lib/db';
import GenieacsCredential from "@/models/genieacs/GenieACSCredential";
import { GetSessionFromServer } from "@/lib/GetSessionfromServer";

export async function PATCH(request, { params }) {
  const transaction = await connectDB.transaction();

  try {
    const session = await GetSessionFromServer();
    const userId = session?.user?.id
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const data = await request.json();
    const { host, port, username, password } = data;

    const record = await GenieacsCredential.findOne({
      where: { id, user_id: userId }
    }, { transaction });

    if (!record) {
      await transaction.rollback();
      return NextResponse.json(
        { 
          success: false, 
          status_code: StatusCodes.NOT_FOUND,
          message: "Configuration not found" 
        },
        { 
          status: StatusCodes.NOT_FOUND,
        }
      );
    }

    await record.update(
      {
        host,
        port,
        ...(username && { username }),
        ...(password && { password }),
        updated_at: new Date(),
      },
      { transaction }
    );

    await transaction.commit();
    return NextResponse.json(
      {
        success: true,
        status_code: StatusCodes.OK,
        message: "Configuration updated successfully!",
        data: record,
      },
      {
        status: StatusCodes.OK        
      }
    );
  } catch (error) {
    await transaction.rollback();
    return NextResponse.json(
      { success: false, status_code: StatusCodes.INTERNAL_SERVER_ERROR, message: "Failed to update configuration" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR, }
    );
  }
}
