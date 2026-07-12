import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const protectedRoutes = [
    "/dashboard",
    "/career-dna",
    "/resume-builder",
    "/ai-mentor",
    "/placement",
    "/interview",
    "/opportunities",
    "/verify",   // changed from /analyze
    "/profile",
  ];

  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/career-dna/:path*",
    "/resume-builder/:path*",
    "/ai-mentor/:path*",
    "/placement/:path*",
    "/interview/:path*",
    "/opportunities/:path*",
    "/verify/:path*", // changed
    "/profile/:path*",
  ],
};