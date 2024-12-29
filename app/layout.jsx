import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/custom/Footer";
import ReactQueryWrapper from "./query-client-wrapper"; // Import the client-side wrapper
import { Toaster } from "react-hot-toast";
import Header from "@/components/custom/Header";
import FetchAllData from "@/components/custom/FetchAllData";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dhan Chakr",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        {/* Header */}

        {/* Wrap your children with QueryClientWrapper to use React Query */}
        <ReactQueryWrapper>
          <Header />
          <FetchAllData />

          <main className="min-h-screen">{children}</main>
        </ReactQueryWrapper>

        {/* Footer */}
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
