import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  // Extract token from cookies
  const tokenCookie = request.cookies.get("jwttoken");
  const token = tokenCookie?.value;

  // console.log("TOKEN:", token);

  const url = request.nextUrl.clone();

  // console.log(url);

  const protectedRoutes = ["/dashboard", "/createaccount", "/transaction"];
  const authRoutes = ["/login", "/signup"];

  // some method check karse : jo aek pan route hase to true return karse nai to false
  const isProtectedRoute = protectedRoutes.some((path) =>
    url.pathname.startsWith(path)
  );
  const isAuthRoute = authRoutes.some((path) => url.pathname === path);

  if (token) {
    try {
      // jsonwebtoken support nathi kartu aetle jose
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));

      // token valid hoy and auth route use karvano try kare to "/" page par redirect kare
      if (isAuthRoute) {
        url.pathname = "/";
        console.log(
          "Redirecting to homepage because user is already authenticated."
        );
        return NextResponse.redirect(url);
      }
    } catch (err) {
      console.error("JWT verification failed:", err.message);

      // token valid na hoy and protected route use kare to login par redirect
      const response = NextResponse.redirect(`${url.origin}/login`);

      return response;
    }
  } else {
    // token na hoy and protected route use kare to login par redirect
    if (isProtectedRoute) {
      url.pathname = "/login";
      console.log("Redirecting to login because user is not authenticated.");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/dashboard",
    "/createaccount/:path*",
    "/transaction",
  ],
};
