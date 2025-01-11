"use client";

import React, { useEffect, useState } from "react";
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

  // Fetch budget for default account
  const {
    data: budget,
    isLoading: budgetLoading,
    refetch,
  } = useQuery({
    queryKey: ["budget", defaultAccount],
    queryFn: async () => {
      console.log(defaultAccount, "DEFULT");
      // if (!defaultAccount) return null; // Skip fetch if no default account
      const response = await axios.post("/api/getCurrentBudget", {
        accountId: defaultAccount,
      });
      if (response.data.error) throw new Error(response.data.error.message);
      return response.data;
    },
  });

  if (accounts && accounts.length) {
    const account = accounts.find((account) => account.isDefault)?.id;
    console.log(account, "ACCOUNT");
    if (account !== defaultAccount) {
      setDefaultAccount(account);
    }
  }

  useEffect(() => {
    fetchAccounts();
    refetch();
  }, []);

  console.log({ defaultAccount });

  // console.log(accounts?.accounts);

  // If accounts are still loading or fetching, show loading skeletons
  if (accountsLoading || isRefetching) {
    return (
      <div className="px-5">
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[185px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  // Render when accounts are available
  return (
    <div className="px-5">
      {/* Budget Progress */}
      {budgetLoading ? (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[185px] w-full rounded-xl" />
        </div>
      ) : budget ? (
        <BudgetProgress
          initicalAmount={budget.budget}
          currentExpense={budget.currentExpense}
          budgetSet={true}
        />
      ) : (
        <BudgetProgress
          initicalAmount={0}
          currentExpense={0}
          budgetSet={false}
        />
      )}

      {/* Overview */}
      <div className="mb-2 mt-4 pl-4 text-2xl font-semibold">Account</div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Add Account Button */}
        <CreateAccountDrawer>
          <Card className="hover:shadow-md transition-all cursor-pointer border-dashed">
            <CardContent className="flex flex-col items-center justify-center h-full pt-5 text-muted-foreground">
              <Plus className="w-10 h-10 mb-2" />
              <p className="text-sm font-medium">Add Account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>

        {/* Account List */}
        {accounts?.length > 0 ? (
          accounts.map((data, index) => (
            <div key={index}>
              <AccountCard data={data} />
            </div>
          ))
        ) : (
          <p>No accounts found. Please create one.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
