"use client";
import Navbar from "@/components/admin/Navbar";
import Sidebar from "@/components/admin/Sidebar";
import { withAuth } from "@/utils/doctorRequireAuth";

const DoctorDashboardLayout = ({ children }) => {
  return (
    <div className="flex w-full h-screen overflow-hidden">
      <Sidebar />
      <div className="w-full">
        <Navbar />
        <div className="w-full h-full px-6 bg-slate-100">{children}</div>
      </div>
    </div>
  );
};

export default withAuth(DoctorDashboardLayout);
