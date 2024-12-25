"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import React from "react";

const Account = () => {
  const { id } = useParams();
  // console.log(id);

  const { data: accountData, isLoading } = useQuery({
    queryKey: ["accountData"],
    queryFn: async () => {
      try {
        const response = await axios.post(
          "/api/getAccount",
          { accountId: id },
          { withCredentials: true }
        );

        if (response.error || response.data.error)
          throw new Error(
            response.error || response.data.error || "Error in getAccout"
          );

        console.log(response);

        return response.data.account;
      } catch (error) {
        throw new Error(
          response.error || response.data.error || "Error in getAccout"
        );
      }
    },
  });

  if (!accountData && isLoading)
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[300px] w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-[100px] w-full" />
          <Skeleton className="h-[100px] w-full" />
        </div>
      </div>
    );

  console.log(accountData);

  return (
    <div className="space-y-8 px-5 flex items-end justify-between gap-4">
      <div>
        <h1 className="text-5xl sm:text-6xl font-bold gradient-title capitalize">
          {accountData.name}
        </h1>
        <p className="text-muted-foreground">
          {accountData.type.charAt(0) + accountData.type.slice(1).toLowerCase()}{" "}
          Account
        </p>
      </div>

      <div className="pb-2 text-right">
        <div className="text-xl sm:text-2xl font-bold">
          {parseFloat(accountData.balance).toFixed(2)}
        </div>
        <p className="text-sm text-muted-foreground">
          {accountData._count.transactions} Transactions
        </p>
      </div>

      {/* Chart Section */}

      {/* Transaction Table */}
    </div>
  );
};

export default Account;
