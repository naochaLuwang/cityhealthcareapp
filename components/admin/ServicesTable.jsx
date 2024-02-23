"use client";
// components/ServiceTable.js
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";

import Link from "next/link";
import { FilePenLine } from "lucide-react";

const ServiceTable = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      const servicesCollection = collection(db, "services");
      const snapshot = await getDocs(servicesCollection);
      const servicesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setServices(servicesData);
    };

    fetchServices();
  }, []);

  const openModal = (service) => {
    setSelectedService(service);
  };

  const closeModal = () => {
    setSelectedService(null);
  };

  return (
    <div>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-50">
              Service Name
            </th>
            <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-50">
              TAT
            </th>
            <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-50">
              Status
            </th>
            <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-50">
              Is Popular
            </th>
            <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-50">
              Prices
            </th>
            <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-50">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="text-xs bg-white divide-y divide-gray-200">
          {services.map((service) => (
            <tr key={service.id}>
              <td className="px-6 py-4 font-medium whitespace-no-wrap">
                {service.serviceName}
              </td>
              <td className="px-6 py-4 font-medium whitespace-no-wrap">
                {service.turnaroundtime}
              </td>

              <td className="px-6 py-4 w-fit">
                {service.status === "active" && (
                  <div className="flex items-center px-4 py-2 bg-green-500 rounded-full w-fit">
                    <div className="w-3 h-3 mr-2 bg-white rounded-full"></div>
                    <div className="font-bold text-white uppercase">
                      {service.status}
                    </div>
                  </div>
                )}
                {service.status !== "active" && (
                  <div className="px-2 py-1 text-black uppercase bg-yellow-500 rounded-full">
                    {service.status}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap">
                {service.isPopular ? "Yes" : "No"}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap">
                <button
                  onClick={() => openModal(service)}
                  className="text-blue-500 hover:text-blue-700 focus:outline-none"
                >
                  View Prices
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link
                  href={`/dashboard/services/edit-service/${service.id}`}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <FilePenLine />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="z-50 p-8 bg-white rounded-lg">
            <h2 className="mb-4 text-lg font-bold">
              {selectedService.serviceName} Prices
            </h2>
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                    Center
                  </th>
                  <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedService.prices.map((price, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-no-wrap">
                      {price.centerName}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap">
                      {price.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={closeModal}
              className="mt-4 text-blue-500 hover:text-blue-700 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceTable;
