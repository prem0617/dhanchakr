"use client";

import AccountCard from "@/components/custom/AccountCard";
import CreateAccountDrawer from "@/components/custom/CreateAccountDrawer";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Plus } from "lucide-react";
import React from "react";

const Dashboard = () => {
  const { data: accounts, isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/getAccount");
        console.log(response);
        if (response.error || response.data.error)
          throw new Error(
            response.error || response.data.error || "Error in getAccout"
          );
        return response.data.accounts;
      } catch (error) {
        console.log(error);
        throw new Error(
          response.error || response.data.error || "Error in getAccout"
        );
      }
    },
  });

  console.log(accounts);

  return (
    <div className="px-5">
      Dashboard
      {/* Budget Progress */}
      {/* Overview */}
      {/* Account Grid */}
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
