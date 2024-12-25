import React, { useState } from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";

import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "../ui/switch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import CreateAccountDrawer from "./CreateAccountDrawer";
import { defaultCategories } from "@/data/category";
import { useRouter } from "next/navigation";

const AddTransactionForm = ({ accounts }) => {
  const [date, setDate] = useState();

  const [formData, setFormData] = useState({
    amount: "",
    expenseType: "",
    accountId: "",
    category: "",
    date: "",
    description: "",
    isRecurring: false,
    recurringInterval: this.isRecurring && "",
  });

  const filteredCategory = defaultCategories.filter(
    (data) => data.type === formData.expenseType
  );

  const router = useRouter();

  const intervalArray = [
    { id: 1, name: "DAILY" },
    { id: 2, name: "WEEKLY" },
    { id: 3, name: "MONTHLY" },
    { id: 4, name: "YEARLY" },
  ];

  // console.log(filteredCategory);

  const queryClient = useQueryClient();

  const { mutate: addTransaction, isPending } = useMutation({
    mutationFn: async function ({
      amount,
      expenseType,
      accountId,
      category,
      date,
      description,
      isRecurring,
      recurringInterval,
    }) {
      try {
        const response = await axios.post("/api/addTransaction", {
          amount,
          expenseType,
          accountId,
          category,
          date,
          description,
          isRecurring,
          recurringInterval: isRecurring ? recurringInterval : null,
        });
        if (response.error || response.data.error)
          throw new Error(
            response.data.error || response.error || "Error in add transaction"
          );
        console.log(response);
        return response.data.newTransaction;
      } catch (error) {
        throw new Error(
          error.response?.data?.error ||
            error.message ||
            "Error in add transaction"
        );
      }
    },
    onSuccess: async (data) => {
      console.log(data);
      await queryClient.invalidateQueries("accounts");
      await queryClient.invalidateQueries("accountData");
      toast.success("Transaction Added");
      router.push(`/account/${data.accountId}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // console.log(formData);

    // console.log({
    //   amount: formData.amount,
    //   expenseType: formData.expenseType,
    //   accountId: formData.accountId,
    //   category: formData.category,
    //   date: formData.date,
    //   description: formData.description,
    //   isRecurring: formData.isRecurring,
    //   recurringInterval: formData.isRecurring ? formData.recurringInterval : "",
    // });

    addTransaction(formData);
  };

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    setFormData((prev) => ({ ...prev, date: selectedDate }));
  };

  // console.log( accounts);
  return (
    <div className="mt-5">
      <form action="" className="space-y-4" onSubmit={handleFormSubmit}>
        <div>
          <label className="text-sm font-medium" htmlFor="image"></label>
          <Input type="text" placeholder="IMAGE" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="type">
            Type
          </label>
          <Select
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, expenseType: value }))
            }
          >
            <SelectTrigger className="w-full" id="type">
              <SelectValue
                placeholder="Type"
                className="text-muted-foreground"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EXPENSE">Expence</SelectItem>
              <SelectItem value="INCOME">Income</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* amount and Account */}
        <div className="flex md:flex-row flex-col gap-5">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium" htmlFor="amount">
              Amount
            </label>
            <Input
              type="text"
              placeholder="0.00"
              id="amount"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, amount: e.target.value }))
              }
            />
          </div>

          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium" htmlFor="account">
              Account
            </label>
            <Select
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, accountId: value }))
              }
            >
              <SelectTrigger className="w-full" id="account">
                <SelectValue
                  placeholder="Select Account"
                  className="text-muted-foreground"
                />
              </SelectTrigger>
              <SelectContent>
                {accounts?.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name} ({account.type}) - ₹
                    {parseFloat(account.balance).toFixed(2)}
                  </SelectItem>
                ))}
                <CreateAccountDrawer>
                  <Button
                    variant="goast"
                    className="w-full select-none items-center text-sm outline-none"
                  >
                    Create Account
                  </Button>
                </CreateAccountDrawer>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="category">
            Category
          </label>
          <Select
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, category: value }))
            }
          >
            <SelectTrigger className="w-full" id="category">
              <SelectValue
                placeholder="Select category"
                className="text-muted-foreground"
              />
            </SelectTrigger>
            <SelectContent>
              {filteredCategory?.length > 0 ? (
                filteredCategory?.map((data) => (
                  <SelectItem value={data.name} key={data.id}>
                    {data.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value={"none"} disabled>
                  Please select Type of Transaction First
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="date">
            Date
          </label>
          <Popover>
            <PopoverTrigger asChild id="date" className="w-full">
              <Button
                variant={"outline"}
                className={
                  "w-full pl-3 text-left font-normal flex justify-between"
                }
              >
                {date ? format(date, "PPP") : <span>Pick a date</span>}
                <CalendarIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                initialFocus
                disabled={(date) => date > new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* description */}
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="description">
            Description
          </label>
          <Input
            type="text"
            id="description"
            placeholder="Enter description"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </div>

        <div className="p-4 border rounded-xl flex items-center justify-between">
          <div>
            <p>Recurring Transaction</p>
            <p className="text-sm text-muted-foreground">
              Set up a recurring schedule for this transaction
            </p>
          </div>
          <div>
            <Switch
              onCheckedChange={(value) =>
                setFormData((prev) => ({ ...prev, isRecurring: value }))
              }
            />
          </div>
        </div>

        {formData.isRecurring && (
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="interval">
              Recurring Interval
            </label>
            <Select
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, recurringInterval: value }))
              }
            >
              <SelectTrigger id="interval">
                <SelectValue
                  placeholder="Select Interval"
                  className="text-muted-foreground"
                />
              </SelectTrigger>
              <SelectContent>
                {intervalArray.map((data) => (
                  <SelectItem value={data.name} key={data.id}>
                    {data.name.charAt(0) + data.name.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex gap-5">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex-1"
          >
            Cancle
          </Button>
          {isPending ? (
            <Button
              disabled
              className="flex-1 bg-blue-600 hover:bg-white hover:text-blue-600 hover:border-2"
            >
              <Loader2 className="animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit" className="flex-1">
              Create Account
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddTransactionForm;
