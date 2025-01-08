import { getUserId } from "@/helpers/getUserId";
import { db } from "@/lib/primsa";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json(
        {
          error: "Unauthorized user (User ae login nathi karyu)",
          success: false,
        },
        { status: 404 }
      );
    }

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
        email: true,
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not Found", success: false },
        { status: 400 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    // console.log(error.message || error || "Error in Get me Route");
    return NextResponse.json(
      {
        error: error || error.message || "Error in getme Route",
        success: false,
      },
      { status: 500 }
    );
  }
}
