import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/sign-in",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/account-settings/:path*",
    "/devices/:path*",
    "/maps/:path*",
    "/devices/:path*",
    "/acs-configuration/:path*",
    "/mikrotik-configuration/:path*",
    "/bot-configuration/:path*",
  ],
};
