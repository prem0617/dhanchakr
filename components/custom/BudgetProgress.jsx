import { useMemo, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, IndianRupee, Loader2, PencilIcon, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { Cell, Pie, PieChart, Legend, Tooltip } from "recharts";

const BudgetProgress = ({
  initicalAmount,
  currentExpense,
  budgetSet,
  transactions,
}) => {
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

  const categoryTotals = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {};
    }

    const result = {};
    for (const tr of transactions) {
      if (!tr.category) continue;

      if (result[tr.category]) {
        result[tr.category] += Number(tr.amount);
      } else {
        result[tr.category] = Number(tr.amount);
      }
    }
    return result;
  }, [transactions]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const pieData = Object.entries(categoryTotals).map(([category, amount]) => ({
    name: category,
    value: Number(amount), // Ensure amount is a number
  }));

  // console.log("pieData:", pieData);

  return (
    <div>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600">
          <CardTitle className="text-white">
            Monthly Budget (Default Account)
          </CardTitle>
        </CardHeader>
        {isBudgetSet ?
          <CardContent className="p-6">
            {isEdit ?
              <div className="flex gap-2 items-center mb-4">
                <Input
                  className="w-full md:w-[200px] h-[36px] text-lg"
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
                  {isPending ?
                    <Loader2 className="animate-spin w-5 h-5" />
                  : <Check className="text-green-500 w-5 h-5" />}
                </Button>
              </div>
            : <div className="text-lg text-gray-700 my-2 flex items-center justify-between">
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
            }
            <Progress
              value={percentage}
              className="my-4 h-3"
              extraStyles={`${
                percentage >= 90 ? "bg-red-500"
                : percentage >= 70 ? "bg-yellow-500"
                : "bg-green-500"
              }`}
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>{currentExpense} spent</span>
              <span>{percentage?.toFixed(2)}% used</span>
            </div>
          </CardContent>
        : <CardContent className="p-6 space-y-4">
            <div className="text-xl text-gray-700">Your budget is not set</div>
            <Button
              className="bg-blue-500 hover:bg-blue-600 transition-colors"
              onClick={() => setIsBudgetSet(true)}
            >
              Set Budget
            </Button>
          </CardContent>
        }
      </Card>

      {pieData.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Expense Breakdown by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-72 flex justify-center">
              <PieChart width={400} height={280}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value}`} />
                <Legend />
              </PieChart>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BudgetProgress;
