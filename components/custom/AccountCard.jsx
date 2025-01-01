import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Switch } from "../ui/switch";
import { ArrowDownRight, ArrowUpRight, Loader2 } from "lucide-react";
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
        console.log(response.data);
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

  return (
    <Card className="shadow-md transition-all">
      <Link href={`account/${id}`}>
        <CardHeader className="flex flex-row items-center justify-between pb-2 ">
          <CardTitle className="text-sm font-medium capitalize">
            {name}
          </CardTitle>

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
