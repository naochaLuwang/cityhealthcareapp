"use client";

import { useState } from "react";
import { db, storage } from "@/config/firebase";
import { collection, addDoc } from "firebase/firestore";

import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const AddCenterForm = () => {
  const [formData, setFormData] = useState({
    departmentname: "",
    departmentcode: "",

    status: "active", // Default status
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
      const centersCollection = collection(db, "departments");
      const docRef = await addDoc(centersCollection, formData);

      //   // Upload logo to Firebase Storage if a file is selected
      //   if (formData.logo) {
      //     const storageRef = ref(storage, `logos/${docRef.id}`);
      //     await uploadBytes(storageRef, formData.logo);
      //   }

      toast.success("Department added successfully");

      console.log("Department added successfully with ID:", docRef.id);
      // Reset form after submission
      setFormData({
        departmentname: "",
        departmentcode: "",

        status: "active",
      });

      router.push("/dashboard/departments");
    } catch (error) {
      console.error("Error adding department:", error);
    }
  };

  return (
    <div className="flex w-full h-screen p-8">
      <div className="grid w-full max-w-5xl grid-cols-2 gap-6 px-6 pt-2 ">
        {/* Form Inputs */}
        <div className="col-span-1">
          <h2 className="text-4xl font-bold ">Department Information</h2>
          <p className="mb-4">Add department information</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="departmentname"
                className="block mb-2 font-semibold text-gray-700"
              >
                Department Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="departmentname"
                name="departmentname"
                value={formData.departmentname}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="departmentcode"
                className="block mb-2 font-semibold text-gray-700"
              >
                Department Code
              </label>
              <input
                type="text"
                id="departmentcode"
                name="departmentcode"
                value={formData.departmentcode}
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
              Add Department
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCenterForm;
