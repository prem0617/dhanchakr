"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

import Image from "next/image";

import { motion } from "framer-motion";
import { Parallax } from "react-scroll-parallax";

const HeroSection = () => {
  const imageRef = useRef();

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="pb-40 px-4"
    >
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-8xl lg:text-[105px] pb-6 gradient-title leading-tight">
          Manage Your Finances <br /> with Intelligence
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-xl text-gray-600 mb-8 mx-auto max-w-2xl"
        >
          An AI-Powered financial management platform that helps you track,
          analyze, and optimize your spending with real-time insights.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-8"
        >
          <Link href={"/dashboard"}>
            <Button
              variant="secondary"
              size="lg"
              className="px-8 py-6 text-lg font-semibold hover:scale-105 transition-transform duration-300"
            >
              Get Started
            </Button>
          </Link>
        </motion.div>
        <Parallax y={[-20, 20]}>
          <div className="hero-image-wrapper">
            <div ref={imageRef} className="hero-image">
              <Image
                src={"/banner.jpeg"}
                alt="Banner"
                width={1280}
                height={720}
                className="rounded-lg border mx-auto shadow-2xl"
                priority
              />
            </div>
          </div>
        </Parallax>
      </div>
    </motion.div>
  );
};

export default HeroSection;
