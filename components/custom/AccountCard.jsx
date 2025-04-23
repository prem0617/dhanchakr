import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { CircleX, IndianRupee, Loader2 } from "lucide-react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const AccountCard = ({ data }) => {
  const { name, balance, type, isDefault, id } = data;
  const queryClient = useQueryClient();

  const { mutate: updateDefault, isPending } = useMutation({
    mutationFn: async (id) => {
      try {
        const response = await axios.post("/api/chengeDefaultAccount", { id });
        if (response.error || response.data.error)
          throw new Error(
            response.error ||
              response.data.error ||
              "Error in changing default account"
          );

        return response.data;
      } catch (error) {
        throw new Error(
          error.response?.data?.error ||
            error.message ||
            "Error in changing default account"
        );
      }
    },
    onSuccess: async (_, id) => {
      queryClient.setQueryData(["accounts"], (oldData) => {
        if (!oldData) return [];
        return oldData.map((acc) =>
          acc.id === id ?
            { ...acc, isDefault: true }
          : { ...acc, isDefault: false }
        );
      });
      await queryClient.invalidateQueries({ queryKey: ["budget"] });
      toast.success("Default Account Updated");
    },
  });

  const { mutate: deleteAccount, isPending: deleteAccountPending } =
    useMutation({
      mutationFn: async (accountId) => {
        try {
          const response = await axios.post(
            "/api/deleteAccount",
            { accountId },
            { withCredentials: true }
          );
          if (response.data.error) {
            throw new Error(response.data.error);
          }
          return response.data;
        } catch (error) {
          throw new Error(error.message || "Failed to delete account");
        }
      },
      onSuccess: async (_data, accountId) => {
        queryClient.setQueryData(["accounts"], (oldData) => {
          if (!oldData) return [];
          return oldData.filter((acc) => acc.id !== accountId);
        });
        toast.success("Account Deleted");
      },
    });

  const handleDelete = ({ e, accountId }) => {
    e.preventDefault();
    deleteAccount(accountId);
  };

  return (
    <Card className="group relative overflow-hidden bg-white hover:shadow-lg transition-all duration-300 border-none ring-1 ring-black/5 h-48">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <Link href={`account/${id}`}>
        <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
          <CardTitle className="text-lg font-semibold capitalize tracking-tight">
            {name}
          </CardTitle>

          <div className="flex items-center gap-4">
            {!isPending ?
              <Switch
                checked={data.isDefault}
                onClick={(e) => {
                  e.preventDefault();
                  if (isDefault) {
                    toast.error("One Account Must be Default");
                    return;
                  }
                  updateDefault(data.id);
                }}
                className="data-[state=checked]:bg-blue-600"
              />
            : <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
            {deleteAccountPending ?
              <Loader2 className="h-4 w-4 animate-spin text-red-600" />
            : <CircleX
                onClick={(e) => handleDelete({ e, accountId: data.id })}
                className="h-5 w-5 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
              />
            }
          </div>
        </CardHeader>

        <CardContent className="relative">
          <div className="flex flex-col space-y-1">
            <div className="text-2xl font-bold text-gray-900 flex items-center">
              <IndianRupee /> {parseFloat(balance).toFixed(2)}
            </div>
            <div className="text-sm text-gray-500 font-medium">
              {type.charAt(0) + type.slice(1).toLowerCase()} Account
            </div>
          </div>
        </CardContent>

        {/* <CardFooter className="relative grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2 text-sm">
            <div className="p-2 bg-green-50 rounded-full">
              <ArrowUpRight className="text-green-600 h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-gray-600 font-medium">Income</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <div className="p-2 bg-red-50 rounded-full">
              <ArrowDownRight className="text-red-600 h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-gray-600 font-medium">Expense</span>
            </div>
          </div>
        </CardFooter> */}
      </Link>
    </Card>
  );
};

export default AccountCard;
