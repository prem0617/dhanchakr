import React, { useEffect, useState } from "react";
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
import { CalendarIcon, IndianRupee, Loader2 } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "../ui/switch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import CreateAccountDrawer from "./CreateAccountDrawer";
import { defaultCategories } from "@/data/category";
import { useRouter, useSearchParams } from "next/navigation";
import ScanFile from "./ScanFile";

const AddTransactionForm = ({ accounts }) => {
  const [date, setDate] = useState();

  const defaultAccountId =
    accounts?.find((account) => account.isDefault)?.id ||
    (accounts?.length > 0 ? accounts[0].id : "");

  const [formData, setFormData] = useState({
    amount: "",
    expenseType: "",
    accountId: defaultAccountId, // Initialize with the default account ID
    category: "",
    date: "",
    description: "",
    isRecurring: false,
    recurringInterval: "",
    isSplit: false,
    participants: [],
    numberOfUsers: 0,
  });
  const filteredCategory = defaultCategories.filter(
    (data) => data.type === formData.expenseType
  );

  const router = useRouter();

  const searchParams = useSearchParams();

  const transactionId = searchParams.get("edit");

  const intervalArray = [
    { id: 1, name: "DAILY" },
    { id: 2, name: "WEEKLY" },
    { id: 3, name: "MONTHLY" },
    { id: 4, name: "YEARLY" },
  ];

  // console.log(filteredCategory);

  const queryClient = useQueryClient();

  // Use when user want to edit a Transaction

  let updateTransaction = false;

  console.log(formData);

  const { mutate } = useMutation({
    mutationFn: async ({ transactionId, updateTransaction }) => {
      try {
        console.log({ transactionId, updateTransaction });
        const response = await axios.post("/api/getTransactionData", {
          transactionId,
          updateTransaction,
        });
        // console.log(response);
        if (response.error) {
          throw new Error("Error in GetTransaction");
        }
        return response.data.transactionAcc;
      } catch (error) {
        console.log(error.message || error || "Error in GetTransaction");
        throw new Error(error.message || error || "Error in GetTransaction");
      }
    },
    onSuccess: (data) => {
      setFormData({
        amount: data.amount ?? "", // Use nullish coalescing for undefined/null
        expenseType: data.type ?? "",
        accountId: data.accountId ?? "",
        category: data.category ?? "",
        date: data.date ? new Date(data.date) : "", // Convert date safely
        description: data.description ?? "",
        isRecurring: !!data.isRecurring, // Ensure it's a boolean
        recurringInterval: data.isRecurring
          ? (data.recurringInterval ?? "")
          : "", // Handle conditionally
      });
      setDate(new Date(data.date));
    },
  });

  if (transactionId) {
    updateTransaction = true;
  }

  useEffect(() => {
    if (updateTransaction) mutate({ transactionId, updateTransaction });
  }, [transactionId]);

  // Use when user want to make new Transaction or add edit transaction

  const { mutate: addTransaction, isPending } = useMutation({
    mutationFn: async function ({
      formData,
      updateTransaction,
      transactionId,
    }) {
      const {
        amount,
        expenseType,
        accountId,
        category,
        date,
        description,
        isRecurring,
        recurringInterval,
        isSplit,
        participants,
        numberOfUsers,
      } = formData;

      try {
        console.log("updateTransaction", updateTransaction);

        const response = await axios.post("/api/addTransaction", {
          amount,
          expenseType,
          accountId,
          category,
          date,
          description,
          isRecurring,
          recurringInterval: isRecurring ? recurringInterval : null,
          updateTransaction,
          transactionId,
          isSplit,
          participants: isSplit ? participants : [],
          numberOfUsers: isSplit ? numberOfUsers : 0,
        });
        if (response.error || response.data.error)
          throw new Error(
            response.data.error || response.error || "Error in add transaction"
          );
        console.log(response);
        return response.data.transaction;
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
    console.log(formData);

    addTransaction({
      formData,
      updateTransaction,
      transactionId: transactionId ? transactionId : null,
    });
  };

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    setFormData((prev) => ({ ...prev, date: selectedDate }));
  };

  const handleScanData = (scanData) => {
    console.log(scanData);
    formData.amount = scanData.amount;
    if (scanData.date) {
      setDate(new Date(scanData.date));
      formData.date = scanData.date;
    }
    if (scanData.description) formData.description = scanData.description;
    if (scanData.category) formData.category = scanData.category;
    scanData.expenseType
      ? (formData.expenseType = scanData.expenseType)
      : formData.expenseType;

    console.log(formData);
  };

  // fetch split users account :

  const [splitAccount, setSplitAccount] = useState([]);

  const { mutate: getSplitAccout, isPending: pendingSplitAccount } =
    useMutation({
      mutationFn: async (email) => {
        try {
          console.log("fetching");
          const response = await axios.post("/api/getSplitAccounts", {
            email,
          });
          console.log(response.data);
          if (response.error)
            throw new Error(
              response.error.message ||
                response.error ||
                "Error in find Split Account"
            );
          return response.data;
        } catch (error) {
          console.log(error);
          throw new Error(
            error.message || error || "Error in find Split Account"
          );
        }
      },
      onSuccess: (data) => {
        console.log(data);
        setSplitAccount(data.accounts);
      },
    });

  console.log("SPLIT ACCOUNT : ", splitAccount);

  splitAccount &&
    splitAccount?.map((account) => {
      console?.log("ACCoUNT  : ", account);
    });

  const handleFindUserAccount = ({ e, index }) => {
    e.preventDefault();
    console.log("button clicked");

    const email = formData?.participants[index]?.email;
    console.log(email);

    getSplitAccout(email);
  };

  // console.log( accounts);
  return (
    <div className="mt-5">
      <form action="" className="space-y-4" onSubmit={handleFormSubmit}>
        <ScanFile scanedData={handleScanData} />

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="type">
            Type
          </label>
          <Select
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, expenseType: value }))
            }
            value={formData.expenseType}
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
              value={formData.amount}
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
              value={formData.accountId}
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
            value={formData.category}
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
                value={formData.date}
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
            value={formData.description}
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
              value={formData.isRecurring}
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
              value={formData.recurringInterval}
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

        <div className="p-4 border rounded-xl flex items-center justify-between">
          <div>
            <p>Split Transaction</p>
            <p className="text-sm text-muted-foreground">
              Split this transaction between multiple accounts
            </p>
          </div>
          <div>
            <Switch
              value={formData.isSplit}
              onCheckedChange={(value) =>
                setFormData((prev) => ({ ...prev, isSplit: value }))
              }
            />
          </div>
        </div>

        {formData.isSplit && (
          <div>
            {/* Input to specify the number of users */}

            <label htmlFor="numberOfUser" className="text-sm font-medium">
              How many User
            </label>

            <Input
              type="number"
              id="numberOfUser"
              placeholder="Split transaction among how many users?"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  numberOfUsers: parseInt(e.target.value, 10) || 0, // Parse to integer
                }))
              }
            />

            {/* Dynamically render input fields based on the number of users */}
            {Array.from({ length: formData?.numberOfUsers || 0 }).map(
              (_, index) => (
                <div key={index} className="space-y-2 mt-2">
                  {/* Label for User */}
                  <label
                    className="text-sm font-medium"
                    htmlFor={`userId-${index}`}
                  >
                    User {index + 1}
                  </label>

                  {/* User ID Input and Find Account Button */}
                  <div className="flex gap-5">
                    <Input
                      id={`userId-${index}`}
                      type="text"
                      placeholder={`Email of User ${index + 1}`}
                      value={formData.participants[index]?.email || ""}
                      className="flex-1"
                      onChange={(e) => {
                        setFormData((prev) => {
                          const updatedParticipants = [...prev.participants];
                          updatedParticipants[index] = {
                            ...updatedParticipants[index],
                            email: e.target.value,
                          };
                          return { ...prev, participants: updatedParticipants };
                        });
                      }}
                    />

                    {/* Find User's Account Button */}
                    {pendingSplitAccount ? (
                      <Button
                        className="flex-1"
                        variant="secondary"
                        disabled
                        onClick={(e) => handleFindUserAccount({ e, index })}
                      >
                        <span className="flex items-center gap-2">
                          <Loader2 className="animate-spin" /> Loading
                        </span>
                      </Button>
                    ) : (
                      <Button
                        className="flex-1"
                        variant="secondary"
                        onClick={(e) => handleFindUserAccount({ e, index })}
                      >
                        Find User's Account
                      </Button>
                    )}
                  </div>

                  {/* Account Selection Dropdown */}
                  <Select
                    className="w-full"
                    value={formData.participants[index]?.accountId || ""}
                    onValueChange={(value) => {
                      setFormData((prev) => {
                        const updatedParticipants = [...prev.participants];
                        updatedParticipants[index] = {
                          ...updatedParticipants[index],
                          accountId: value, // Update the accountId for the current participant
                        };
                        return { ...prev, participants: updatedParticipants }; // Return updated state
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Account" />
                    </SelectTrigger>
                    <SelectContent>
                      {splitAccount && splitAccount.length > 0 ? (
                        splitAccount.map((data) => (
                          <SelectItem value={data.id} key={data.id}>
                            {console.log("Account  :  ", data)}
                            <div className="flex gap-20 md:w-auto">
                              <div>{data.name} </div>{" "}
                              <div className="flex">
                                <IndianRupee className="h-4 w-4" />
                                {data.balance}
                              </div>
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="Enter user ID" disabled>
                          Enter User's Id
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )
            )}
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
              Create Transaction
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddTransactionForm;
