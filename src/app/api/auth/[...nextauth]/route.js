import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// import NextAuth from 'next-auth'
// import { compare } from 'bcrypt'
// import { StatusCodes } from "http-status-codes";
// import CredentialsProvider from 'next-auth/providers/credentials'
// import User from '@/models/users/User'

// export const authOptions = {
//     session: {
//         strategy: "jwt"
//     },
//     secret: process.env.NEXTAUTH_SECRET,
//     providers: [
//         CredentialsProvider({
//             name: "credentials",
//             credentials: {
//                 username: { label: 'Username', type: 'text' },
//                 password: { label: 'Password', type: 'password' }
//             },

//             async authorize(credentials) {
//                 const { username, password } = credentials

//                 const user = await User.findOne({
//                     where: { username }
//                 })

//                 if (!user) {
//                     throw new Error(JSON.stringify({
//                         status: StatusCodes.NOT_FOUND,
//                         message: "Username not found."
//                     }))                    
//                 }

//                 const isValid = await compare(password, user.password)
//                 if (!isValid) {
//                     throw new Error(JSON.stringify({
//                         status: StatusCodes.UNAUTHORIZED,
//                         message: "Password is inccorrect"
//                     }))
//                 }

//                 if (user.status === 0) {
//                     throw new Error(JSON.stringify({
//                         status: StatusCodes.BAD_REQUEST,
//                         message: "Account is not active"
//                     }))
//                 }
//                 return {
//                     id: user.id,
//                     username: user.username,
//                     email: user.email,
//                     first_name: user.first_name,
//                     last_name: user.last_name,
//                     phone: user.phone,
//                     image: user.image,
//                     active_trx: user.active_trx
//                 }
//             }
//         })
//     ],

//     callbacks: {
//         async jwt({ token, user }) {
//             if (user) {
//                 token.id = user.id
//                 token.username = user.username
//                 token.email = user.email
//                 token.first_name = user.first_name
//                 token.last_name = user.last_name
//                 token.phone = user.phone
//                 token.image = user.image
//                 token.active_trx = user.active_trx
//             }
//             return token
//         },

//         async session({ session, token }) {
//             if (token?.username) {
//                 session.user.id = token.id
//                 session.user.username = token.username
//                 session.user.email = token.email
//                 session.user.first_name = token.first_name
//                 session.user.last_name = token.last_name
//                 session.user.phone = token.phone
//                 session.user.image = token.image
//                 session.user.active_trx = token.active_trx
//             }
//             return session
//         }
//     },

//     pages: {
//         signIn: '/auth/sign-in'
//     }
// }

// const handler = NextAuth(authOptions)
// export { handler as GET, handler as POST }
