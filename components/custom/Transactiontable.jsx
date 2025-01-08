import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Checkbox } from "../ui/checkbox";
import { format } from "date-fns";
import { categoryColors } from "@/data/category";
import { Badge } from "../ui/badge";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  EllipsisVertical,
  Loader2,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const Transactiontable = ({ transactions }) => {
  // Sort and Filter Data :

  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "asc",
  });

  const handleSort = (field) => {
    setSortConfig((prev) => ({
      field,
      direction:
        prev.field == field && prev.direction === "desc" ? "asc" : "desc",
    }));
  };
  // console.log(sortConfig);

  const [searchValue, setSearchValue] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [isRecurring, setIsRecurring] = useState("");

  const clearFilter = () => {
    setSearchValue("");
    setTransactionType("");
    setIsRecurring("");
  };

  const filteredTransaction = useMemo(() => {
    let result = [...transactions];

    if (searchValue) {
      const searchLower = searchValue.toLowerCase();

      result = result.filter((data) =>
        data.description.toLowerCase().includes(searchLower)
      );
    }

    if (transactionType) {
      result = result.filter((data) => transactionType === data.type);
    }

    if (isRecurring) {
      result = result.filter((data) => {
        if (isRecurring === "recurring") return data.isRecurring;
        return !data.isRecurring;
      });
    }

    console.log(result.map((data) => data));

    result.sort((a, b) => {
      let comparision = 0;

      // console.log(sortConfig.field);

      switch (sortConfig.field) {
        case "date":
          comparision = new Date(a.date) - new Date(b.date);
          break;
        case "amount":
          comparision = a.amount - b.amount;
          break;
        case "category":
          comparision = a.category.localeCompare(b.category);
          break;
        default:
          comparision = 0;
      }

      // console.log(comparision);

      return sortConfig.direction === "asc" ? comparision : -comparision;
    });

    return result;
  }, [transactions, searchValue, transactionType, isRecurring, sortConfig]);

  const router = useRouter();

  const queryClient = useQueryClient();

  // Detele Transaction

  const { mutate: deleteTransaction, isPending } = useMutation({
    mutationFn: async (transactionId) => {
      try {
        const response = await axios.post("/api/deleteTransaction", {
          transactionId,
        });
        if (response.error)
          throw new Error(response.error || "Error in Delete Transaction");
        return response.data;
      } catch (error) {
        throw new Error(
          error || error.message || "Error in Delete Transaction"
        );
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["accountData"] });
      toast.success("Transaction Deleted");
    },
  });

  const handleDelete = (transactionId) => {
    // console.log(transactionId);
    deleteTransaction(transactionId);
  };

  // Select Transaction for Delete using Checkbox

  let [checkedIds, setCheckedIds] = useState([]);

  const handleAllCheckbox = ({ checked, filteredTransaction }) => {
    setCheckedIds((prev) =>
      prev.length === filteredTransaction.length
        ? []
        : filteredTransaction.map((t) => t.id)
    );
  };

  const handleCheckBox = ({ checked, id: checkBoxId }) => {
    setCheckedIds((prev) =>
      prev.includes(checkBoxId)
        ? prev.filter((id) => id != checkBoxId)
        : [...prev, checkBoxId]
    );
  };

  const isAllSelected =
    checkedIds.length === filteredTransaction.length && checkedIds.length > 0;

  // Bulk Delete function

  const { mutate: bulkDelete } = useMutation({
    mutationFn: async (checkedIds) => {
      try {
        const response = await axios.post("/api/deleteBulkTransaction", {
          ids: checkedIds,
        });
        // console.log(response);
        if (response.error)
          throw new Error(response.error || "Error in Bulk Delete");
      } catch (error) {
        // console.log(error);
        throw new Error(error.message || error || "Error in Bulk Delete");
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["accountData"] });
      toast.success("Transaction Deleted");
    },
  });

  const handleBulkDelete = () => {
    // console.log("Bulk Delete");
    bulkDelete(checkedIds);
  };

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-1 w-full gap-4">
        <div className="relative flex justify-center items-center w-full">
          <Search className="absolute left-3 w-4 h-4" />
          <Input
            placeholder="Search Transaction"
            className="pl-8"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <Select
            onValueChange={(value) => setTransactionType(value)}
            value={transactionType}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EXPENSE">Expense</SelectItem>
              <SelectItem value="INCOME">Income</SelectItem>
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) => setIsRecurring(value)}
            value={isRecurring}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Transaction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recurring">Recurring</SelectItem>
              <SelectItem value="non-recurring">Non-Recurring</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Button variant="outline" onClick={clearFilter} title="Clear Filters">
            <X /> Clear
          </Button>
        </div>
      </div>

      {checkedIds.length > 0 ? (
        isPending ? (
          <Button
            variant="destructive"
            className="mb-4 flex justify-end place-self-end"
            onClick={handleBulkDelete}
            disabled
          >
            <span className="flex">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading
            </span>
          </Button>
        ) : (
          <Button
            variant="destructive"
            className="my-4 flex justify-end place-self-end"
            onClick={handleBulkDelete}
          >
            Delete Transaction
          </Button>
        )
      ) : (
        <Button
          className="my-4 flex justify-end place-self-end"
          variant="goast"
        ></Button>
      )}

      {/* Tables */}

      <div className="rounded-md border ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={(checked) =>
                    handleAllCheckbox({ checked, filteredTransaction })
                  }
                />
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center">
                  Date{" "}
                  {sortConfig.field === "date" &&
                    (sortConfig.direction === "desc" ? (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">Description</div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center">
                  Category{" "}
                  {sortConfig.field === "category" &&
                    (sortConfig.direction === "desc" ? (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center">
                  Amount
                  {sortConfig.field === "amount" &&
                    (sortConfig.direction === "desc" ? (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">Recurring</div>
              </TableHead>

              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransaction.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground"
                >
                  No Transaction Found
                </TableCell>
              </TableRow>
            ) : (
              filteredTransaction.map((data) => (
                <TableRow key={data.id}>
                  <TableCell>
                    <Checkbox
                      checked={checkedIds.includes(data.id)}
                      onCheckedChange={(checked) =>
                        handleCheckBox({ checked, id: data.id })
                      }
                    />
                  </TableCell>
                  <TableCell>{format(new Date(data.date), "PP")}</TableCell>
                  <TableCell>{data?.description}</TableCell>
                  <TableCell>
                    <span
                      style={{
                        background: categoryColors[data.category],
                      }}
                      className="px-2 py-1 rounded text-white text-sm"
                    >
                      {data.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`${
                        data.type === "EXPENSE"
                          ? "text-red-500"
                          : "text-green-500"
                      } text-right font-medium`}
                    >
                      {data.type === "EXPENSE" ? "-" : "+"} {data?.amount}
                    </span>
                  </TableCell>
                  <TableCell>
                    {data?.isRecurring ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant={"outline"}
                              className={
                                "gap-1 cursor-pointer bg-blue-50 text-blue-500"
                              }
                            >
                              <RefreshCw className="h-3 w-3" />
                              {data.recurringInterval}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="bg-zinc-500">
                            <div>
                              <div className="font-medium">
                                Next Date :{" "}
                                <span className="font-normal">
                                  {format(
                                    new Date(data.nextRecurringDate),
                                    "PP"
                                  )}
                                </span>{" "}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Badge variant={"outline"} className={"gap-1"}>
                        <Clock className="h-3 w-3" />
                        One-Time
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <EllipsisVertical />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/transaction/create?edit=${data.id}`)
                          }
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            handleDelete(data.id);
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Transactiontable;
