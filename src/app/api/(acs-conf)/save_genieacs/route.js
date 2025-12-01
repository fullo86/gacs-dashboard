import { NextResponse } from 'next/server';
import sequelize from '@/lib/db';
import GenieacsCredential from '@/models/genieacs/GenieACSCredential';

export async function GET() {
    
}

export async function POST(request) {
  const transaction = await sequelize.transaction();
  try {
    const data = await request.json();

    const id = data.id
    const host = data.host
    const port = data.port
    const username = data.username
    const password = data.password 

    if (!host || !port || !username || !password) {
      return NextResponse.json(
        { success: false, message: 'Field cannot be null' },
        { status: 400 }
      );
    }

    const newRecord = await GenieacsCredential.create(
      { id, host, port, username, password, is_connected: 0 },
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

export async function PATCH(request, { params }) {
  const transaction = await sequelize.transaction();
  try {
    const id = params.id;
    const data = await request.json();

    const host = data.host
    const port = data.port
    const username = data.username
    const password = data.password

    if (!host || !port || !username || !password) {
      await transaction.rollback();
      return NextResponse.json(
        { success: false, message: 'Field cannot be null' },
        { status: 400 }
      );
    }

    const record = await GenieacsCredential.findByPk(id, { transaction });

    if (!record) {
      await transaction.rollback();
      return NextResponse.json(
        { success: false, message: 'Record not found!' },
        { status: 404 }
      );
    }

    await record.update(
      { host, port, username, password, updated_at: new Date() },
      { transaction }
    );

    await transaction.commit();
    return NextResponse.json(
      { success: true, message: 'Configuration updated successfully!', data: record },
      { status: 200 }
    );
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'Failed to update configuration!' },
      { status: 500 }
    );
  }
};
