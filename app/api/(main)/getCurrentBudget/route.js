import { getUserId } from "@/helpers/getUserId";
import { db } from "@/lib/primsa";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    let userId = await getUserId(req);
    if (!userId) {
      return NextResponse.json(
        {
          error: "Unauthorized: Unable to retrieve user ID",
        },
        { status: 401 }
      );
    }

    const { accountId } = await req.json();

    // console.log("account id", accountId);

    if (!accountId)
      return NextResponse.json(
        { error: "Account Id Require" },
        { status: 400 }
      );

    const budget = await db.budget.findFirst({
      where: {
        userId: userId,
      },
    });

    if (!budget)
      return NextResponse.json({ error: "Buget Not Found" }, { status: 404 });

    const currnetDate = new Date();
    const startOfMonth = new Date(
      currnetDate.getFullYear(),
      currnetDate.getMonth(),
      1
    );

    const endOfMonth = new Date(
      currnetDate.getFullYear(),
      currnetDate.getMonth() + 1,
      0
    );

    // Get transactions for the user in that month
    const transactions = await db.transaction.findMany({
      where: {
        userId: userId,
        type: "EXPENSE",
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        accountId,
      },
    });

    // Get total amount spent in that month
    const total = await db.transaction.aggregate({
      where: {
        userId: userId,
        type: "EXPENSE",
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        accountId,
      },
      _sum: {
        amount: true,
      },
    });

    // console.log(amount);

    return NextResponse.json({
      budget: budget.amount.toNumber() || null,
      currentExpense: total._sum.amount ? total._sum.amount.toNumber() : 0,
      transactions,
    });
  } catch (error) {
    // console.log(error.message);
    return NextResponse.json({
      error: error.message || error || "Error in Get Current Budget",
    });
  }
}
