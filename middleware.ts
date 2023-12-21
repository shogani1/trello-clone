import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: ["/", "/api/webhook"],
  afterAuth(auth, request) {
    if (auth.userId && auth.isPublicRoute) {
      let path = "/select-org";
      if (auth.orgId) {
        path = `/organization/${auth.orgId}`;
      }
      const orgSelection = new URL(path, request.url);
      return NextResponse.redirect(orgSelection);
    }
    if (!auth.userId && !auth.isPublicRoute)
      return redirectToSignIn({ returnBackUrl: request.url });
    if (
      auth.userId &&
      !auth.orgId &&
      request.nextUrl.pathname !== "/select-org"
    ) {
      const newPath = new URL("/select-org", request.url);
      return NextResponse.redirect(newPath);
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
