"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useMutation } from "react-query";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const router = useRouter();

  const { mutate, isLoading } = useMutation({
    mutationFn: async (formData) => {
      try {
        const response = await axios.post("../../api/auth/login", formData, {
          withCredentials: true,
        });
        if (response.data.error) throw new Error(response.data.error);
        // console.log(response.data.error);
        return response.data.newUser;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to sign up");
      }
    },
    onSuccess: () => {
      toast.success("Login successful");
      router.push(`/`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };

  return (
    <div className="flex justify-center items-center h-screen p-5">
      {/* Combined container for form and image with a border */}
      <div className="flex border-2 border-gray-300 bg-gray-100 shadow-md rounded-lg">
        {/* Form Section */}
        <form
          action=""
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-[300px] py-10 px-5"
        >
          <h1 className="text-center font-bold text-blue-600 text-2xl py-3">
            Login to DhanChakr
          </h1>
          <div className="">
            <label htmlFor="email">Email : </label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              className="py-2"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="password">Password : </label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              className="py-2"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Don't Have An Accout?
            <Link href={"/signup"}> Click here</Link>
          </p>
          {isLoading ? (
            <Button
              disabled
              className="bg-blue-600 hover:bg-white hover:text-blue-600 hover:border-2"
            >
              <Loader2 className="animate-spin " />
              Please wait
            </Button>
          ) : (
            <Button className="bg-blue-600 hover:bg-white hover:text-blue-600 hover:border-2">
              Login
            </Button>
          )}
        </form>

        {/* Image Section */}
        <div className="w-[300px] h-[400px] sm:block hidden">
          <img
            src="https://st2.depositphotos.com/3591429/11260/i/450/depositphotos_112602256-stock-photo-group-of-business-colleagues.jpg"
            alt="WASTE IMAGE"
            className="w-full h-full object-cover rounded-r-md"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
