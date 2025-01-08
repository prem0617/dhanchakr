import { getUserId } from "@/helpers/getUserId";
import { db } from "@/lib/primsa";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const userId = await getUserId(req);

    // console.log(userId);

    // check user login chhe k nai

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: Unable to retrieve user ID." },
        { status: 401 }
      );
    }

    const accounts = await db.account.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    return NextResponse.json({ accounts, success: true });
  } catch (error) {
    // console.log(error.message || error || "Error in Get Account Route");
    return NextResponse.json(
      {
        error: error.message || error || "Error in Get Account Route",
      },
      { status: 500 }
    );
  }
}
