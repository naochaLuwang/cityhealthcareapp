// components/ServiceTable.js
"use client";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import Link from "next/link";
import { FilePenLine } from "lucide-react";

const ServiceTable = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [servicesPerPage] = useState(10);

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

  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = services
    .filter((service) =>
      service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(indexOfFirstService, indexOfLastService);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <input
        type="text"
        placeholder="Search by service name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
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
          {currentServices.map((service) => (
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

      <div>
        {services.length > servicesPerPage && (
          <ul className="flex justify-center mt-4">
            {[...Array(Math.ceil(services.length / servicesPerPage))].map(
              (item, index) => (
                <li key={index}>
                  <button
                    onClick={() => paginate(index + 1)}
                    className="px-3 py-1 mr-1 font-semibold text-gray-800 rounded cursor-pointer focus:outline-none"
                  >
                    {index + 1}
                  </button>
                </li>
              )
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ServiceTable;
