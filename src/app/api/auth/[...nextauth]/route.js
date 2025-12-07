import User from '@/models/users/User'
import { compare } from 'bcrypt'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions = {
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },

            async authorize(credentials) {
                const { username, password } = credentials

                const user = await User.findOne({
                    where: { username }
                })

                if (!user) {
                    throw new Error(JSON.stringify({
                        status: 404,
                        message: "Username not found."
                    }))                    
                }

                const isValid = await compare(password, user.password)
                if (!isValid) {
                    throw new Error(JSON.stringify({
                        status: 400,
                        message: "Password is inccorrect"
                    }))
                }

                if (user.status === 0) {
                    throw new Error(JSON.stringify({
                        status: 400,
                        message: "Account is not active"
                    }))
                }

                return {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    phone: user.phone,
                    image: user.image
                }
            }
        })
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.username = user.username
                token.email = user.email
                token.first_name = user.first_name
                token.last_name = user.last_name
                token.phone = user.phone
                token.image = user.image
            }
            return token
        },

        async session({ session, token }) {
            if (token?.username) {
                session.user.id = token.id
                session.user.username = token.username
                session.user.email = token.email
                session.user.first_name = token.first_name
                session.user.last_name = token.last_name
                session.user.phone = token.phone
                session.user.image = token.image
            }
            return session
        }
    },

    pages: {
        signIn: '/auth/sign-in'
    }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
