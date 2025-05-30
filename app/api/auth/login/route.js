import { db } from "@/lib/primsa";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // ✅ Check for missing fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required", success: false },
        { status: 400 }
      );
    }

    // ✅ Email format validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format", success: false },
        { status: 400 }
      );
    }

    const isUserExist = await db.user.findUnique({ where: { email: email } });

    if (!isUserExist) {
      return NextResponse.json(
        { error: "User not found", success: false },
        { status: 404 }
      );
    }

    if (isUserExist && !isUserExist.isVerified)
      return NextResponse.json(
        { error: "User not verified", success: false },
        { status: 401 }
      );

    const isPasswordMatch = await bcrypt.compare(
      password,
      isUserExist.password
    );

    if (!isPasswordMatch)
      return NextResponse.json(
        { error: "Password not matched", success: false },
        { status: 400 }
      );

    const payload = {
      id: isUserExist.id,
      email: isUserExist.email,
    };

    const response = NextResponse.json(
      { message: "User login successful", success: true },
      { status: 200 }
    );

    const jwtToken = await jwt.sign(payload, process.env.JWT_SECRET);

    response.cookies.set("jwttoken", jwtToken, {
      httpOnly: true,
      sameSite: "Strict",
      path: "/", // Makes the cookie accessible across the site
      maxAge: 10 * 24 * 60 * 60, // 10 days in seconds
    });

    return response;
  } catch (error) {
    console.error(error.message);
    return NextResponse.json(
      { error: "Internal Server Error In Login Route", success: false },
      { status: 500 }
    );
  }
}
