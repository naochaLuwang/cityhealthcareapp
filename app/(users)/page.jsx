import Navbar from "@/components/user/Navbar";
import React from "react";
import Image from "next/image";
import TestCard from "@/components/user/Testcard";

const Home = () => {
  return (
    <div className="w-full h-auto">
      <Navbar />
      <div className="flex w-full h-12">
        <div className="w-[50%]"></div>
        <div className="w-[50%] bg-blue-800 text-white flex items-center px-10 rounded-l-full">
          <h1>8132043928</h1>
        </div>
      </div>
      <div className="relative w-full h-[36rem]">
        <Image src="/bannern.jpeg" fill />
      </div>
      <div className="px-10 mt-10 ">
        <h1 className="text-4xl font-medium tracking-wider">Popular Tests</h1>
        <TestCard
          testName="COVID-19 Test"
          description="This test is used to detect the presence of the SARS-CoV-2 virus."
          turnaroundTime="24-48 hours"
          imageUrl={"/bannern.jpeg"}
        />
      </div>
    </div>
  );
};

export default Home;
