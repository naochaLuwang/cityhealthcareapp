"use client";
import { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  getDoc,
  getDocs,
  doc,
} from "firebase/firestore";

import { db } from "@/config/firebase";
import {
  ArrowLeftCircle,
  ArrowRightCircle,
  User,
  ShoppingBag,
} from "lucide-react";
import { X } from "lucide-react";

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
  const [collectionFeeChecked, setCollectionFeeChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);

  // Handler for collection fee checkbox
  const handleCollectionFeeChange = () => {
    setCollectionFeeChecked(!collectionFeeChecked);
  };

  // Handler for terms and conditions checkbox
  const handleTermsChange = () => {
    setTermsChecked(!termsChecked);
  };

  const handleBookHomeCollection = async () => {
    try {
      // Prepare order data
      const orderData = {
        basicInfo: basicInfo,
        services: addedServices.map((service) => ({
          serviceName: service.serviceName,
          price: service.price,
          id: service.serviceId,
          centerId: service.centerId,
          centerName: service.centerName,
          // Add any other related info here
        })),
        totalBillAmount: totalPrice,
        status: "booked", // Initial status
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Add the order data to Firestore under the "orders" collection
      const orderRef = await addDoc(collection(db, "orders"), orderData);
      console.log("Order added with ID: ", orderRef.id);

      // Add initial status update as a subcollection
      const statusUpdateData = {
        status: "booked",
        updatedBy: "user", // Update with the user's ID or name
        updatedAt: serverTimestamp(),
      };

      // Add the initial status update to the subcollection "statuses"
      await addDoc(collection(orderRef, "statuses"), statusUpdateData);

      // Reset the form and state after successful booking
      setBasicInfo({
        salutation: "",
        name: "",
        year: "",
        month: "",
        day: "",
        gender: "",
        city: "",
        address: "",
      });
      setAddedServices([]);
      setTotalPrice(0);
      setCollectionFeeChecked(false);
      setTermsChecked(false);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error adding order: ", error);
    }
  };

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
      // Set the serviceName state with the selected service's name
      setServiceName(service.serviceName);
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
      // Check if the service is already added
      const serviceExists = addedServices.some(
        (addedService) =>
          addedService.serviceId === selectedService &&
          addedService.centerId === selectedCenter
      );
      if (serviceExists) {
        // Service already added, prompt user to confirm
        const confirmAddService = window.confirm(
          "This service has already been added. Do you want to add it again?"
        );
        if (confirmAddService) {
          const addedService = {
            serviceId: selectedService,
            centerId: selectedCenter,
            serviceName: service.serviceName,
            centerName:
              centers.find((center) => center.id === selectedCenter)?.name ||
              "Center not found",
            price: price,
          };
          setAddedServices([...addedServices, addedService]);
          setTotalPrice((prevPrice) => prevPrice + parseFloat(price));
        }
      } else {
        // Service not added yet, add it directly
        const addedService = {
          serviceId: selectedService,
          centerId: selectedCenter,
          serviceName: service.serviceName,
          centerName:
            centers.find((center) => center.id === selectedCenter)?.name ||
            "Center not found",
          price: price,
        };
        setAddedServices([...addedServices, addedService]);
        setTotalPrice((prevPrice) => prevPrice + parseFloat(price));
      }
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

            <div className="flex items-center justify-between">
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
              <div className="w-full mb-4 pl-9">
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
        <div className="flex flex-col w-full p-4 mx-auto">
          <div className="w-[50%]">
            <div className="flex-1 mr-4">
              {/* Center dropdown */}
              <div className="w-full mb-4">
                <label htmlFor="center" className="block mb-2">
                  Center
                </label>
                <select
                  id="center"
                  value={selectedCenter}
                  onChange={(e) => handleCenterSelect(e.target.value)}
                  disabled={selectedCenter !== ""}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select Center</option>
                  {centers.map((center) => (
                    <option key={center.id} value={center.id}>
                      {center.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Input field with matching services dropdown */}
              <div className="relative w-full mb-4">
                <label htmlFor="service" className="block mb-2">
                  Service
                </label>
                <input
                  type="text"
                  id="service"
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

              {/* Display price and Add Service button */}
              {selectedService && selectedCenter && (
                <div className="flex items-center w-full mb-4">
                  <div className="flex-1">
                    <label className="block mb-2">
                      Price: {price !== "" ? price : "Price not found"}
                    </label>
                  </div>
                  <div>
                    <button
                      onClick={handleAddService}
                      className="px-4 py-2 text-white bg-blue-500 rounded"
                    >
                      Add Service
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="w-[50%]">
            {addedServices.length > 0 && (
              <div className="flex-1 w-full">
                {/* Checkout summary */}
                <div className="p-4 border border-gray-200 rounded-lg shadow-md">
                  <h2 className="mb-4 text-lg font-semibold">Services</h2>
                  {/* Service items */}
                  <div className="h-auto overflow-y-auto max-h-56">
                    {addedServices.map((service, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 border-b border-gray-200"
                      >
                        <div>
                          <h3 className="text-sm font-medium">
                            {service.serviceName}
                          </h3>
                          <p className="text-xs text-gray-600">
                            {service.centerName}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium">
                            ₹{service.price}
                          </p>
                          <button
                            onClick={() =>
                              handleRemoveService(index, service.price)
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Total Price */}
                  <div className="flex justify-end mt-4 space-x-3">
                    <h3 className="text-sm font-medium">Total Price:</h3>
                    <p className="text-sm font-semibold">₹{totalPrice}</p>
                  </div>
                </div>
              </div>
            )}
            {/* Continue to next form button */}
            <button
              onClick={() => setCurrentPage(3)}
              className="px-4 py-2 text-white bg-blue-500 rounded"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {currentPage === 3 && (
        <div className="flex flex-col w-full p-4 mx-auto">
          {/* Display basic information */}
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold">Basic Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <p>
                  <strong>Salutation:</strong> {basicInfo.salutation}
                </p>
                <p>
                  <strong>Name:</strong> {basicInfo.firstName}{" "}
                  {basicInfo.lastName}
                </p>
                <p>
                  <strong>Age:</strong> {basicInfo.year} Years,{" "}
                  {basicInfo.month} Months, {basicInfo.day} Days
                </p>
              </div>
              <div className="flex flex-col">
                <p>
                  <strong>Gender:</strong> {basicInfo.gender}
                </p>
                <p>
                  <strong>City:</strong> {basicInfo.city}
                </p>
                <p>
                  <strong>Address:</strong> {basicInfo.address}
                </p>
              </div>
            </div>
          </div>

          {/* Display added services */}
          <div className="h-auto mb-8 overflow-y-auto max-h-72">
            <h2 className="mb-4 text-lg font-semibold">Added Services</h2>
            {addedServices.map((service, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-gray-200"
              >
                <div>
                  <h3 className="text-sm font-medium">{service.serviceName}</h3>
                  <p className="text-xs text-gray-600">{service.centerName}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">₹{service.price}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Collection fee and terms checkboxes */}
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="text-blue-500 form-checkbox"
                checked={collectionFeeChecked}
                onChange={handleCollectionFeeChange}
              />
              <span className="ml-2">
                A collection fee of rupees 100 may be levied
              </span>
            </label>
          </div>
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="text-blue-500 form-checkbox"
                checked={termsChecked}
                onChange={handleTermsChange}
              />
              <span className="ml-2">
                I understand the terms and conditions
              </span>
            </label>
          </div>

          {/* Book home collection button */}
          <button
            onClick={handleBookHomeCollection}
            disabled={!collectionFeeChecked || !termsChecked}
            className={`px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 ${
              collectionFeeChecked && termsChecked
                ? ""
                : "opacity-50 cursor-not-allowed"
            }`}
          >
            Book Home Collection
          </button>
        </div>
      )}
    </div>
  );
};

export default AddService;
