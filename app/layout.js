import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/custom/Footer";
import Header from "@/components/custom/Header";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dhan Chakr",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className}`}>
          {/* Header */}
          <Header />
          <main className="min-h-screen">{children}</main>
          {/* Footer */}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
