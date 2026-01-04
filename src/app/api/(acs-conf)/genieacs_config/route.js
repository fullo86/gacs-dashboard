import { NextResponse } from 'next/server';
import GenieacsCredential from '@/models/genieacs/GenieACSCredential';
import User from '@/models/users/User';
import { v4 as uuidv4 } from "uuid";
import { GetSessionFromServer } from '@/lib/GetSessionfromServer';
import connectDB from '@/lib/db';

export async function GET() {
  try {
    const session = await GetSessionFromServer(); 
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const config = await GenieacsCredential.findOne({
      where: { user_id: userId },
    });

    if (!config) {
      return NextResponse.json(
        {
          success: false,
          message: "No configuration found",
          data: [],
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Get Configuration Success",
        data: config,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const transaction = await connectDBB.transaction();
  try {
    const session = await GetSessionFromServer();
    if (!session || !session.user?.username) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ where: { id: session.user.id } });

    if (!user) {
      await transaction.rollback();
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const data = await request.json();

    const id = uuidv4()
    const user_id = user.id
    const host = data.host
    const port = data.port
    const username = data.username
    const password = data.password 

    if (!host || !port ) {
      await transaction.rollback();
      return NextResponse.json(
        { success: false, message: 'Field cannot be null' },
        { status: 400 }
      );
    }

    const newRecord = await GenieacsCredential.create(
      { id, user_id, host, port, username, password, is_connected: 0 },
      { transaction }
    );

    await transaction.commit();
    return NextResponse.json(
      {
        success: true,
        message: 'New Configuration Have Been Created!',
        data: newRecord,
      },
      { status: 201 }
    );
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'Failed to Create New Configuration!' },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  const transaction = await connectDB.transaction();
  try {
    const session = await GetSessionFromServer();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
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
        { success: false, message: 'Configuration not found' },
        { status: 404 }
      );
    }

    const data = await request.json();

    const {
      host,
      port,
      username,
      password
    } = data;

    if (!host || !port) {
      await transaction.rollback();
      return NextResponse.json(
        { success: false, message: 'Field is required' },
        { status: 400 }
      );
    }

    await config.update(
      {
        host,
        port,
        username,
        password,
      },
      { transaction }
    );

    await transaction.commit();
    return NextResponse.json(
      {
        success: true,
        message: 'Configuration updated successfully',
        data: config,
      },
      { status: 200 }
    );
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to update configuration',
      },
      { status: 500 }
    );
  }
}
