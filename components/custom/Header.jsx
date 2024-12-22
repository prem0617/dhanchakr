import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { LayoutDashboard, PenBox } from "lucide-react";

async function Header() {
  return (
    <div className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <nav className="container mx-auto p-4 flex items-center justify-between">
        <Link
          href={"/"}
          className="text-gray-600 hover:text-blue-600 flex items-center gap-2"
        >
          {/* <Image width={100} height={20}/> */}
          <p className="font-semibold text-3xl">Dhan Chakr</p>
        </Link>

        <div className="flex items-center space-x-4">
          <Link href={"/dashboard"}>
            <Button variant="outline">
              <LayoutDashboard size={18} />
              <span className="hidden md:inline">Dashboard</span>
            </Button>
          </Link>

          <Link href={"/transaction/create"}>
            <Button>
              <PenBox size={18} />
              <span className="hidden md:inline">Add Transaction</span>
            </Button>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Header;
