import { db } from "@/lib/primsa";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const allUsers = await db.user.findMany();

    return NextResponse.json(allUsers);
  } catch (error) {
    console.log(error.message || error || "Error in Get all users Route");
    return NextResponse.json(
      {
        error: error || error.message || "Error in all users Route",
        success: false,
      },
      { status: 500 }
    );
  }
}
