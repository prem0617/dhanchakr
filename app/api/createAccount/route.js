import { getUserId } from "@/helpers/getUserId";
import { db } from "@/lib/primsa";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, type, balance, isDefault } = await req.json();

    // Input Validation
    if (
      !name ||
      typeof name !== "string" ||
      !type ||
      typeof type !== "string" ||
      !balance
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid input. Ensure all fields are provided and of the correct type.",
        },
        { status: 400 }
      );
    }

    const userId = await getUserId(req);

    // check user login chhe k nai

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

    // Jo user new default account banave to junu default account ne nikadavu pade ..

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
