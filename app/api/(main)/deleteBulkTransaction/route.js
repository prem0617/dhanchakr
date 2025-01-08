import { getUserId } from "@/helpers/getUserId";
import { db } from "@/lib/primsa";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { ids } = await req.json();
    // console.log(ids);

    const userId = await getUserId(req);

    // check user login chhe k nai

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: Unable to retrieve user ID." },
        { status: 401 }
      );
    }

    const deletedTransactions = [];

    for (const transactionId of ids) {
      const deletedTransaction = await db.transaction.delete({
        where: {
          id: transactionId,
        },
      });
      deletedTransactions.push(deletedTransaction); // Add each result to the array
    }

    let changedBalance = 0;

    let numericAmount;

    deletedTransactions.map(
      (transaction) => (
        (numericAmount = Number(transaction.amount)),
        (changedBalance +=
          transaction.type === "EXPENSE" ? numericAmount : -numericAmount)
      )
    );

    // console.log("Changed balance", changedBalance);

    // console.log(deletedTransactions);

    const account = await db.account.findUnique({
      where: { userId: userId, id: deletedTransactions[0].accountId },
    });

    // console.log(account);

    const changeAmount = Number(account.balance) + changedBalance;

    // console.log("Account ID : ", deletedTransactions[0].accountId);

    await db.account.update({
      where: { userId: userId, id: deletedTransactions[0].accountId },
      data: {
        balance: changeAmount,
      },
    });

    return NextResponse.json({ deletedTransactions, changedBalance });
  } catch (error) {
    // console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
}
