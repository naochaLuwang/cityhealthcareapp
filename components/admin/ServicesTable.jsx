"use client";
// components/ServiceTable.js
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import { XCircle } from "lucide-react";

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
              Description
            </th>
            <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-50">
              Status
            </th>
            <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-50">
              Is Popular
            </th>
            <th className="px-6 py-3 bg-gray-50"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {services.map((service) => (
            <tr key={service.id}>
              <td className="px-6 py-4 whitespace-no-wrap">
                {service.serviceName}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap">
                {service.description}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap">{service.status}</td>
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
