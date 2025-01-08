import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/primsa";

export async function POST(request) {
  try {
    const { otp, token } = await request.json();

    // console.log({ token, otp });

    if (!otp || !token)
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );

    const findUser = await db.user.findUnique({
      where: { verificationToken: token },
    });

    // console.log(findUser);

    if (!findUser)
      return NextResponse.json(
        { error: "User not found. Please enter valid URL" },
        { status: 404 }
      );

    const payload = {
      id: findUser.id, // Ensure this is 'id' instead of '_id'
      email: findUser.email,
    };

    if (otp !== findUser.otp)
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });

    const updatedUser = await db.user.update({
      where: { verificationToken: token },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });

    const response = NextResponse.json(
      {
        message: "Otp verified successfully",
        success: true,
      },
      { status: 200 }
    );

    // Sign JWT token with the user data and an expiration
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set the JWT token as an HttpOnly cookie for security
    response.cookies.set("jwttoken", jwtToken, {
      httpOnly: true,
      maxAge: 3600,
    });

    return response;
  } catch (error) {
    console.error("Error verifying account:", error.message); // Log error for debugging
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
