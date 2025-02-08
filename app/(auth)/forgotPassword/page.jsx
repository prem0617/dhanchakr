"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, Key, Lock } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    try {
      const response = await axios.post("../../api/auth/send-otp", {
        email: formData.email,
      });
      if (response.data.success) {
        toast.success("OTP sent to your email");
        setStep(2);
      } else {
        toast.error(response.data.error || "Failed to send OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setIsPending(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    try {
      const response = await axios.post("../../api/auth/verify-otpForgotPass", {
        email: formData.email,
        otp: formData.otp,
      });
      if (response.data.success) {
        toast.success("OTP verified successfully");
        setStep(3);
      } else {
        toast.error(response.data.error || "Invalid OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setIsPending(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    try {
      const response = await axios.post("../../api/auth/reset-password", {
        email: formData.email,
        newPassword: formData.newPassword,
      });
      if (response.data.success) {
        toast.success("Password reset successfully");
        router.push("/login");
      } else {
        toast.error(response.data.error || "Failed to reset password");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <Card className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Reset Password
          </CardTitle>
          <p className="text-gray-500 text-center text-sm">
            Follow the steps to reset your password
          </p>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
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
              <Button
                disabled={isPending}
                className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl"
              >
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Sending OTP...
                  </>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="relative">
                <Key className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Enter OTP"
                  value={formData.otp}
                  onChange={(e) =>
                    setFormData({ ...formData, otp: e.target.value })
                  }
                  className="pl-10 py-6 bg-gray-50 border-gray-200 focus:border-blue-500 rounded-xl"
                />
              </div>
              <Button
                disabled={isPending}
                className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl"
              >
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Verifying OTP...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </Button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                  className="pl-10 py-6 bg-gray-50 border-gray-200 focus:border-blue-500 rounded-xl"
                />
              </div>
              <Button
                disabled={isPending}
                className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl"
              >
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ForgotPassword;
