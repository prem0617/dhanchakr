"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import AccountCard from "@/components/custom/AccountCard";
import BudgetProgress from "@/components/custom/BudgetProgress";
import CreateAccountDrawer from "@/components/custom/CreateAccountDrawer";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";

const Dashboard = () => {
  const {
    data: accounts,
    isLoading: accountsLoading,
    isFetching: accountsFetching,
    error: accountsError,
    refetch: fetchAccounts,
    isRefetching,
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/getAccounts");
        console.log(response);
        if (response.error) throw new Error(response.error);
        return response.data.accounts;
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    },
  });

  const [defaultAccount, setDefaultAccount] = useState(null);

  const {
    data: budget,
    isLoading: budgetLoading,
    refetch,
  } = useQuery({
    queryKey: ["budget", defaultAccount],
    queryFn: async () => {
      // console.log(defaultAccount, "DEFULT");
      const response = await axios.post("/api/getCurrentBudget", {
        accountId: defaultAccount,
      });
      // console.log(response);
      if (response.data.error) throw new Error(response.data.error.message);
      return response.data;
    },
  });

  if (accounts && accounts.length) {
    const account = accounts.find((account) => account.isDefault)?.id;
    // console.log(account, "ACCOUNT");
    if (account !== defaultAccount) {
      setDefaultAccount(account);
    }
  }

  useEffect(() => {
    fetchAccounts();
    refetch();
  }, [fetchAccounts, refetch]); // Added dependencies to useEffect

  console.log({ defaultAccount });

  if (accountsLoading || isRefetching) {
    return (
      <div className="px-5 animate-pulse">
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[185px] w-full rounded-xl bg-gray-200" />
          <Skeleton className="h-[50px] w-1/3 rounded-lg bg-gray-200" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-[150px] w-full rounded-xl bg-gray-200" />
            <Skeleton className="h-[150px] w-full rounded-xl bg-gray-200" />
            <Skeleton className="h-[150px] w-full rounded-xl bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 space-y-8 mb-20">
      <div className="bg-gradient-to-r rounded-3xl overflow-hidden">
        <div className="px-8 py-10 bg-transparent">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">
            Welcome back!
          </h1>
          <p className="text-blue-400">Here's an overview of your finances</p>
        </div>
        <div className="bg-white px-8 py-10 rounded-t-3xl">
          {budgetLoading ?
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[185px] w-full rounded-xl" />
            </div>
          : budget ?
            <BudgetProgress
              initicalAmount={budget.budget}
              currentExpense={budget.currentExpense}
              transactions={budget.transactions}
              budgetSet={true}
            />
          : <BudgetProgress
              initicalAmount={0}
              currentExpense={0}
              budgetSet={false}
            />
          }
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Accounts</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CreateAccountDrawer>
            <Card className="hover:shadow-lg transition-all cursor-pointer border-dashed group">
              <CardContent className="flex flex-col items-center justify-center h-full py-10 text-muted-foreground">
                <Plus className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />
                <p className="text-lg font-medium group-hover:text-blue-600 transition-colors">
                  Add Account
                </p>
              </CardContent>
            </Card>
          </CreateAccountDrawer>

          {accounts?.length > 0 ?
            accounts.map((data, index) => (
              <div
                key={index}
                className="transform hover:scale-105 transition-all duration-300"
              >
                <AccountCard data={data} />
              </div>
            ))
          : <p className="col-span-full text-center text-gray-500 py-10">
              No accounts found. Please create one.
            </p>
          }
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
