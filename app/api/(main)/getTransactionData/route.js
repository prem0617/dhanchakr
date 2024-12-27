import { getUserId } from "@/helpers/getUserId";
import { db } from "@/lib/primsa";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { transactionId } = await req.json();
    console.log(transactionId);

    const userId = await getUserId(req);

    // check user login chhe k nai

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: Unable to retrieve user ID." },
        { status: 401 }
      );
    }

    const transactionAcc = await db.Transaction.findUnique({
      where: {
        userId: userId,
        id: transactionId,
      },
    });

    if (!transactionAcc)
      return NextResponse.json(
        { error: "Transaction not Found", success: false },
        { status: 404 }
      );

    return NextResponse.json({ transactionAcc });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: error.message || "Error in Get Transaction",
      },
      { status: 500 }
    );
  }
}
