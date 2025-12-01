import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { signIn } from 'next-auth/react'

const authOptions = {
    session: {
        strategy: "jwt"
    },
    secret: "123456",
    providers: [
        CredentialsProvider({
            type: "credentials",
            name: "credentials",
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                const { username, password } = credentials
                const user = {
                    id: 1,
                    username: 'user',
                    email: 'user@email.com',
                    role_id: 1                    
                }
                if(username === 'user' && password === 'user1234') {
                    return user
                }else{
                    return null
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, account, profile, user }) {
            if (account?.provider === 'credentials') {
                token.username = user.username
            }
            return token
        },
        async session({ session, token }) {
            if ("username" in token) {
                session.user.username = token.username
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