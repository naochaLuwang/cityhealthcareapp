"use client";
import AddService from "@/components/user/AddService";
import { withAuth } from "@/utils/authUser";
import React from "react";

const BookHomeCollection = () => {
  return (
    <div className="w-full h-auto py-10 lg:max-w-7xl lg:mx-auto">
      <h1 className="text-2xl font-medium tracking-wide">
        Book Home Collection
      </h1>
      <AddService />
    </div>
  );
};

export default withAuth(BookHomeCollection);
