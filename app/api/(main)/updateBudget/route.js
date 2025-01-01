import { getUserId } from "@/helpers/getUserId";
import { db } from "@/lib/primsa";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { amount } = await req.json();

    if (!amount)
      return NextResponse.json(
        { error: "Cannot Update Amout" },
        { status: 400 }
      );

    let userId = await getUserId(req);
    if (!userId) {
      return NextResponse.json(
        {
          error: "Unauthorized: Unable to retrieve user ID",
        },
        { status: 401 }
      );
    }

    if (!userId || !amount) {
      throw new Error("userId and amount must be provided");
    }

    const budget = await db.budget.upsert({
      where: {
        userId: userId,
      },
      update: {
        amount: parseFloat(amount),
      },
      create: {
        userId: userId,
        amount: parseFloat(amount),
      },
    });

    return NextResponse.json(budget);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error: error.message || error || "Error in Update Budget",
    });
  }
}
