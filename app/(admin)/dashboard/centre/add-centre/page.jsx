"use client";

import { useState } from "react";
import { db, storage } from "@/config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { Camera, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const AddCenterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    openingHours: "",
    status: "active", // Default status
    logo: null,
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      logo: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const centersCollection = collection(db, "centers");
      const docRef = await addDoc(centersCollection, formData);

      // Upload logo to Firebase Storage if a file is selected
      if (formData.logo) {
        const storageRef = ref(storage, `logos/${docRef.id}`);
        await uploadBytes(storageRef, formData.logo);
      }

      toast.success("Center added successfully");

      console.log("Center added successfully with ID:", docRef.id);
      // Reset form after submission
      setFormData({
        name: "",
        address: "",
        phone: "",
        email: "",
        openingHours: "",
        status: "active",
        logo: null,
      });

      router.push("/dashboard/centre");
    } catch (error) {
      console.error("Error adding center:", error);
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
                value={formData.name}
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
                value={formData.address}
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
                value={formData.phone}
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
                value={formData.email}
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
                value={formData.openingHours}
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
                value={formData.status}
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
        <div
          className="relative col-span-1"
          onClick={() => document.getElementById("logoInput").click()}
        >
          {formData.logo ? (
            <img
              src={URL.createObjectURL(formData.logo)}
              alt="Logo Preview"
              className="w-full rounded-lg cursor-pointer h-60"
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full bg-gray-100 rounded-lg cursor-pointer h-60">
              <Camera size={64} className="mb-2" />
              <span className="text-sm text-gray-500">Upload Logo Image</span>
            </div>
          )}
          {formData.logo && (
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
        </div>
      </div>
    </div>
  );
};

export default AddCenterForm;
