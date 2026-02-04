import { NextResponse } from 'next/server';
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import GenieacsCredential from '@/models/genieacs/GenieACSCredential';
import User from '@/models/users/User';
import { GetSessionFromServer } from '@/lib/GetSessionfromServer';
import connectDB from '@/lib/db';

export async function GET() {
  try {
    const session = await GetSessionFromServer(); 
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, status_code: StatusCodes.UNAUTHORIZED, message: "Unauthorized" },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    const userId = session.user.id;

    const config = await GenieacsCredential.findOne({
      where: { user_id: userId },
    });

    // if (!config) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       status_code: StatusCodes.NOT_FOUND,
    //       message: "No configuration found",
    //       data: [],
    //     },
    //     { status: StatusCodes.NOT_FOUND }
    //   );
    // }

    return NextResponse.json(
      {
        success: true,
        status_code: StatusCodes.OK,
        message: "Get Configuration Success",
        data: config,
      },
      { status: StatusCodes.OK }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        status_code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function POST(request) {
  const transaction = await connectDB.transaction();

  try {
    const session = await GetSessionFromServer();
    if (!session || !session.user?.username) {
      return NextResponse.json({ success: false, status_code: StatusCodes.UNAUTHORIZED, message: 'Unauthorized' }, 
        { status: StatusCodes.UNAUTHORIZED });
    }

    const user = await User.findOne({ where: { id: session.user.id } });

    if (!user) {
      await transaction.rollback();
      return NextResponse.json({ success: false, status_code: StatusCodes.NOT_FOUND, message: 'User not found' }, 
        { status: StatusCodes.NOT_FOUND });
    }

    const data = await request.json();

    const id = uuidv4()
    const user_id = user.id
    const host = data.host
    const port = data.port
    const username = data.username
    const password = data.password 
    const sec_key = data.sec_key 

    if (!host || !port ) {
      await transaction.rollback();
      return NextResponse.json(
        { success: false, status_code: StatusCodes.BAD_REQUEST, message: 'Field cannot be null' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const newRecord = await GenieacsCredential.create(
      { id, user_id, host, port, username, password, is_connected: 0, sec_key },
      { transaction }
    );

    await transaction.commit();
    return NextResponse.json(
      {
        success: true,
        status_code: StatusCodes.CREATED,
        message: 'New Configuration Have Been Created!',
        data: newRecord,
      },
      { status: StatusCodes.CREATED }
    );
  } catch (error) {
    await transaction.rollback();
    return NextResponse.json(
      { success: false, status_code: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Failed to Create New Configuration!' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PATCH(request) {
  const transaction = await connectDB.transaction();

  try {
    const session = await GetSessionFromServer();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, status_code: StatusCodes.UNAUTHORIZED, message: 'Unauthorized' },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    const userId = session.user.id;

    const config = await GenieacsCredential.findOne({
      where: { user_id: userId },
      transaction,
    });

    if (!config) {
      await transaction.rollback();
      return NextResponse.json(
        { success: false, status_code: StatusCodes.NOT_FOUND, message: 'Configuration not found' },
        { status: StatusCodes.NOT_FOUND }
      );
    }

    const data = await request.json();

    const {
      host,
      port,
      username,
      password,
      sec_key
    } = data;

    if (!host || !port) {
      await transaction.rollback();
      return NextResponse.json(
        { success: false, status_code: StatusCodes.BAD_REQUEST, message: 'Field is required' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    await config.update(
      {
        host,
        port,
        username,
        password,
        sec_key,
      },
      { transaction }
    );

    await transaction.commit();
    return NextResponse.json(
      {
        success: true,
        status_code: StatusCodes.OK,
        message: 'Configuration updated successfully',
        data: config,
      },
      { status: StatusCodes.OK }
    );
  } catch (error) {
    await transaction.rollback();
    return NextResponse.json(
      {
        success: false,
        status_code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message || 'Failed to update configuration',
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
