"use client"; // Marking this as a client component

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { CircleUserIcon, LayoutDashboard, PenBox } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useRouter } from "next/navigation";
import axios from "axios";

function Header() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
  });
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
    }
  }, [authUser]);

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      const response = await axios.get("/api/auth/logout");
      if (response.data.error) {
        throw new Error(response.data.error || "Error in Logout");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("authUser");
      queryClient.removeQueries("authUser");

      queryClient.removeQueries({ queryKey: ["authUser"] });

      setUser(null); // Clear user state
      router.push("/login");
    },
  });

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <nav className="container mx-auto p-4 flex items-center justify-between">
        <Link
          href={"/"}
          className="text-gray-600 hover:text-blue-600 flex items-center gap-2"
        >
          <p className="font-semibold text-3xl">Dhan Chakr</p>
        </Link>

        {user && !isLoading ? (
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
                  <CircleUserIcon size={18} />
                  <span className="text-sm font-medium">Profile</span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-96 mx-5 mt-2 space-y-2">
                <div>
                  <span className="font-medium">Name : </span> {user?.name}
                </div>
                <div>
                  <span className="font-medium">Email :</span> {user?.email}
                </div>
                <div>
                  <span className="font-medium">ID :</span> {user?.email}
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full border-red-500 border-2 text-red-500 hover:text-red-500"
                >
                  Logout
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          !isLoading && (
            <Link href={"/login"}>
              <Button>Login</Button>
            </Link>
          )
        )}
      </nav>
    </div>
  );
}

export default Header;
