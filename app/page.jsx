"use client";

import HeroSection from "@/components/custom/Hero";
import { Card, CardContent } from "@/components/ui/card";
import {
  featuresData,
  howItWorksData,
  statsData,
  testimonialsData,
} from "@/data/landing";
import axios from "axios";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function Home() {
  const { data, isRefetching } = useQuery({
    queryKey: ["authUser"],
    queryFn: async function () {
      try {
        const response = await axios.get("./api/auth/getMe", {
          withCredentials: true,
        });
        if (response.data.error) {
          throw new Error(response.data.error);
        }
        return response.data;
      } catch (error) {
        // console.error(error.message || "Error in Get Me");
        throw error;
      }
    },
    refetchOnWindowFocus: false,
  });

  // Set `authUser` in localStorage only when data is updated
  useEffect(() => {
    if (data) {
      console.log("Auth user data updated:", data);
      localStorage.setItem("authUser", JSON.stringify(data));
    }
  }, [data]);

  return (
    <div className="pt-40">
      <HeroSection />

      {/* Stats */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((data, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {data.value}
                </div>
                <div className="text-gray-600">{data.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need to manage your finances
          </h2>
          <div className="grid gco1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((data, index) => (
              <Card key={index} className="p-6">
                <CardContent className="space-y-4 pt-4 ">
                  {data.icon}
                  <p className="text-xl font-semibold">{data.title}</p>
                  <p className="text-gray-600">{data.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">
            How it work's{" "}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorksData.map((data, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  {data.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{data.title}</h3>
                <p className="text-gray-600">{data.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Our Users Say */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid gco1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonialsData.map((data, index) => (
              <Card key={index} className="p-6">
                <CardContent className="pt-4 ">
                  <div className="flex items-center mb-4 gap-4 ">
                    <Image
                      src={data.image}
                      alt={data.name}
                      width={40}
                      height={40}
                    />
                    <div>
                      <div className="font-semibold">{data.name}</div>
                      <div className="text-sm text-gray-600">{data.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-600">{data.quote}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
