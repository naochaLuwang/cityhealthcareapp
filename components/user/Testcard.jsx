import React from "react";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

const TestCard = ({ testName, description, turnaroundTime, imageUrl }) => {
  return (
    <div className="flex flex-col h-auto p-6 mt-10 space-y-2 border rounded-lg shadow-md w-80">
      <h1 className="text-base font-semibold tracking-wider text-slate-900">
        {testName}
      </h1>
      <p className="text-xs">No special preparation required</p>
      <p className="text-xs">Daily</p>
      <p className="text-xs">20 parameters covered</p>
      <div className="flex items-center space-x-2 w-fit">
        <CheckCircle className="w-3 h-3 font-bold text-green-500" />
        <p className="text-xs font-semibold text-green-600">Home Collection</p>
      </div>
      <div className="flex items-center justify-between w-full">
        <Link
          href="/book-home-collection"
          className="px-4 py-3 text-xs font-medium text-white bg-blue-900 rounded-md shadow-sm w-fit"
        >
          Book home collection
        </Link>
        <Link href="/" className="text-sm font-semibold text-blue-900">
          Know more
        </Link>
      </div>
    </div>
  );
};

export default TestCard;
