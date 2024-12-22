"use client";

import React, { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "../ui/switch";

const CreateAccountDrawer = ({ children }) => {
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    balance: "",
    type: "",
    isDefault: false,
  });

  // const

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Account</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <form action="" className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Account Name
              </label>
              <Input
                type="text"
                id="name"
                required
                placeholder="Enter Name"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                Account Type
              </label>
              <Select
                required
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Account Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SAVINGS">SAVINGS</SelectItem>
                  <SelectItem value="CURRENT">CURRENT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="balance" className="text-sm font-medium">
                Initial Balance
              </label>
              <Input
                type="text"
                id="balance"
                required
                placeholder="1000"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, balance: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="isDefault" className="text-sm font-medium">
                Set as Default
              </label>
              <p className="text-sm text-muted-foreground">
                This account will be selected by default for Transaction
              </p>
              <Switch
                id="isDefault"
                onCheckedChange={(value) =>
                  setFormData((prev) => ({ ...prev, isDefault: value }))
                }
              />
            </div>

            <div className="flex gap-4 pt-4">
              <DrawerClose asChild>
                <Button variant="outline" className="flex-1">
                  Cancle
                </Button>
              </DrawerClose>
              <Button type="submit" className="flex-1">
                Create Account
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateAccountDrawer;
