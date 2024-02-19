import React from "react";
import { BiShow } from "react-icons/bi";
import Image from "next/image";

const TestCard = ({ testName, description, turnaroundTime, imageUrl }) => {
  return (
    <div className="h-auto p-6 mt-10 border w-96">
      <h1>{testName}</h1>
      <div className="relative h-32 w-80">
        <Image src={imageUrl} fill />
      </div>
    </div>
  );
};

export default TestCard;
