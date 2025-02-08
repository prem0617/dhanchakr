import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOtpEmail } from "@/helpers/sendMail";
import { db } from "@/lib/primsa";

export async function POST(request) {
  try {
    const { email } = await request.json();

    // Check is all the detial is availabale or not
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      console.error("Invalid email format");
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if email already exists

    const isEmailExists = await db.user.findUnique({ where: { email } });
    if (!isEmailExists) {
      return NextResponse.json(
        { error: "Email is not exists. Please signup." },
        { status: 400 }
      );
    }

    // generate otp

    const otp = Math.floor(100000 + Math.random() * 900000);

    // generate token

    const token = jwt.sign(
      { id: isEmailExists.id, email: isEmailExists.email },
      process.env.JWT_SECRET || "odksp0-3#%^&DJSk",
      { expiresIn: "1h" }
    );

    // TODO: send mail to user on email

    // Save otp in database

    await db.user.update({
      where: { id: isEmailExists.id },
      data: { forgotPasswordOtp: otp.toString() },
    });

    let otpString = otp.toString();

    await sendOtpEmail({ email, otp: otpString, token, type: "forgotPass" });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ error: error.message || "Error in Signup" });
  }
}
