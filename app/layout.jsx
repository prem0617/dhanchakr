"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/custom/Footer";
import ReactQueryWrapper from "./query-client-wrapper"; // Import the client-side wrapper
import { Toaster } from "react-hot-toast";
import Header from "@/components/custom/Header";
import FetchAllData from "@/components/custom/FetchAllData";
import { usePathname } from "next/navigation"; // Import the hook

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Dhan Chakr",
//   description: "",
// };

export default function RootLayout({ children }) {
  const pathname = usePathname(); // Get the current route

  // Define routes where the Header should not be displayed
  const hideHeaderRoutes = ["/login", "/signup", "/forgotPassword"];
  const showHeader = !hideHeaderRoutes.includes(pathname); // Check if the current route is not in the list

  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <ReactQueryWrapper>
          {/* Conditionally render the Header */}
          {showHeader && <Header />}
          <FetchAllData />

          <main className="min-h-screen">{children}</main>
        </ReactQueryWrapper>
        {showHeader && <Footer />}
        <Toaster />
      </body>
    </html>
  );
}
