"use client";

import AddTransactionForm from "@/components/custom/AddTransactionForm";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const Transaction = () => {
  const { data: accounts, isLoading } = useQuery({ queryKey: ["accounts"] });

  console.log(accounts);

  return (
    <div className="max-w-80 sm:max-w-xl md:max-w-3xl mx-auto">
      <h1 className="gradient-title text-3xl sm:text-5xl">Add Transaction</h1>

      {!accounts && isLoading && (
        <div className="flex flex-col space-y-3 mt-5">
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      )}

      {accounts && !isLoading && accounts.length > 0 && (
        <AddTransactionForm accounts={accounts} />
      )}
    </div>
  );
};

export default Transaction;
