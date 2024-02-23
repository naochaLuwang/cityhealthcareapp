"use client";
import DiagnosticCentersCard from "@/components/admin/CenterCard";

const Dashboard = () => {
  return (
    <div className="w-full px-4 py-10 ">
      <h1 className="text-4xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-4 gap-6 mt-10">
        <DiagnosticCentersCard />
      </div>
    </div>
  );
};

export default Dashboard;
