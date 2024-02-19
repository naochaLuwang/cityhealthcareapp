"use client";
import { useParams } from "next/navigation";

import { useState, useEffect } from "react";
import { db } from "@/config/firebase";

import { getDoc, doc, updateDoc } from "firebase/firestore";
import { Camera, X, Check, XCircle } from "lucide-react";

const EditCenterForm = () => {
  const params = useParams();
  const id = params.centerid;
  // Get center ID from URL parameters
  const [center, setCenter] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    openingHours: "",
    status: "",
    logo: "", // Add logo field to the center state
  });

  useEffect(() => {
    const fetchCenter = async () => {
      if (!id) return;
      try {
        const centerDoc = await getDoc(doc(db, "centers", id));
        console.log(centerDoc);
        if (centerDoc.exists()) {
          const centerData = centerDoc.data();
          setCenter({
            name: centerData.name || "",
            address: centerData.address || "",
            phone: centerData.phone || "",
            email: centerData.email || "",
            openingHours: centerData.openingHours || "",
            status: centerData.status || "",
            logo: centerData.logo || "", // Make sure to properly set the logo field
          });
        } else {
          console.error("Center not found");
        }
      } catch (error) {
        console.error("Error fetching center:", error);
      }
    };

    fetchCenter();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCenter((prevCenter) => ({
      ...prevCenter,
      [name]: value,
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setCenter((prevCenter) => ({
      ...prevCenter,
      logo: file, // Set the logo field to the selected file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "centers", id), center);
      console.log("Center updated successfully");
    } catch (error) {
      console.error("Error updating center:", error);
    }
  };

  return (
    <div className="flex w-full h-screen p-8">
      <div className="grid w-full max-w-5xl grid-cols-2 gap-6 px-6 pt-2 ">
        {/* Form Inputs */}
        <div className="col-span-1">
          <h2 className="text-4xl font-bold ">Center Information</h2>
          <p className="mb-4">Add centre information</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block mb-2 font-semibold text-gray-700"
              >
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={center.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="address"
                className="block mb-2 font-semibold text-gray-700"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={center.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block mb-2 font-semibold text-gray-700"
              >
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={center.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block mb-2 font-semibold text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={center.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="openingHours"
                className="block mb-2 font-semibold text-gray-700"
              >
                Opening Hours
              </label>
              <input
                type="text"
                id="openingHours"
                name="openingHours"
                value={center.openingHours}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="status"
                className="block mb-2 font-semibold text-gray-700"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={center.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-white transition duration-300 bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Add Center
            </button>
          </form>
        </div>

        {/* Logo Uploader */}
        {/* <div
          className="relative col-span-1"
          onClick={() => document.getElementById("logoInput").click()}
        >
          {center.logo ? (
            <img
              src={URL.createObjectURL(center.logo)}
              alt="Logo Preview"
              className="w-full rounded-lg cursor-pointer h-60"
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full bg-gray-100 rounded-lg cursor-pointer h-60">
              <Camera size={64} className="mb-2" />
              <span className="text-sm text-gray-500">Upload Logo Image</span>
            </div>
          )}
          {center.logo && (
            <button
              onClick={() =>
                setFormData((prevData) => ({ ...prevData, logo: null }))
              }
              className="absolute p-2 bg-white rounded-full shadow-md top-2 right-2 hover:bg-gray-200 focus:outline-none"
            >
              <X size={20} />
            </button>
          )}
          <input
            id="logoInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoChange}
          />
        </div> */}
      </div>
    </div>
  );
};

export default EditCenterForm;
