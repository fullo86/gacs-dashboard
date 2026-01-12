import { NextResponse } from "next/server"
import { StatusCodes } from "http-status-codes";
import { GetSessionFromServer } from "@/lib/GetSessionfromServer"
import GenieacsCredential from "@/models/genieacs/GenieACSCredential"
import axios from "axios"
import connectDB from "@/lib/db"

export async function POST(req, { params }) {
  const transaction = await connectDB.transaction();
  try {
    const session = await GetSessionFromServer()
    if (!session) {
      return NextResponse.json({ success: false, status_code: StatusCodes.UNAUTHORIZED, message: 'Unauthorized' }, 
        { status: StatusCodes.UNAUTHORIZED })
    }

    const resolvedParams = await params
    const id = resolvedParams.id

    const data = await GenieacsCredential.findByPk(id, { transaction })
    if (!data) {
      await transaction.rollback()
      return NextResponse.json({ success: false, status_code: StatusCodes.NOT_FOUND, message: 'Record not found' }, 
        { status: StatusCodes.NOT_FOUND })        
    }

    const { host, port, username, password } = data
    const url = `http://${host}:${port}/devices?limit=1`
    const headers = {}

    if (username) {
      const token = Buffer.from(`${username}:${password}`).toString('base64')
      headers['Authorization'] = `Basic ${token}`
    }

    let res
    try {
      res = await axios.get(url, { headers, timeout: 5000 })
    } catch (error) {
      const isTimeout = error.code === 'ECONNABORTED'
      await transaction.rollback()
      return NextResponse.json(
        { 
          success: false, 
          status_code: isTimeout ? StatusCodes.GATEWAY_TIMEOUT : StatusCodes.BAD_GATEWAY, 
          message:  isTimeout ? 'Request timeout to external service' : `Connection error: ${error.message}` 
        }, 
        { status: isTimeout ? StatusCodes.GATEWAY_TIMEOUT : StatusCodes.BAD_GATEWAY })
    }

    if (res.status !== 200) {
      await transaction.rollback()
      return NextResponse.json(
        {
          success: false, status_code: res.status, message: `HTTP Error ${res.status}`
        },
        { status: res.status }
      )
    }

    let userRole = 'user'
    if (username) {
      const usersUrl = `http://${host}:${port}/users`
      try {
        const usersRes = await axios.get(usersUrl, { headers, timeout: 5000 })
        if (usersRes.status === 200) {
          const users = usersRes.data
          const currentUser = users.find(u => u._id === username)
          if (currentUser) {
            if (Array.isArray(currentUser.roles)) {
              userRole = currentUser.roles[0] || 'user'
            } else if (currentUser.roles) {
              userRole = currentUser.roles
            } else if (currentUser.role) {
              userRole = currentUser.role
            }
          }
        }
      } catch (err) {
        // jika gagal fetch users, biarkan role default 'user'
      }
    }

    const [updatedRows] = await data.update(
                    { host, port, username, password, role: userRole, is_connected: true },
                    { transaction }
                )

    if (updatedRows === 0) {
    await transaction.rollback()
    return NextResponse.json({ success: false, status_code: StatusCodes.NOT_FOUND, message: `Update connection failed: data not found` },
        { status: StatusCodes.NOT_FOUND })
    }            

    await transaction.commit()
    return NextResponse.json({ success: true, status_code: StatusCodes.OK, message: `Connected / Role [${userRole}]`, data: userRole }, 
      { status: StatusCodes.OK }
    )      
  } catch (err) {
    await transaction.rollback()
    let stats = 500
    let msg = 'Internal Server Error'
    if (err.code === 'ECONNABORTED') {
        stats = 504
        msg = 'Request to external service timed out'
    } else if (err.isAxiosError) {
        stats = 502
        msg = `External service connection failed: ${err.message}`
    } else if (err.name === 'SequelizeValidationError') {
        stats = 400
        msg = err.errors.map(e => e.message).join(', ')
    } else {
        msg = `Error: ${err.message}`
    }

    return NextResponse.json({ success: false, status_code: stats, message }, { status: stats })    
  }
}
