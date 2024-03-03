"use client";
import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const ServiceDetails = () => {
  const { id } = useParams();

  return (
    <div className="flex flex-col w-full h-screen px-8 pt-6">
      <div className="flex items-center space-x-2 ">
        <Link href="/" className="flex items-center">
          <ArrowLeft className="w-5 h-5" />
          <p>Home</p>
        </Link>
        <span>/</span>
        <p>Services</p>
      </div>
      <div className="flex-col w-full h-32 px-6 py-6 mt-10 bg-white border border-red-100 shadow-lg rounded-xl">
        <h1 className="text-lg font-semibold tracking-widest">
          ALLERGY SCREEN
        </h1>

        <p className="text-sm">Special Instruction:</p>
      </div>
    </div>
  );
};

export default ServiceDetails;
