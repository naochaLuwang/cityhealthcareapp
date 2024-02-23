"use client";
import { useState, useEffect } from "react";
import { getDocs, collection, doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import {
  ArrowLeftCircle,
  ArrowRightCircle,
  User,
  ShoppingBag,
} from "lucide-react";

const AddService = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const [basicInfo, setBasicInfo] = useState({
    salutation: "",
    name: "",
    year: "",
    month: "",
    day: "",
    gender: "",
    city: "",
    address: "",
  });
  const [centers, setCenters] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [matchingServices, setMatchingServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [price, setPrice] = useState("");
  const [addedServices, setAddedServices] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };
  useEffect(() => {
    const fetchCenters = async () => {
      const centersSnapshot = await getDocs(collection(db, "centers"));
      const centersData = centersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCenters(centersData);
    };

    const fetchServices = async () => {
      const servicesSnapshot = await getDocs(collection(db, "services"));
      const servicesData = servicesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setServices(servicesData);
    };

    fetchCenters();
    fetchServices();
  }, []);

  const handleServiceInputChange = (e) => {
    const input = e.target.value.toLowerCase();
    const matching = services.filter((service) =>
      service.serviceName.toLowerCase().includes(input)
    );
    setMatchingServices(matching);
    setServiceName(e.target.value);
    setDropdownOpen(true);
  };

  const handleServiceSelect = async (serviceId) => {
    setSelectedService(serviceId);
    if (selectedCenter) {
      const service = services.find((service) => service.id === serviceId);
      const priceSnapshot = await getDoc(doc(db, "services", serviceId));
      const priceData = priceSnapshot.data();
      const price =
        priceData.prices.find((p) => p.centerId === selectedCenter)?.price ||
        "Price not found";
      setPrice(price);
    }
    setDropdownOpen(false);
  };

  const handleCenterSelect = async (centerId) => {
    setSelectedCenter(centerId);
    if (selectedService) {
      const priceSnapshot = await getDoc(doc(db, "services", selectedService));
      const priceData = priceSnapshot.data();
      const price =
        priceData.prices.find((p) => p.centerId === centerId)?.price ||
        "Price not found";
      setPrice(price);
    }
  };

  const handleAddService = () => {
    if (price !== "Price not found") {
      const service = services.find(
        (service) => service.id === selectedService
      );
      const addedService = {
        serviceName: service.serviceName,
        centerName:
          centers.find((center) => center.id === selectedCenter)?.name ||
          "Center not found",
        price: price,
      };
      setAddedServices([...addedServices, addedService]);
      setTotalPrice((prevPrice) => prevPrice + parseFloat(price));
      setServiceName("");
      setPrice("");
      setMatchingServices([]);
      setSelectedService("");
    }
  };

  const handleSubmitBasicInfo = (e) => {
    e.preventDefault();
    nextPage();
  };

  const handleRemoveService = (index, price) => {
    const updatedServices = addedServices.filter((_, i) => i !== index);
    setAddedServices(updatedServices);

    // Calculate the new total price
    setTotalPrice((prevTotal) => prevTotal - parseFloat(price));
  };

  return (
    <div>
      {/* Breadcrumb navigation */}
      <div className="flex items-center mt-5 mb-4 space-x-2">
        {/* Basic information */}
        <div
          className={`flex items-center space-x-2 cursor-pointer transition duration-300 ${
            currentPage === 1 ? "font-bold text-lg" : "text-gray-400"
          }`}
          onClick={prevPage}
        >
          <User
            size={24}
            className={`${
              currentPage === 1 ? "text-blue-500" : "text-gray-300"
            } transform hover:scale-110`}
          />
          <span>Basic Information</span>
        </div>
        {/* Add service */}
        <div
          className={`flex items-center space-x-2 cursor-pointer transition duration-300 ${
            currentPage === 2 ? "font-bold" : "text-gray-400"
          }`}
        >
          <ShoppingBag
            size={24}
            className={`${
              currentPage === 2 ? "text-blue-500" : "text-gray-300"
            } transform hover:scale-110`}
          />
          <span>Add Service</span>
          <ArrowRightCircle
            size={24}
            className={`${
              currentPage === 2 ? "text-blue-500" : "text-gray-300"
            } transform hover:scale-110`}
          />
        </div>
      </div>

      {/* Form content */}
      {currentPage === 1 && (
        <form onSubmit={handleSubmitBasicInfo} className="max-w-3xl p-4 ">
          <div className="flex flex-col">
            <div className="flex items-center justify-between space-x-2">
              {/* Salutation dropdown */}
              <div className="w-24 mb-4">
                <label htmlFor="salutation" className="block mb-2">
                  Salutation
                </label>
                <select
                  id="salutation"
                  value={basicInfo.salutation}
                  onChange={(e) =>
                    setBasicInfo({ ...basicInfo, salutation: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Miss">Miss</option>
                </select>
              </div>

              {/* First name */}
              <div className="mb-4 w-80">
                <label htmlFor="firstName" className="block mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={basicInfo.firstName}
                  onChange={(e) =>
                    setBasicInfo({ ...basicInfo, firstName: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter your first name"
                />
              </div>

              {/* Last name */}
              <div className="mb-4 w-80">
                <label htmlFor="lastName" className="block mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={basicInfo.lastName}
                  onChange={(e) =>
                    setBasicInfo({ ...basicInfo, lastName: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="flex items-center justify-between space-x-7">
              {/* Age */}
              <div className="mb-4">
                <label htmlFor="age" className="block mb-2">
                  Age
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    id="year"
                    value={basicInfo.year}
                    onChange={(e) =>
                      setBasicInfo({ ...basicInfo, year: e.target.value })
                    }
                    className="w-20 p-2 border border-gray-300 rounded"
                    placeholder="Year"
                  />
                  <span className="text-gray-400">Year</span>
                  <input
                    type="text"
                    id="month"
                    value={basicInfo.month}
                    onChange={(e) =>
                      setBasicInfo({ ...basicInfo, month: e.target.value })
                    }
                    className="w-20 p-2 border border-gray-300 rounded"
                    placeholder="Month"
                  />
                  <span className="text-gray-400">Month</span>
                  <input
                    type="text"
                    id="day"
                    value={basicInfo.day}
                    onChange={(e) =>
                      setBasicInfo({ ...basicInfo, day: e.target.value })
                    }
                    className="w-20 p-2 border border-gray-300 rounded"
                    placeholder="Day"
                  />
                  <span className="text-gray-400">Day</span>
                </div>
              </div>

              {/* Gender dropdown */}
              <div className="w-full mb-4">
                <label htmlFor="gender" className="block mb-2">
                  Gender
                </label>
                <select
                  id="gender"
                  value={basicInfo.gender}
                  onChange={(e) =>
                    setBasicInfo({ ...basicInfo, gender: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Phone number */}
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={basicInfo.phoneNumber}
                onChange={(e) =>
                  setBasicInfo({ ...basicInfo, phoneNumber: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your phone number"
              />
            </div>

            {/* City */}
            <div className="mb-4">
              <label htmlFor="city" className="block mb-2">
                City
              </label>
              <input
                type="text"
                id="city"
                value={basicInfo.city}
                onChange={(e) =>
                  setBasicInfo({ ...basicInfo, city: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your city"
              />
            </div>

            {/* Address */}
            <div className="mb-4">
              <label htmlFor="address" className="block mb-2">
                Address
              </label>
              <textarea
                id="address"
                value={basicInfo.address}
                onChange={(e) =>
                  setBasicInfo({ ...basicInfo, address: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your address"
              ></textarea>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Next
          </button>
        </form>
      )}

      {currentPage == 2 && (
        <div className="max-w-lg p-4 mx-auto">
          {/* Center dropdown */}
          <select
            value={selectedCenter}
            onChange={(e) => handleCenterSelect(e.target.value)}
            disabled={selectedCenter !== ""}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          >
            <option value="">Select Center</option>
            {centers.map((center) => (
              <option key={center.id} value={center.id}>
                {center.name}
              </option>
            ))}
          </select>

          {/* Input field with matching services dropdown */}
          <div className="relative mb-4">
            <input
              type="text"
              value={serviceName}
              onChange={handleServiceInputChange}
              onFocus={() => setDropdownOpen(true)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Search for a service..."
            />
            {dropdownOpen && matchingServices.length > 0 && (
              <div className="absolute left-0 z-10 w-full bg-white border border-gray-300 rounded top-full">
                {matchingServices.map((service) => (
                  <div
                    key={service.id}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleServiceSelect(service.id)}
                  >
                    {service.serviceName}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Display price */}
          <div className="mb-4">
            {price !== "" ? `Price: ${price}` : "Price not found"}
          </div>

          {/* Add button */}
          {selectedService && selectedCenter && (
            <button
              onClick={handleAddService}
              className="px-4 py-2 mb-4 text-white bg-blue-500 rounded"
            >
              Add Service
            </button>
          )}

          {/* Display added services in a table */}
          <table className="w-full mb-4">
            <thead>
              <tr>
                <th className="p-2 border border-gray-300">Service Name</th>
                <th className="p-2 border border-gray-300">Center Name</th>
                <th className="p-2 border border-gray-300">Price</th>
              </tr>
            </thead>
            <tbody>
              {addedServices.map((service, index) => (
                <tr key={index}>
                  <td className="p-2 border border-gray-300">
                    {service.serviceName}
                  </td>
                  <td className="p-2 border border-gray-300">
                    {service.centerName}
                  </td>
                  <td className="p-2 border border-gray-300">
                    {service.price}
                  </td>
                  <td className="p-2 border border-gray-300">
                    <button
                      onClick={() => handleRemoveService(index, service.price)}
                      className="px-2 py-1 text-white bg-red-500 rounded"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Display total price */}
          <div className="font-bold">Total Price: {totalPrice}</div>
        </div>
      )}
    </div>
  );
};

export default AddService;
