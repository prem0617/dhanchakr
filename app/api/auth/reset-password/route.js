import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/primsa";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    const { newPassword, email } = await request.json();

    if (!newPassword || !email)
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );

    const findUser = await db.user.findUnique({
      where: { email: email },
    });

    // console.log(findUser);

    if (!findUser)
      return NextResponse.json(
        { error: "User not found. Please enter valid URL" },
        { status: 404 }
      );

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.user.update({
      where: { id: findUser.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json(
      {
        message: "Password changed",
        success: true,
      },
      { status: 200 }
    );

    // // Sign JWT token with the user data and an expiration
    // const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
    //   expiresIn: "1h",
    // });

    // // Set the JWT token as an HttpOnly cookie for security
    // response.cookies.set("jwttoken", jwtToken, {
    //   httpOnly: true,
    //   maxAge: 3600,
    // });

    // return response;
  } catch (error) {
    console.error("Error verifying account:", error.message); // Log error for debugging
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
