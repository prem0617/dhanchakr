"use client";

import { Card, CardContent } from "@/components/ui/card";
import { featuresData, howItWorksData, statsData } from "@/data/landing";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

import { ParallaxProvider } from "react-scroll-parallax";
import HeroSection from "@/components/custom/Hero";

export default function Home() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
  });

  return (
    <ParallaxProvider>
      <div className="pt-40">
        {/* Hero Section */}
        <HeroSection />
        {/* Stats Section */}
        <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 gap-8">
              {statsData.map((data, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="text-center transform hover:scale-105 transition-transform duration-300"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg card-hover">
                    <div className="text-4xl font-bold gradient-title mb-3">
                      {data.value}
                    </div>
                    <div className="text-gray-600 font-medium">
                      {data.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <h2 className="section-title">
              Everything you need to manage your finances
            </h2>
            <p className="section-description">
              Powerful tools and features designed to give you complete control
              over your financial journey
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuresData.map((data, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="group card-hover border-0 h-full bg-gradient-to-br from-white to-gray-50">
                    <CardContent className="space-y-4 p-8">
                      <div className="text-blue-600 transform group-hover:scale-110 transition-transform duration-300">
                        {data.icon}
                      </div>
                      <p className="text-xl font-semibold gradient-title">
                        {data.title}
                      </p>
                      <p className="text-gray-600 leading-relaxed">
                        {data.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="container mx-auto px-4">
            <h2 className="section-title">How it works</h2>
            <p className="section-description">
              Get started with DhanChakr in six simple steps
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {howItWorksData.map((data, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  className="text-center group"
                >
                  <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-all duration-300 border border-blue-100">
                    <div className="text-blue-600">{data.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 gradient-title">
                    {data.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {data.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </ParallaxProvider>
  );
}
