"use client";
import React, { useEffect, useState } from "react";
import TestCard from "@/components/user/Testcard";
import { db } from "@/config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import LandingPage from "@/components/user/Banner";
import Cons from "@/components/user/Cons";

const Home = () => {
  const [popularServices, setPopularServices] = useState([]);

  useEffect(() => {
    const fetchPopularServices = async () => {
      const q = query(
        collection(db, "services"),
        where("isPopular", "==", true)
      );
      const querySnapshot = await getDocs(q);
      const services = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPopularServices(services);
    };

    fetchPopularServices();
  }, []);

  return (
    <div className="w-full h-auto">
      <div className="fixed z-30 flex w-full h-12 top-18">
        <div className="w-[50%]"></div>
        <div className="w-[50%] bg-blue-800 text-white flex items-center px-10 rounded-l-full">
          <h1>8132043928</h1>
        </div>
      </div>
      <LandingPage />
      <div className="px-10 py-10 mt-5">
        <h1 className="text-2xl font-medium tracking-wide">
          Popular Tests / Packages
        </h1>
        <div className="grid grid-cols-4 gap-4">
          {popularServices.map((service) => (
            <TestCard
              key={service.id}
              testName={service.serviceName}
              description={service.description}
              turnaroundTime={service.department}
              imageUrl={service.imageUrl}
            />
          ))}
        </div>
      </div>

      <Cons />
    </div>
  );
};

export default Home;
