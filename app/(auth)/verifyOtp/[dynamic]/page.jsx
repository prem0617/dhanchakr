"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const OTPForm = () => {
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const { dynamic: token } = useParams();
  console.log(token);

  const { mutate: verifyOtp, isLoading } = useMutation({
    mutationFn: async function (otp) {
      try {
        const response = await axios.post("../../../api/auth/verifyOtp", {
          otp,
          token,
        });

        console.log(response);

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

  const handleSubmit = () => {
    verifyOtp(otp);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex border-2 border-gray-300  bg-gray-100 shadow-md rounded-lg">
        <form
          action=""
          onSubmit={handleSubmit}
          className="flex flex-col gap-8 justify-center  p-5 border-r-2 w-[300px]"
        >
          {" "}
          <h1 className="font-medium text-2xl text-center text-blue-600">
            Verify OTP
          </h1>
          <div className="space-y-2">
            <label htmlFor="otp">OTP : </label>
            <Input
              value={otp}
              onChange={handleOtpChange}
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              className="py-2"
              type="text"
              id="otp"
              required
            />
          </div>
          {isLoading ? (
            <Button
              disabled
              className="bg-blue-600 hover:bg-white hover:text-blue-600 hover:border-2"
            >
              <Loader2 className="animate-spin " />
              Please wait
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-white hover:text-blue-600 hover:border-2"
            >
              Submit
            </Button>
          )}
        </form>
        <div className="w-[300px] h-[400px]">
          <img
            src="https://lntedutech.com/wp-content/uploads/2024/04/Personal-Finance-Management-scaled-1.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default OTPForm;
