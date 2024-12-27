import { getUserId } from "@/helpers/getUserId";
import { db } from "@/lib/primsa";
import { NextResponse } from "next/server";

function toISO8601(date) {
  const validDate = new Date(date);
  if (isNaN(validDate.getTime())) {
    throw new Error("Invalid date provided");
  }
  return validDate.toISOString();
}

function calculateNextRecurringDate(startDate, interval) {
  const date = new Date(startDate);
  const intervals = {
    DAILY: () => date.setDate(date.getDate() + 1),
    WEEKLY: () => date.setDate(date.getDate() + 7),
    MONTHLY: () => date.setMonth(date.getMonth() + 1),
    YEARLY: () => date.setFullYear(date.getFullYear() + 1),
  };
  if (intervals[interval]) intervals[interval]();
  return date;
}

export async function POST(req) {
  try {
    const {
      amount,
      expenseType,
      accountId,
      category,
      date,
      description,
      isRecurring,
      recurringInterval,
      transactionId,
      updateTransaction,
    } = await req.json();

    if (!expenseType || !amount || !accountId || !category || !date) {
      return NextResponse.json(
        {
          error: "All required fields must be provided",
          success: false,
        },
        { status: 400 }
      );
    }

    const userId = await getUserId(req);
    if (!userId) {
      return NextResponse.json(
        {
          error: "Unauthorized: Unable to retrieve user ID",
        },
        { status: 401 }
      );
    }

    const account = await db.account.findUnique({
      where: { id: accountId, userId },
    });
    if (!account) {
      return NextResponse.json(
        {
          error: "Account not found",
          success: false,
        },
        { status: 404 }
      );
    }

    const formattedDate = toISO8601(date.split("{")[0]);
    const numericAmount = parseFloat(amount);
    let transaction,
      balanceAdjustment = 0;

    if (updateTransaction) {
      const existingTransaction = await db.transaction.findUnique({
        where: { id: transactionId, userId },
      });
      if (!existingTransaction) {
        return NextResponse.json(
          {
            error: "Transaction not found",
            success: false,
          },
          { status: 404 }
        );
      }

      balanceAdjustment =
        (expenseType === "INCOME" ? numericAmount : -numericAmount) -
        (existingTransaction.type === "INCOME"
          ? existingTransaction.amount
          : -existingTransaction.amount);

      transaction = await db.transaction.update({
        where: { id: transactionId },
        data: {
          amount: numericAmount,
          description,
          date: formattedDate,
          category,
          type: expenseType,
          isRecurring,
          recurringInterval,
          nextRecurringDate:
            isRecurring && recurringInterval
              ? calculateNextRecurringDate(date, recurringInterval)
              : null,
        },
      });
    } else {
      balanceAdjustment =
        expenseType === "INCOME" ? numericAmount : -numericAmount;

      const accountBalance = account.balance;

      console.log("Account balance", accountBalance);
      console.log("Check amount : ");

      const checkedAmount = Number(accountBalance) + Number(balanceAdjustment);

      if (checkedAmount < 0) {
        return NextResponse.json({
          error: `Cannot add Transaction. Account Balance is ${parseFloat(
            accountBalance
          ).toFixed(2)}`,
        });
      }

      transaction = await db.transaction.create({
        data: {
          amount: numericAmount,
          description,
          date: formattedDate,
          category,
          type: expenseType,
          isRecurring,
          recurringInterval,
          nextRecurringDate:
            isRecurring && recurringInterval
              ? calculateNextRecurringDate(date, recurringInterval)
              : null,
          user: { connect: { id: userId } },
          account: { connect: { id: accountId } },
        },
      });
    }

    await db.account.update({
      where: { id: accountId, userId },
      data: { balance: account.balance.toNumber() + balanceAdjustment },
    });

    return NextResponse.json({ transaction, success: true });
  } catch (error) {
    console.error("Error in Add Transaction", error);
    return NextResponse.json(
      {
        error: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
