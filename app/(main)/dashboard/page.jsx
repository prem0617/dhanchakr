"use client";

import AccountCard from "@/components/custom/AccountCard";
import BudgetProgress from "@/components/custom/BudgetProgress";
import CreateAccountDrawer from "@/components/custom/CreateAccountDrawer";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Plus } from "lucide-react";
import React from "react";

const Dashboard = () => {
  const { data: accounts, isLoading } = useQuery({ queryKey: ["accounts"] });

  console.log(accounts);

  let defaultAccount;

  if (accounts) {
    defaultAccount = accounts.find((account) => account.isDefault).id;
  }

  console.log("default : ", defaultAccount);

  const { data: budget, isLoading: loadQuery } = useQuery({
    queryKey: ["budget", defaultAccount],
    queryFn: async () => {
      try {
        const response = await axios.post("/api/getCurrentBudget", {
          accountId: defaultAccount,
        });

        console.log(response);
        if (response.data.error)
          throw new Error(
            response.data.error.message ||
              response.data.error ||
              "Error in Get Current Budget"
          );

        return response.data;
      } catch (error) {
        throw new Error(
          error.message || error || "Error in Get Current Budget"
        );
      }
    },
  });

  console.log(budget);

  if (!defaultAccount || !budget) {
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[305px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="px-5">
      {/* Budget Progress */}
      {defaultAccount && budget && (
        <BudgetProgress
          initicalAmount={budget?.budget}
          currentExpense={budget?.currentExpense}
        />
      )}

      {/* Overview */}
      {/* Account Grid */}
      <div className="mb-2 mt-4 pl-4 text-2xl font-semibold"> Account</div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CreateAccountDrawer>
          <Card className="hover:shadow-md transition-all cursor-pointer border-dashed">
            <CardContent className="flex flex-col items-center justify-center h-full pt-5 text-muted-foreground">
              <Plus className="w-10 h-10 mb-2" />
              <p className="text-sm font-medium">Add Account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>

        {accounts &&
          accounts.length > 0 &&
          !isLoading &&
          accounts.map((data, index) => (
            <AccountCard key={index} data={data} />
          ))}

        {!accounts && isLoading && (
          <>
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-full w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-full w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
