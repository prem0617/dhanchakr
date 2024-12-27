import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
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

import { Checkbox } from "../ui/checkbox";
import { format } from "date-fns";
import { categoryColors } from "@/data/category";
import { Badge } from "../ui/badge";
import { Clock, EllipsisVertical, Loader2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "../ui/button";

const Transactiontable = ({ transactions }) => {
  const filteredTransaction = transactions;

  const handleSort = (name) => {
    console.log(name);
  };

  const router = useRouter();

  const queryClient = useQueryClient();

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accountData"] });
      toast.success("Transaction Deleted");
    },
  });

  const handleDelete = (transactionId) => {
    console.log(transactionId);
    deleteTransaction(transactionId);
  };

  let [checkedIds, setCheckedIds] = useState([]);

  const handleAllCheckbox = ({ checked, filteredTransaction }) => {
    if (checked) {
      const ids = filteredTransaction.map((data) => data.id);
      // console.log(ids);
      setCheckedIds(ids);
    } else setCheckedIds([]);
  };

  const handleCheckBox = ({ checked, id: checkBoxId }) => {
    setCheckedIds(
      (prev) =>
        checked
          ? [...prev, checkBoxId] // Add the ID if checked
          : prev.filter((id) => id !== checkBoxId) // Remove the ID if unchecked
    );
  };

  const isAllSelected = checkedIds.length === filteredTransaction.length;

  console.log("Checked IDs:", checkedIds);

  const { mutate: bulkDelete } = useMutation({
    mutationFn: async (checkedIds) => {
      try {
        const response = await axios.post("/api/deleteBulkTransaction", {
          ids: checkedIds,
        });
        console.log(response);
        if (response.error)
          throw new Error(response.error || "Error in Bulk Delete");
      } catch (error) {
        console.log(error);
        throw new Error(error.message || error || "Error in Bulk Delete");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accountData"] });
      toast.success("Transaction Deleted");
    },
  });

  const handleBulkDelete = () => {
    console.log("Bulk Delete");
    bulkDelete(checkedIds);
  };

  return (
    <div className="w-full">
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
          className="mb-4 flex justify-end place-self-end"
          variant="goast"
        ></Button>
      )}

      {/* Filters */}

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
                <div className="flex items-center">Date</div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">Description</div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center">Category</div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center">Amount</div>
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
