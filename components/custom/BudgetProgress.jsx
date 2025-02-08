"use client";

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2, PencilIcon, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const BudgetProgress = ({ initicalAmount, currentExpense, budgetSet }) => {
  const percentage = initicalAmount && (currentExpense / initicalAmount) * 100;

  const [isBudgetSet, setIsBudgetSet] = useState(budgetSet);
  const [isEdit, setIsEdit] = useState(false);
  const [amount, setAmount] = useState(initicalAmount);

  const queryClient = useQueryClient();

  const { mutate: updateBudget, isPending } = useMutation({
    mutationFn: async (amount) => {
      try {
        const response = await axios.post("/api/updateBudget", { amount });
        if (response.data.error)
          throw new Error(
            response.error.message || response.error || "Error in Update Budget"
          );
        return response.data;
      } catch (error) {
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
    updateBudget(amount);
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600">
        <CardTitle className="text-white">
          Monthly Budget (Default Account)
        </CardTitle>
      </CardHeader>
      {isBudgetSet ? (
        <CardContent className="p-6">
          {isEdit ? (
            <div className="flex gap-2 items-center mb-4">
              <Input
                className="w-[200px] h-[36px] text-lg"
                placeholder={amount}
                type="number"
                onChange={(e) => setAmount(e.target.value)}
              />
              <Button
                variant="outline"
                className="h-[36px] w-[36px] p-0"
                onClick={() => setIsEdit((prev) => !prev)}
              >
                <X className="text-red-500 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                className="h-[36px] w-[36px] p-0"
                onClick={handleBudgetChange}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <Check className="text-green-500 w-5 h-5" />
                )}
              </Button>
            </div>
          ) : (
            <div className="text-lg text-gray-700 my-2 flex items-center justify-between">
              <span>
                {currentExpense} of {initicalAmount} Spent
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700"
                onClick={() => setIsEdit((prev) => !prev)}
              >
                <PencilIcon className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          )}
          <Progress
            value={percentage}
            className="my-4 h-3"
            extraStyles={`${percentage >= 90 ? "bg-red-500" : percentage >= 70 ? "bg-yellow-500" : "bg-green-500"}`}
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>{currentExpense} spent</span>
            <span>{percentage?.toFixed(2)}% used</span>
          </div>
        </CardContent>
      ) : (
        <CardContent className="p-6 space-y-4">
          <div className="text-xl text-gray-700">Your budget is not set</div>
          <Button
            className="bg-blue-500 hover:bg-blue-600 transition-colors"
            onClick={() => setIsBudgetSet(true)}
          >
            Set Budget
          </Button>
        </CardContent>
      )}
    </Card>
  );
};

export default BudgetProgress;
