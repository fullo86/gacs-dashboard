import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const pathname = req.nextUrl.pathname;

    const restrictedRoutes = [
      "/devices",
      "/maps",
      "/acs-configuration",
      "/mikrotik-configuration",
      "/bot-configuration",
    ];

    const isRestricted = restrictedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isRestricted && token?.active_trx !== 1) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/auth/sign-in",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/account-settings/:path*",
    "/devices/:path*",
    "/maps/:path*",
    "/acs-configuration/:path*",
    "/mikrotik-configuration/:path*",
    "/bot-configuration/:path*",
    "/history-transaction/:path*"
  ],
};
