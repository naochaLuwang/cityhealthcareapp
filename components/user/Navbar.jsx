import Link from "next/link";
import { Command } from "lucide-react";

const Navbar = () => {
  return (
    <div className="sticky top-0 z-50 bg-white shadow-md">
      <div className="flex items-center justify-between w-full h-auto px-10 pt-5 pb-2">
        <div>
          <Link href="/">
            <div className="flex items-center space-x-2">
              <Command className="w-10 h-10 font-bold text-blue-800" />
              <h1 className="text-xl font-semibold tracking-widest">
                CITY HEALTH CARE
              </h1>
            </div>
          </Link>
        </div>
        <div className="px-6 py-2 border-2 border-blue-800 rounded-lg w-fit h-fit">
          <Link href="/signin" className="text-lg font-light ">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
