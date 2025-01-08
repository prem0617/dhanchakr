import React, { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2, PencilIcon, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const BudgetProgress = ({ initicalAmount, currentExpense }) => {
  const persenteage = initicalAmount && (currentExpense / initicalAmount) * 100;

  const [isEdit, setIsEdit] = useState(false);
  const [amount, setAmount] = useState(initicalAmount);

  console.log(amount);

  const queryClient = useQueryClient();

  const { mutate: updateBudget, isPending } = useMutation({
    mutationFn: async (amount) => {
      try {
        const response = await axios.post("/api/updateBudget", { amount });
        console.log(response);
        if (response.data.error)
          throw new Error(
            response.error.message || response.error || "Error in Update Budget"
          );
        return response.data;
      } catch (error) {
        console.log(error);
        throw new Error(error.message || error || "Error in Update Budget");
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["budget"] });
      toast.success("Budget Updated");
      setIsEdit((prev) => !prev);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleBudgetChange = () => {
    console.log("clicked");
    updateBudget(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Budget (Defalut Account)</CardTitle>
      </CardHeader>
      <CardContent>
        {isEdit ? (
          <div className="flex gap-2">
            <Input
              className="w-[200px] h-[28px]"
              placeholder={amount}
              //   value={amount}
              type="number"
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button
              variant="outline"
              className="h-[28px]"
              onClick={() => setIsEdit((prev) => !prev)}
            >
              <X className="text-red-500 w-6 h-6" />
            </Button>
            {isPending ? (
              <Button
                variant="outline"
                className="h-[28px]"
                onClick={handleBudgetChange}
              >
                <Loader2 className="animate-spin w-6 h-6" />
              </Button>
            ) : (
              <Button
                variant="outline"
                className="h-[28px]"
                onClick={handleBudgetChange}
              >
                <Check className="text-green-500 w-6 h-6" />
              </Button>
            )}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground my-2 flex items-center gap-2">
            {currentExpense} of {initicalAmount} Spent{" "}
            <PencilIcon
              className="w-4 h-4 cursor-pointer"
              onClick={() => setIsEdit((prev) => !prev)}
            />
          </div>
        )}
        <Progress
          value={persenteage}
          className=" my-4"
          extraStyles={`${
            persenteage >= 90
              ? "bg-red-500"
              : persenteage >= 70
                ? "bg-yellow-500"
                : "bg-green-500"
          }`}
        />
        <div className="flex justify-end text-sm text-muted-foreground my-2">
          <span>{persenteage?.toFixed(2)} % used</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetProgress;
