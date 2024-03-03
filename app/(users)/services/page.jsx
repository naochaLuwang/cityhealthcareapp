import React from "react";
import Link from "next/link";

const Services = () => {
  return (
    <div className="flex flex-col w-full h-screen px-8">
      <div className="flex">
        <Link href="/">Home</Link>
        <span>/</span>
        <p>Services</p>
      </div>
    </div>
  );
};

export default Services;
