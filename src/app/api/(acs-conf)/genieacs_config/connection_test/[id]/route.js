import { NextResponse } from "next/server"
import GenieacsCredential from "@/models/genieacs/GenieACSCredential"
import sequelize from "@/lib/db"
import axios from "axios"
import { GetSessionFromServer } from "@/lib/GetSessionfromServer"

export async function POST(req, { params }) {
  let transaction
  try {
    const session = await GetSessionFromServer()
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const id = resolvedParams.id

    transaction = await sequelize.transaction()

    const data = await GenieacsCredential.findByPk(id, { transaction })
    if (!data) {
      await transaction.rollback()
      return NextResponse.json({ success: false, message: 'Record not found' }, { status: 404 })        
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
      await transaction.rollback()
      return NextResponse.json({ success: false, message: `Connection error: ${error.message}` }, { status: 400 })
    }

    if (res.status !== 200) {
      await transaction.rollback()
      return NextResponse.json({ success: false, message: `HTTP Error ${res.status}` }, { status: 400 })
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

    const con = await data.update(
                    { host, port, username, password, role: userRole, is_connected: true },
                    { transaction }
                )

    if (!con) {
        await transaction.rollback()
        return NextResponse.json({ success: false, message: `Update connection failed` }, { status: 500 })
    }                

    await transaction.commit()

    return NextResponse.json({ success: true, message: `Connected / Role [${userRole}]`, role: userRole }, { status: 200 })      

  } catch (err) {
    if (transaction) await transaction.rollback()
    return NextResponse.json({ success: false, message: `Connection error: ${err.message}` }, { status: 500 })      
  }
}
