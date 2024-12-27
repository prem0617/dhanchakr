import { getUserId } from "@/helpers/getUserId";
import { db } from "@/lib/primsa";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { transactionId } = await req.json();

    if (!transactionId) {
      return NextResponse.json(
        { error: "Transaction ID not Found" },
        { status: 404 }
      );
    }

    const userId = await getUserId(req);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: Unable to retrieve user ID." },
        { status: 401 }
      );
    }

    // Fetch the transaction to validate ownership and retrieve account details
    const transaction = await db.transaction.findUnique({
      where: { id: transactionId },
      include: { account: true }, // Include account details
    });

    if (!transaction || transaction.userId !== userId) {
      return NextResponse.json(
        { error: "Transaction not found or unauthorized." },
        { status: 404 }
      );
    }

    // Ensure the amount is treated as a number
    const amount = Number(transaction.amount); // Convert the string amount to a number

    // Check the type of the transaction (INCOME or EXPENSE) and adjust the balance accordingly
    let updatedBalance;
    if (transaction.type === "EXPENSE") {
      updatedBalance = Number(transaction.account.balance) + Math.abs(amount); // For expense, we add the amount back to balance
    } else if (transaction.type === "INCOME") {
      updatedBalance = Number(transaction.account.balance) - Math.abs(amount); // For income, we subtract the amount from balance
    } else {
      return NextResponse.json(
        { error: "Invalid transaction type" },
        { status: 400 }
      );
    }

    // Delete the transaction
    const deletedTransaction = await db.transaction.delete({
      where: { id: transactionId },
    });

    // Update the account balance
    await db.account.update({
      where: { id: transaction.accountId },
      data: {
        balance: updatedBalance,
      },
    });

    return NextResponse.json(deletedTransaction);
  } catch (error) {
    console.error("Error in Delete Transaction:", error);
    return NextResponse.json(
      { error: error.message || "Error in Delete Transaction" },
      { status: 500 }
    );
  }
}
