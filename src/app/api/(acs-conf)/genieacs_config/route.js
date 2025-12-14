import { NextResponse } from 'next/server';
import sequelize from '@/lib/db';
import GenieacsCredential from '@/models/genieacs/GenieACSCredential';
import { getServerSession } from 'next-auth';
import User from '@/models/users/User';
import { authOptions } from '../../auth/[...nextauth]/route';
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const session = await getServerSession(authOptions); 
    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const config = await GenieacsCredential.findOne({
      where: { user_id: userId },
    });

    if (!config) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No configuration found for this user",
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Get Configuration Success", data: config }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const transaction = await sequelize.transaction();
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.username) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ where: { id: session.user.id } });

    if (!user) {
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

