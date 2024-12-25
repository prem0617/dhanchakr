import { getUserId } from "@/helpers/getUserId";
import { db } from "@/lib/primsa";
import { NextResponse } from "next/server";

function toISO8601(date) {
  // Ensure the input is a valid Date object
  const validDate = new Date(date);

  if (isNaN(validDate.getTime())) {
    throw new Error("Invalid date provided");
  }

  return validDate.toISOString();
}

function nextRecurringDate(startDate, interval) {
  const date = new Date(startDate);

  switch (interval) {
    case "DAILY":
      date.setDate(date.getDate() + 1);
      break;
    case "WEEKLY":
      date.setDate(date.getDate() + 7);
      break;
    case "MONTHLY":
      date.setMonth(date.getMonth() + 1);
      break;
    case "YEARLY":
      date.setFullYear(date.getFullYear() + 1);
      break;
  }

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
    } = await req.json();

    // if (!amount || !expenseType || !accountId || !category || !date) {
    //   return NextResponse.json(
    //     { error: "Fill All The Required Field", success: false },
    //     { status: 400 }
    //   );
    // }

    // Generate through CHATGPT

    if (!expenseType) {
      return NextResponse.json(
        { error: "Expense Type is required", success: false },
        { status: 400 }
      );
    }

    if (!amount) {
      return NextResponse.json(
        { error: "Amount is required", success: false },
        { status: 400 }
      );
    }

    if (!accountId) {
      return NextResponse.json(
        { error: "Account is required", success: false },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: "Category is required", success: false },
        { status: 400 }
      );
    }

    if (!date) {
      return NextResponse.json(
        { error: "Date is required", success: false },
        { status: 400 }
      );
    }

    // console.log({
    //   amount,
    //   expenseType,
    //   accountId,
    //   category,
    //   date,
    //   description,
    //   isRecurring,
    //   recurringInterval,
    // });

    const userId = await getUserId(req);

    console.log(userId);

    // check user login chhe k nai

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: Unable to retrieve user ID." },
        { status: 401 }
      );
    }

    const isAccountExixit = await db.account.findUnique({
      where: {
        id: accountId,
        userId: userId,
      },
    });

    if (!isAccountExixit)
      return NextResponse.json(
        { error: "Account Not Found", success: false },
        { status: 404 }
      );

    const splitedDate = date.split("{")[0];
    // console.log(splitedDate);

    const formatedDate = toISO8601(splitedDate);
    // console.log(formatedDate);

    const numericAmount = parseFloat(amount);

    const balanceChanged =
      expenseType === "INCOME" ? numericAmount : -numericAmount;

    console.log("Balance changed", balanceChanged);

    const newBalance = isAccountExixit.balance.toNumber() + balanceChanged;

    console.log("new balance : ", newBalance);

    const newTransaction = await db.transaction.create({
      data: {
        amount: numericAmount,
        description,
        date: formatedDate,
        category,
        type: expenseType,
        isRecurring,
        recurringInterval,
        nextRecurringDate:
          isRecurring && recurringInterval
            ? nextRecurringDate(date, recurringInterval)
            : null,
        user: { connect: { id: userId } },
        account: { connect: { id: accountId } },
      },
    });

    await db.account.update({
      where: {
        userId: userId,
        id: accountId,
      },
      data: {
        balance: parseFloat(newBalance),
      },
    });

    return NextResponse.json({ newTransaction, success: true });
  } catch (error) {
    console.log(error.message || error || "Error in Add Transaction");
    return NextResponse.json(
      {
        error: error.message || error || "Error in Add Transaction",
      },
      { status: 500 }
    );
  }
}
