"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, Lock, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    cpassword: "",
    name: "",
    username: "",
    otp: "",
  });

  const [token, setToken] = useState("");
  const [isOtpSend, setIsOtpSend] = useState(false);
  const router = useRouter();

  const { mutate: signUp, isPending: signUpPending } = useMutation({
    mutationFn: async (formData) => {
      try {
        const response = await axios.post("../../api/auth/signup", formData, {
          withCredentials: true,
        });
        if (response.data.error) throw new Error(response.data.error);
        return response.data.updatedUser;
      } catch (error) {
        const errorSend = error.response.data.error;
        throw new Error(errorSend);
      }
    },
    onSuccess: (data) => {
      setToken(data.verificationToken);
      setIsOtpSend(true);
      toast.success("Sign Up Success. Check your email to Verify your account");
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
  });

  const { mutate: addUser, isPending: addUserPending } = useMutation({
    mutationFn: async function ({ otp, token }) {
      try {
        const response = await axios.post("/api/auth/verifyOtp", {
          otp,
          token,
        });
        if (response.error) {
          throw new Error(response.error || "Error in OTP Verification");
        }
        return response;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Otp Verified");
      router.push("/");
    },
  });

  const sendOTP = (e) => {
    if (formData.password !== formData.cpassword) {
      toast.error("Passwords and Confirm Password is not same");
    } else {
      e.preventDefault();
      signUp(formData);
    }
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();

    const otp = formData.otp;
    addUser({ otp, token });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-4xl flex rounded-2xl shadow-2xl overflow-hidden bg-white">
        {/* Left side - Form */}
        <Card className="w-full md:w-1/2 p-8 bg-white">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Create Account
            </CardTitle>
            <p className="text-gray-500 text-center text-sm">
              Join DhanChakr to manage your finances better
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="pl-10 py-6 bg-gray-50 border-gray-200 focus:border-blue-500 rounded-xl"
                />
              </div>

              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="pl-10 py-6 bg-gray-50 border-gray-200 focus:border-blue-500 rounded-xl"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="pl-10 py-6 bg-gray-50 border-gray-200 focus:border-blue-500 rounded-xl"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Confirm password"
                  value={formData.cpassword}
                  onChange={(e) =>
                    setFormData({ ...formData, cpassword: e.target.value })
                  }
                  className="pl-10 py-6 bg-gray-50 border-gray-200 focus:border-blue-500 rounded-xl"
                />
              </div>

              {isOtpSend && (
                <div className="relative">
                  <Input
                    placeholder="Enter OTP"
                    value={formData.otp}
                    onChange={(e) =>
                      setFormData({ ...formData, otp: e.target.value })
                    }
                    className="py-6 bg-gray-50 border-gray-200 focus:border-blue-500 rounded-xl text-center"
                  />
                </div>
              )}

              {signUpPending || addUserPending ? (
                <Button
                  disabled
                  className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-300"
                >
                  <Loader2 className="animate-spin mr-2" />
                  Please wait
                </Button>
              ) : isOtpSend ? (
                <Button className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-300">
                  Verify & Sign up
                </Button>
              ) : (
                <Button
                  onClick={sendOTP}
                  className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-300"
                >
                  Send OTP
                </Button>
              )}

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign in
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
              <h2 className="text-4xl font-bold">Smart Financial Planning</h2>
              <p className="text-lg text-gray-100">
                Join thousands of users who trust DhanChakr for their financial
                management
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
