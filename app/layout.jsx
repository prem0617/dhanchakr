import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/custom/Footer";
import Header from "@/components/custom/Header";
import ReactQueryWrapper from "./query-client-wrapper"; // Import the client-side wrapper

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        {/* Header */}
        <Header />

        {/* Wrap your children with QueryClientWrapper to use React Query */}
        <ReactQueryWrapper>
          <main className="min-h-screen">{children}</main>
        </ReactQueryWrapper>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
