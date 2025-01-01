"use client";

import AccountChart from "@/components/custom/AccountChart";
import AddLimit from "@/components/custom/AddLimit";
import Transactiontable from "@/components/custom/Transactiontable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Account = () => {
  const { id } = useParams();

  const [transactionData, setTransactionData] = useState();

  const { mutate: getCSVFile, isPending: loadingCSV } = useMutation({
    mutationFn: async (id) => {
      try {
        const response = await axios.post(
          "/api/getCSVFile",
          { accountId: id },
          {
            responseType: "blob", // Ensures the response is treated as a file (binary data)
          }
        );
        console.log(response);
        if (response.error)
          throw new Error(
            response.error || response.error.message || "Error in Make CSV file"
          );
        return response.data;
      } catch (error) {
        throw new Error(error || error.message || "Error in Make CSV file");
      }
    },
    onSuccess: (data) => {
      console.log(data);
      const blob = new Blob([data], { type: "text/csv" });
      console.log(blob);

      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expenses.csv");
      document.body.appendChild(link);
      link.click();

      // Cleanup after the download
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });

  const handleCSVFile = () => {
    // console.log("Clicked");
    getCSVFile(id);
  };

  const {
    data: accountData,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["accountData", id],
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
    enabled: !!id,
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

  console.log(accountData?.transactions);

  // const [deleteIds, setDeleteIds] = useState([]);

  // console.log(deleteIds);

  return (
    <div className="space-y-8 px-5 ">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-5xl sm:text-6xl font-bold gradient-title capitalize">
            {accountData.name}
          </h1>
          <p className="text-muted-foreground">
            {accountData.type.charAt(0) +
              accountData.type.slice(1).toLowerCase()}{" "}
            Account
          </p>
          <p className="text-sm text-muted-foreground">
            Account id : {accountData?.id}
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
      </div>

      <AddLimit accountData={accountData} />

      {/* Chart Section */}

      {accountData.transactions && (
        <AccountChart transactions={accountData.transactions} />
      )}

      {/* Transaction Table */}

      {accountData.transactions && (
        <Transactiontable transactions={accountData.transactions} />
      )}
      <div className="flex justify-end w-full">
        {loadingCSV ? (
          <Button
            variant="outline"
            className={`bg-cyan-500 text-white hover:bg-cyan-700 hover:text-white w-[150px]`}
            disabled
          >
            <span className="flex justify-center items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading
            </span>
          </Button>
        ) : (
          <Button
            variant="outline"
            className={`bg-cyan-500 text-white hover:bg-cyan-700 hover:text-white transition-all duration-200 w-[150px]`}
            disabled={isLoading}
            onClick={handleCSVFile}
          >
            Export as CSV
          </Button>
        )}
      </div>
    </div>
  );
};

export default Account;
