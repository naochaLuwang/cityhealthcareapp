import React from "react";
import Loading from "react-loading";

const FullPageLoader = () => (
  <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-blue-500">
    <div className="flex flex-col items-center text-white">
      <div className="animate-bounce">
        <Loading type="spin" color="white" height={50} width={50} />
      </div>
      <h1 className="mt-4 font-bold text-xl">CITY HEALTH CARE</h1>
      <p className="mt-2">Loading...</p>
    </div>
  </div>
);

export default FullPageLoader;
