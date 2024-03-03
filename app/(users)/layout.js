import Footer from "@/components/user/Footer";
import Navbar from "@/components/user/Navbar";
import React from "react";

const UserLayout = ({ children }) => {
  return (
    <div className="w-full h-screen">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default UserLayout;
