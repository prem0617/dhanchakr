"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const UsersPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["allusers"],
    queryFn: async () => {
      const response = await axios.get("/api/admin/getUsers");
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-blue-600" size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error fetching users: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 mt-20">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
        All Users
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data &&
          data.length > 0 &&
          data.map((user) => (
            <Card
              key={user.id}
              className="shadow-lg hover:shadow-xl transition duration-300 ease-in-out"
            >
              <CardContent className="p-5 flex flex-col items-center">
                <UserCircle className="text-blue-500" size={50} />
                <h2 className="text-xl font-semibold mt-4">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-400">ID: {user.id}</p>
                <div className="mt-4">
                  {user.isVerified ? (
                    <span className="text-green-500 font-medium">Verified</span>
                  ) : (
                    <span className="text-red-500 font-medium">
                      Not Verified
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default UsersPage;
