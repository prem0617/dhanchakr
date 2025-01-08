import { SendEmail } from "@/emails/sendEmail";
import { db } from "../primsa";
import { inngest } from "./client";
import EmailTemplate from "@/emails/template";

export const sendBudgetAlert = inngest.createFunction(
  { id: "send-budget-alerts" },
  { cron: "0 */6 * * *" },
  async ({ step }) => {
    const budgets = await step.run("fetch-budget", async () => {
      return await db.budget.findMany({
        include: {
          user: {
            include: {
              accounts: {
                where: {
                  isDefault: true,
                },
              },
            },
          },
        },
      });
    });

    for (const budget of budgets) {
      const defaultAccount = budget.user.accounts[0];
      if (!defaultAccount) {
        continue;
      }

      await step.run(`fetch-expense-${budget.id}`, async () => {
        const currentDate = new Date();
        const startOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );

        const endOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        );

        console.log({ startOfMonth, endOfMonth });

        const account = await db.transaction.aggregate({
          where: {
            userId: budget.userId,
            accountId: defaultAccount.id,
            type: "EXPENSE",
            date: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
          _sum: {
            amount: true,
          },
        });

        console.log(account);

        const totalExpense = account._sum.amount?.toNumber() || 0;

        const budgetAmount = budget.amount;

        const percenage = (totalExpense / budgetAmount) * 100;

        if (percenage > 85) {
          //send email

          await SendEmail({
            to: budget.user.email,
            subject: `Budget Alert for ${defaultAccount.name}`,
            react: EmailTemplate({
              userName: budget?.user?.name,
              type: "budget-alert",
              data: {
                budgetAmount: parseInt(budgetAmount),
                totalExpenses: parseInt(totalExpense),
                percenage,
              },
            }),
          });

          // update lastAlertSent
          await db.budget.update({
            where: {
              id: budget.id,
            },
            data: {
              lastAlertSent: new Date(),
            },
          });
        }

        console.log(account);
      });
    }
  }
);
