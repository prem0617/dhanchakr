"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import AccountCard from "@/components/custom/AccountCard";
import BudgetProgress from "@/components/custom/BudgetProgress";
import CreateAccountDrawer from "@/components/custom/CreateAccountDrawer";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";

const Dashboard = () => {
  // Fetch accounts
  const {
    data: accounts = [],
    isLoading: accountsLoading,
    isFetching: accountsFetching,
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const response = await axios.get("/api/getAccounts");
      return response.data;
    },
  });

  const defaultAccount = accounts.find((account) => account.isDefault)?.id;

  // Fetch budget for default account
  const { data: budget, isLoading: budgetLoading } = useQuery({
    queryKey: ["budget", defaultAccount],
    queryFn: async () => {
      if (!defaultAccount) return null;
      const response = await axios.post("/api/getCurrentBudget", {
        accountId: defaultAccount,
      });
      if (response.data.error) throw new Error(response.data.error.message);
      return response.data;
    },
    enabled: !!defaultAccount,
  });

  // Show loading skeleton while accounts are being fetched
  if (accountsLoading || accountsFetching) {
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
      {defaultAccount ? (
        budgetLoading ? (
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[185px] w-full rounded-xl" />
          </div>
        ) : budget ? (
          <BudgetProgress
            initicalAmount={budget.budget}
            currentExpense={budget.currentExpense}
          />
        ) : (
          <Card>
            <CardContent>
              <p>No budget found for the selected account.</p>
            </CardContent>
          </Card>
        )
      ) : (
        <Card>
          <CardContent>
            <p>Make one account as Default</p>
          </CardContent>
        </Card>
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
        {accounts.length > 0 ? (
          accounts.map((data, index) => <AccountCard key={index} data={data} />)
        ) : (
          <p>No accounts found. Please create one.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
