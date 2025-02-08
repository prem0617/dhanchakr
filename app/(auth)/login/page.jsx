"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, Lock, ChevronRight } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData) => {
      try {
        const response = await axios.post("../../api/auth/login", formData, {
          withCredentials: true,
        });
        if (response.data.error) throw new Error(response.data.error);
        return response.data.newUser;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Login successful");
      router.push(`/`);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "An unexpected error occurred";
      toast.error(errorMessage);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-4xl flex rounded-3xl shadow-2xl overflow-hidden bg-white">
        {/* Left side - Form */}
        <Card className="w-full md:w-1/2 p-8 bg-white">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <p className="text-gray-500 text-center text-sm">
              Sign in to continue to DhanChakr
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-10 py-6 bg-gray-50 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="pl-10 py-6 bg-gray-50 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>
              <Button
                disabled={isPending}
                className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:ring-4 focus:ring-blue-300"
              >
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    href={"/signup"}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300"
                  >
                    Create account
                  </Link>
                </p>
                <p className="text-sm text-gray-600">
                  Forgot Password?{" "}
                  <Link
                    href={"/forgotPassword"}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300"
                  >
                    Reset Password
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Right side - Image */}
        <div className="hidden md:block w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-indigo-600/90 mix-blend-multiply"></div>
          <div className="absolute inset-0 flex items-center justify-center text-white p-12">
            <div className="space-y-6 text-center">
              <h2 className="text-4xl font-bold animate-fade-in-up">
                Manage Your Finances
              </h2>
              <p className="text-lg text-gray-100 animate-fade-in-up animation-delay-300">
                Take control of your financial future with DhanChakr's powerful
                tools and insights
              </p>
              <div className="pt-6 animate-fade-in-up animation-delay-600">
                <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
