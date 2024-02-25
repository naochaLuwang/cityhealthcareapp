"use client";
import React, { useEffect, useState } from "react";
import TestCard from "@/components/user/Testcard";
import { db } from "@/config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import LandingPage from "@/components/user/Banner";
import Cons from "@/components/user/Cons";

const Home = () => {
  const [popularServices, setPopularServices] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state

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
      setLoading(false); // Set loading to false when services are fetched
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
        {loading ? ( // Conditional rendering based on loading state
          <div className="grid grid-cols-4 gap-4">
            {/* Skeleton loading items */}
            {[...Array(8)].map((_, index) => (
              <div
                className="flex flex-col h-auto p-6 mt-10 space-y-2 border rounded-lg shadow-md w-80 animate-pulse"
                key={index}
              >
                <div className="w-3/4 h-6 bg-gray-300 rounded"></div>
                <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
                <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
                <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
                <div className="flex items-center space-x-2 w-fit">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
                </div>
                <div className="flex items-center justify-between w-full">
                  <div className="h-8 bg-blue-900 rounded-md shadow-sm w-36"></div>
                  <div className="w-20 h-4 bg-blue-900 rounded-md"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {/* Actual content */}
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
        )}
      </div>

      <Cons />
    </div>
  );
};

export default Home;
