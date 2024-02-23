"use client";
import UpdateServiceForm from "@/components/admin/EditServiceForm";
import React from "react";
import { useParams } from "next/navigation";

const AddServicesPage = () => {
  const params = useParams();
  const id = params.serviceId;
  return (
    <div>
      <UpdateServiceForm serviceId={id} />
    </div>
  );
};

export default AddServicesPage;
