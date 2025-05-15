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

const updateAccountBalance = async ({
  isSplit,
  participantsArray,
  accountId,
  userId,
  account,
  balanceAdjustment,
}) => {
  // console.log("Account : ", account);
  let totalParticipent;
  if (isSplit) totalParticipent = participantsArray.length;

  // console.log(balanceAdjustment);

  const updatedBalance =
    isSplit ?
      account.balance.toNumber() + balanceAdjustment / totalParticipent
    : account.balance.toNumber() + balanceAdjustment;

  // console.log(account.balance.toNumber());
  // console.log("updated balance : ", updatedBalance);

  const updatedAccount = await db.account.update({
    where: { id: accountId, userId },
    data: {
      balance: updatedBalance,
    },
  });

  // console.log(updatedAccount);

  return updatedAccount;
};

const findAccount = async ({ accountId, userId }) => {
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
  return account;
};

export async function POST(req) {
  try {
    let {
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
      isSplit,
      participants,
    } = await req.json();

    // console.log(participants);

    if (!expenseType || !amount || !accountId || !category || !date) {
      return NextResponse.json(
        {
          error: "All required fields must be provided",
          success: false,
        },
        { status: 400 }
      );
    }

    let userId = await getUserId(req);
    if (!userId) {
      return NextResponse.json(
        {
          error: "Unauthorized: Unable to retrieve user ID",
        },
        { status: 401 }
      );
    }

    let account;
    account = await findAccount({ accountId, userId });

    const formattedDate = toISO8601(date.split("{")[0]);
    const numericAmount = parseFloat(amount);
    let transaction,
      balanceAdjustment = 0;

    let splitAmount = isSplit && numericAmount / (participants.length + 1);

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
        (existingTransaction.type === "INCOME" ?
          existingTransaction.amount
        : -existingTransaction.amount);

      transaction = await db.transaction.update({
        where: { id: transactionId },
        data: {
          amount: isSplit ? splitAmount : numericAmount,
          description,
          date: formattedDate,
          category,
          type: expenseType,
          isRecurring,
          recurringInterval,
          nextRecurringDate:
            isRecurring && recurringInterval ?
              calculateNextRecurringDate(date, recurringInterval)
            : null,
        },
      });
    } else if (!isSplit) {
      balanceAdjustment =
        expenseType === "INCOME" ? numericAmount : -numericAmount;

      const accountBalance = account.balance;

      // console.log("Account balance", accountBalance);
      // console.log("Check amount : ");

      const checkedAmount = Number(accountBalance) + Number(balanceAdjustment);

      if (checkedAmount < 0) {
        return NextResponse.json(
          {
            error: `Cannot add Transaction. Account Balance is ${parseFloat(
              accountBalance
            ).toFixed(2)}`,
          },
          { status: 400 }
        );
      }

      transaction = await db.transaction.create({
        data: {
          amount: numericAmount,
          description: description,
          date: formattedDate,
          category,
          type: expenseType,
          isRecurring,
          recurringInterval,
          nextRecurringDate:
            isRecurring && recurringInterval ?
              calculateNextRecurringDate(date, recurringInterval)
            : null,
          user: { connect: { id: userId } }, // FIXED: Changed from participantUserId to userId
          account: { connect: { id: accountId } }, // FIXED: Changed from participantAccountId to accountId
        },
      });
    }

    // TODO : add splitType Unequal
    let participantsArray;
    if (isSplit) {
      balanceAdjustment =
        expenseType === "INCOME" ? numericAmount : -numericAmount;

      console.log(participants, "users array");

      // First, we need to get all userIds from emails
      const participantsWithUserIds = await Promise.all(
        participants.map(async (participant) => {
          // If userId is already provided, use it
          if (participant.userId) {
            return {
              userId: participant.userId,
              amount: splitAmount,
              accountId: participant.accountId,
            };
          }
          // Otherwise find user by email
          else if (participant.email) {
            try {
              const user = await db.user.findUnique({
                where: { email: participant.email },
                select: { id: true },
              });

              if (!user) {
                console.error(`User with email ${participant.email} not found`);
                return null;
              }

              return {
                userId: user.id,
                amount: splitAmount,
                accountId: participant.accountId,
              };
            } catch (error) {
              console.error(
                `Error finding user with email ${participant.email}:`,
                error
              );
              return null;
            }
          }
          return null;
        })
      );

      // Filter out any null values (users not found)
      participantsArray = participantsWithUserIds.filter((p) => p !== null);

      participantsArray.push({
        userId,
        amount: splitAmount,
        accountId,
      });

      console.log({ userId, amount: splitAmount, accountId }, "mainuser");
      console.log(participantsArray, "after user");

      for (let data of participantsArray) {
        console.log("DATA : ", data);

        const participantUserId = data.userId;
        const participantAccountId = data.accountId;

        if (!participantUserId || !participantAccountId) {
          console.error("Missing userId or accountId for participant:", data);
          continue; // Skip this participant but continue with others
        }

        // Create transaction for each participant
        transaction = await db.transaction.create({
          data: {
            amount: splitAmount,
            description: "Split : " + description,
            date: formattedDate,
            category,
            type: expenseType,
            isRecurring,
            recurringInterval,
            nextRecurringDate:
              isRecurring && recurringInterval ?
                calculateNextRecurringDate(date, recurringInterval)
              : null,
            user: { connect: { id: participantUserId } },
            account: { connect: { id: participantAccountId } },
          },
        });

        try {
          const splitDetails = await db.splitDetails.create({
            data: {
              splitType: "EQUAL",
              user: { connect: { id: participantUserId } },
              transaction: {
                connect: { id: transactionId ? transactionId : transaction.id },
              },
              participants: participantsArray,
            },
          });
        } catch (error) {
          console.error("Error creating split details:", error);
        }

        // Find the account and update balance
        const participantAccount = await findAccount({
          accountId: participantAccountId,
          userId: participantUserId,
        });

        if (participantAccount) {
          const updatedAccount = await updateAccountBalance({
            isSplit,
            participantsArray,
            accountId: participantAccountId,
            userId: participantUserId,
            account: participantAccount,
            balanceAdjustment,
          });
        } else {
          console.error(
            `Account not found for userId: ${participantUserId}, accountId: ${participantAccountId}`
          );
        }
      }
    } else {
      // jo split transaction na hoy to aek j account ne update karvanu aetle...

      const updatedAccount = await updateAccountBalance({
        isSplit,
        participantsArray,
        accountId,
        userId,
        account,
        balanceAdjustment,
      });
    }

    return NextResponse.json({ transaction, participantsArray, success: true });
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
