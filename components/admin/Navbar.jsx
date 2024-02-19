import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Toaster } from "react-hot-toast";

const Navbar = () => {
  return (
    <>
      <Toaster />
      <div className="flex items-center  h-12 px-8 w-[100%] bg-slate-900">
        <Link href="/" className="text-sm text-white">
          Home
        </Link>

        <ChevronRight className="text-sm text-white" />
        <Link href="/dashboard" className="text-sm text-white">
          Dashboard
        </Link>

        <ChevronRight className="text-sm text-white" />
      </div>
    </>
  );
};

export default Navbar;
