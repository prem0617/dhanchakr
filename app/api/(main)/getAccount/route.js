import { getUserId } from "@/helpers/getUserId";
import { db } from "@/lib/primsa";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { accountId } = await req.json();

    const userId = await getUserId(req);

    console.log(userId);

    // check user login chhe k nai

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: Unable to retrieve user ID." },
        { status: 401 }
      );
    }

    const account = await db.account.findUnique({
      where: {
        id: accountId,
        userId: userId,
      },
      include: {
        transactions: {
          orderBy: {
            date: "desc",
          },
        },
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    if (!account)
      return NextResponse.json({ error: "Account not found" }, { status: 404 });

    return NextResponse.json({ account, success: true });
  } catch (error) {
    console.log(error.message || error || "Error in Get Account Route");
    return NextResponse.json(
      {
        error: error.message || error || "Error in Get Account Route",
        success: false,
      },
      { status: 500 }
    );
  }
}
