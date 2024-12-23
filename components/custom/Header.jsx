"use client"; // Marking this as a client component

import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { CircleUserIcon, LayoutDashboard, PenBox } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

function Header() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
  });
  console.log(authUser);
  return (
    <div className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <nav className="container mx-auto p-4 flex items-center justify-between">
        <Link
          href={"/"}
          className="text-gray-600 hover:text-blue-600 flex items-center gap-2"
        >
          {/* <Image width={100} height={20}/> */}
          <p className="font-semibold text-3xl">Dhan Chakr</p>
        </Link>

        {authUser && !isLoading && (
          <div className="flex items-center space-x-4">
            <Link href={"/dashboard"}>
              <Button variant="outline">
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>

            <Link href={"/transaction/create"}>
              <Button>
                <PenBox size={18} />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </Link>

            <Popover>
              <PopoverTrigger>
                <div className="flex justify-center items-center gap-2 border-2 rounded-md px-4 py-[6px] cursor-pointer">
                  <CircleUserIcon size={18} />{" "}
                  <span className="text-sm font-medium">Profile</span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-96 mx-5 mt-2">
                <div>
                  <span className="font-medium">Name : </span> {authUser.name}
                </div>
                <div>
                  <span className="font-medium">Email :</span> {authUser.email}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
        {!authUser && !isLoading && <Button>Login</Button>}
      </nav>
    </div>
  );
}

export default Header;
