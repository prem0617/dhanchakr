import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Switch } from "../ui/switch";
import {
  ArrowDownRight,
  ArrowUpRight,
  CircleX,
  Delete,
  EllipsisVertical,
  Loader2,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const AccountCard = ({ data }) => {
  // console.log(data);
  const { name, balance, type, isDefault, id } = data;

  const queryClient = useQueryClient();

  const { mutate: updateDefault, isPending } = useMutation({
    mutationFn: async (id) => {
      try {
        const response = await axios.post("/api/chengeDefaultAccount", { id });
        // console.log(response.data);
        if (response.error || response.data.error)
          throw new Error(
            response.error ||
              response.data.error ||
              "Error in changing default account"
          );

        return response.data;
      } catch (error) {
        throw new Error(
          response.error ||
            response.data.error ||
            "Error in changing default account"
        );
      }
    },
    onSuccess: async (_, id) => {
      await queryClient.invalidateQueries({ queryKey: ["accounts"] });
      await queryClient.invalidateQueries({ queryKey: ["budget", id] });

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
          // console.log(response);
          if (response.data.error) {
            throw new Error(response.data.error);
          }
          return response.data;
        } catch (error) {
          // console.log(error.message);
          throw new Error("Failed to delete account");
        }
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["accounts"] });
        toast.success("Account Deleted");
      },
    });

  const handleDelete = ({ e, accountId }) => {
    e.preventDefault();
    // console.log("Delete");
    // console.log(accountId);
    deleteAccount(accountId);
  };

  return (
    <Card className="shadow-md transition-all">
      <Link href={`account/${id}`}>
        <CardHeader className="flex flex-row items-center justify-between pb-2 ">
          <CardTitle className="text-sm font-medium capitalize">
            {name}
          </CardTitle>

          <div className="flex gap-3">
            {!isPending ? (
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
              />
            ) : (
              <Loader2 disabled className="animate-spin" />
            )}
            {deleteAccountPending ? (
              <Loader2 disabled className="animate-spin" />
            ) : (
              <CircleX
                onClick={(e) => handleDelete({ e, accountId: data.id })}
              />
            )}{" "}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {parseFloat(balance).toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground">
            {type.charAt(0) + type.slice(1).toLowerCase()} Account
          </div>
        </CardContent>
        <CardFooter className="space-x-2 flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <ArrowUpRight className="text-green-500 mr-1 h-4 w-4" /> Income
          </div>
          <div className="flex items-center">
            <ArrowDownRight className="text-red-500 mr-1 h-4 w-4" /> Expense
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default AccountCard;
