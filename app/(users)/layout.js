import Navbar from "@/components/user/Navbar";
import React from "react";

const UserLayout = ({ children }) => {
  return (
    <div className="w-full h-screen">
      <Navbar />
      {children}
    </div>
  );
};

export default UserLayout;
