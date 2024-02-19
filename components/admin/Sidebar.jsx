import Link from "next/link";
import { Command } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="bg-slate-700 w-[18%] p-6">
      <div>
        <Link href="/">
          <div className="flex items-center space-x-2">
            <Command className="w-10 h-10 font-bold text-slate-50" />
            <h1 className="text-sm font-semibold tracking-widest text-slate-50">
              CITY HEALTH CARE
            </h1>
          </div>
        </Link>
      </div>

      <div className="flex flex-col mt-10 space-y-5 text-slate-50">
        <div>
          <Link href="/dashboard/centre">CENTRES</Link>
        </div>
        <div>
          <Link href="/dashboard/banners">BANNERS</Link>
        </div>
        <div>
          <Link href="/dashboard/departments">DEPARTMENTS</Link>
        </div>
        <div>
          <Link href="/dashboard/services">SERVICES</Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
