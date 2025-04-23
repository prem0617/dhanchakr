import { getUserId } from "@/helpers/getUserId";
import { db } from "@/lib/primsa";
import { NextResponse } from "next/server";
import Papa from "papaparse";

export async function POST(req) {
  try {
    const { accountId } = await req.json();
    // console.log(accountId);

    const userId = await getUserId(req);
    if (!userId)
      return NextResponse.json(
        { error: "Unauthorized: Unable to retrieve user ID." },
        { status: 401 }
      );

    const transactionData = await db.account.findUnique({
      where: {
        userId: userId,
        id: accountId,
      },
      select: {
        transactions: {
          select: {
            type: true,
            amount: true,
            description: true,
            date: true,
            category: true,
            isRecurring: true,
            nextRecurringDate: true,
          },
        },
      },
    });

    // console.log(transactionData);

    if (!transactionData || !transactionData.transactions.length) {
      return NextResponse.json({ error: "No transactions found." });
    }

    // Papa.unparse() convet the Array of objects into CSV format

    const csvData = Papa.unparse(transactionData.transactions);

    // console.log("CSV DATA", csvData);

    return new Response(csvData, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="expenses.csv"`,
      },
    });
  } catch (error) {
    // console.log(error.message || error || "Error in Make CSV File");
    return NextResponse.json({
      error: error.message || error || "Error in Make CSV File",
    });
  }
}
