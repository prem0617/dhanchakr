import { getUserId } from "@/helpers/getUserId";
import { db } from "@/lib/primsa";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, type, balance, isDefault } = await req.json();

    // Input Validation
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Invalid name. It must be a non-empty string." },
        { status: 400 }
      );
    }

    if (!type || typeof type !== "string") {
      return NextResponse.json(
        { error: "Invalid account type. It must be a non-empty string." },
        { status: 400 }
      );
    }

    if (
      balance === undefined ||
      balance === null ||
      isNaN(parseFloat(balance))
    ) {
      return NextResponse.json(
        { error: "Balance must be a valid number." },
        { status: 400 }
      );
    }

    const userId = await getUserId(req);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: Unable to retrieve user ID." },
        { status: 401 }
      );
    }

    const exsitingAccount = await db.account.findMany({
      where: { userId },
    });

    const setDefalut = exsitingAccount.length === 0 ? true : isDefault;

    if (setDefalut) {
      await db.account.updateMany({
        where: {
          userId: userId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const newAccount = await db.account.create({
      data: {
        name,
        type,
        balance: parseFloat(balance),
        isDefault: setDefalut,
        user: { connect: { id: userId } },
      },
    });

    return NextResponse.json({
      newAccount,
      message: "Account created successfully.",
    });
  } catch (error) {
    console.error("Error in Create Account Route:", error.message);

    return NextResponse.json(
      { error: "Internal Server Error. Please try again later." },
      { status: 500 }
    );
  }
}
