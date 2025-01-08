import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOtpEmail } from "@/helpers/sendMail";
import { db } from "@/lib/primsa";

export async function POST(request) {
  try {
    const { email, name, password } = await request.json();

    // Check is all the detial is availabale or not
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: "Fill all the Detail" },
        { status: 400 }
      );
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
    if (isEmailExists && isEmailExists.isVerified) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    if (isEmailExists && !isEmailExists.isVerified) {
      return NextResponse.json(
        {
          error:
            "Email is already registered but not verified. Please Check your Mail.",
        },
        { status: 400 }
      );
    }

    // hash password

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    // generate otp

    const otp = Math.floor(100000 + Math.random() * 900000);

    // create user

    const newUser = await db.user.create({
      data: { name, password: hashedPassword, email, otp: otp.toString() },
    });

    // generate token

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || "odksp0-3#%^&DJSk",
      { expiresIn: "1h" }
    );

    const updatedUser = await db.user.update({
      where: {
        id: newUser.id,
      },
      data: {
        verificationToken: token,
      },
    });

    // TODO: send mail to user on email

    let otpString = otp.toString();

    await sendOtpEmail({ email, otp: otpString, token });

    return NextResponse.json({ updatedUser, success: true }, { status: 201 });
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ error: error.message || "Error in Signup" });
  }
}
