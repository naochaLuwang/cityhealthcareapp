"use client";

import { useEffect, useState } from "react";
import { db } from "@/config/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { FilePenLine } from "lucide-react";

const CenterPage = () => {
  const [centers, setCenters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [centersPerPage] = useState(10);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const centersCollection = collection(db, "centers");
        const querySnapshot = await getDocs(centersCollection);
        const fetchedCenters = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCenters(fetchedCenters);
      } catch (error) {
        console.error("Error fetching centers:", error);
      }
    };

    fetchCenters();
  }, []);

  const filteredCenters = searchTerm
    ? centers.filter((center) =>
        center.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : centers;

  // Pagination
  const indexOfLastCenter = currentPage * centersPerPage;
  const indexOfFirstCenter = indexOfLastCenter - centersPerPage;
  const currentCenters = filteredCenters.slice(
    indexOfFirstCenter,
    indexOfLastCenter
  );

  const totalPages = Math.ceil(filteredCenters.length / centersPerPage);

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div className="container max-w-6xl py-8 mx-auto">
      <h1 className="mb-4 text-3xl font-medium">Centers</h1>
      <div className="flex items-center justify-between w-full h-auto mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
        <Link
          href="/dashboard/centre/add-centre"
          className="px-4 py-2 text-sm text-white bg-blue-800 rounded-md shadow-md w-fit h-fit"
        >
          ADD NEW CENTRE
        </Link>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
              Name
            </th>
            <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
              Address
            </th>
            <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
              Phone
            </th>
            <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
              Email
            </th>
            <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
              Opening Hours
            </th>
            <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentCenters.map((center) => (
            <tr key={center.id}>
              <td className="px-6 py-4 text-xs whitespace-nowrap">
                {center.name}
              </td>
              <td className="px-6 py-4 text-xs whitespace-nowrap">
                {center.address}
              </td>
              <td className="px-6 py-4 text-xs whitespace-nowrap">
                {center.phone}
              </td>
              <td className="px-6 py-4 text-xs whitespace-nowrap">
                {center.email}
              </td>
              <td className="px-6 py-4 text-xs whitespace-nowrap">
                {center.openingHours}
              </td>
              <td className="px-6 py-4 text-xs whitespace-nowrap">
                <div className="flex items-center">
                  <div
                    className={`w-fit h-fit py-1 px-3  rounded-full mr-2 ${
                      center.status === "active"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    <span className="text-xs text-white">
                      {center.status === "active" ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link
                  href={`/dashboard/centre/edit-center/${center.id}`}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <FilePenLine />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="6" className="px-6 py-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-700">
                  Showing {indexOfFirstCenter + 1} to{" "}
                  {Math.min(indexOfLastCenter, filteredCenters.length)} of{" "}
                  {filteredCenters.length} centers
                </span>
                <div>
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 mr-2 text-xs font-medium text-gray-700 ${
                      currentPage === 1
                        ? "bg-gray-200 cursor-not-allowed"
                        : "bg-gray-100 hover:bg-gray-300"
                    } rounded-md`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 ml-2 text-xs font-medium text-gray-700 ${
                      currentPage === totalPages
                        ? "bg-gray-200 cursor-not-allowed"
                        : "bg-gray-100 hover:bg-gray-300"
                    } rounded-md`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default CenterPage;
