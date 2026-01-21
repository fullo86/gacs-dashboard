import User from "@/models/users/User";
import { compare } from "bcrypt";
import { StatusCodes } from "http-status-codes";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { username, password } = credentials;

        const user = await User.findOne({ where: { username } });

        if (!user) {
          throw new Error(
            JSON.stringify({
              status: StatusCodes.NOT_FOUND,
              message: "Username not found.",
            })
          );
        }

        const isValid = await compare(password, user.password);
        if (!isValid) {
          throw new Error(
            JSON.stringify({
              status: StatusCodes.UNAUTHORIZED,
              message: "Password is incorrect",
            })
          );
        }

        if (user.status === 0) {
          throw new Error(
            JSON.stringify({
              status: StatusCodes.BAD_REQUEST,
              message: "Account is not active",
            })
          );
        }

        return {
          id: user.id,
          username: user.username,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          image: user.image,
          active_trx: user.active_trx,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) Object.assign(token, user);
      return token;
    },

    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },

  pages: {
    signIn: "/auth/sign-in",
  },
};
