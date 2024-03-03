// pages/services.js
import ServicesTable from "@/components/admin/ServicesTable";
import Link from "next/link";

const ServicesPage = () => {
  return (
    <div className="container max-w-6xl py-8 mx-auto ">
      <h1 className="mb-4 text-3xl font-medium">Services</h1>
      <div className="flex items-center justify-end w-full h-auto mb-4">
        <Link
          href="/dashboard/services/add-services"
          className="px-4 py-2 text-sm text-white bg-blue-800 rounded-md shadow-md w-fit h-fit"
        >
          ADD NEW SERVICE
        </Link>
      </div>

      <ServicesTable />
    </div>
  );
};

export default ServicesPage;
