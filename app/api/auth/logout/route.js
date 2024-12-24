import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const response = NextResponse.json({ message: "Logout Successful" });

    // Remove the 'jwt' cookie by setting an expiry date in the past
    response.cookies.delete("jwttoken", { path: "/" });

    return response;
  } catch (error) {
    console.log(error.message || error || "Error in Logout");
    return NextResponse.json({
      error: error.message || error || "Error in Logout",
    });
  }
}
