"use client";
import { useEffect, useState } from "react";
import { getDocs, collection, setDoc, doc, addDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const AddServiceForm = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("active");
  const [isPopular, setIsPopular] = useState(false);
  const [prices, setPrices] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchDepartments = async () => {
      const departmentsSnapshot = await getDocs(collection(db, "departments"));
      const departmentsData = departmentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDepartments(departmentsData);
    };

    const fetchCenters = async () => {
      const centersSnapshot = await getDocs(collection(db, "centers"));
      const centersData = centersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCenters(centersData);
    };

    fetchDepartments();
    fetchCenters();
  }, []);

  const handleAddPrice = () => {
    if (selectedCenter && price) {
      const center = centers.find((center) => center.id === selectedCenter);
      const department = departments.find(
        (department) => department.id === selectedDepartment
      );
      if (center && department) {
        const newPrice = {
          centerId: selectedCenter,
          centerName: center.name,
          departmentId: selectedDepartment,
          departmentName: department.departmentname,
          price: parseInt(price),
        };
        setPrices([...prices, newPrice]);
        setSelectedCenter("");
        setPrice("");
      }
    }
  };

  const handleRemovePrice = (index) => {
    const updatedPrices = [...prices];
    updatedPrices.splice(index, 1);
    setPrices(updatedPrices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        !serviceName ||
        !description ||
        !status ||
        !prices ||
        !isPopular ||
        !selectedDepartment
      ) {
        throw new Error("Missing required fields");
      }

      const servicesCollection = collection(db, "services");
      const docRef = await addDoc(servicesCollection, {
        serviceName,
        description,
        department: selectedDepartment,
        status,
        isPopular,
        prices,
      });

      // Upload image to Firebase Storage if a file is selected

      toast.success("Service added successfully");

      console.log("Service added successfully with ID:", docRef.id);
      // Reset form after submission
      setFormData({
        serviceName: "",
        description: "",
        status: "active",
        isPopular: false,
        prices: [],
      });

      router.push("/dashboard/services");
    } catch (error) {
      console.error("Error adding service:", error);
    }
  };

  return (
    <div className="w-full max-w-6xl py-8 mx-auto">
      <h1 className="mb-4 text-2xl font-medium">Service Information</h1>
      <div className="flex w-full h-auto">
        <div className="w-[50%]">
          <form onSubmit={handleSubmit}>
            <label htmlFor="serviceName">Service Name:</label>
            <input
              type="text"
              id="serviceName"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="block p-2 mt-2 border rounded-lg w-96 border-slate-500 focus:outline-none"
              required
            />

            <label htmlFor="department">Department:</label>
            <select
              id="department"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="block p-2 mt-2 border rounded-lg w-96 border-slate-500"
              required
            >
              <option value="">Select Department</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.departmentname}
                </option>
              ))}
            </select>

            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full p-2 mt-2 border rounded-lg border-slate-500 focus:outline-none"
              rows={3}
            />

            <br />
            <label htmlFor="center">Center:</label>
            <select
              id="center"
              value={selectedCenter}
              onChange={(e) => setSelectedCenter(e.target.value)}
              className="block p-2 mt-2 border rounded-lg w-96 border-slate-500 focus:outline-none"
            >
              <option value="">Select Center</option>
              {centers.map((center) => (
                <option key={center.id} value={center.id}>
                  {center.name}
                </option>
              ))}
            </select>
            {selectedCenter && (
              <div className="flex mt-2">
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="block p-2 border rounded-lg border-slate-500 focus:outline-none"
                  placeholder="Price"
                  required
                />
                <button
                  type="button"
                  onClick={handleAddPrice}
                  className="px-4 py-2 ml-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                >
                  Add Price
                </button>
              </div>
            )}

            <label htmlFor="status">Status:</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="block p-2 mt-2 border rounded-lg w-96 border-slate-500 focus:outline-none"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <label className="flex items-center mt-2">
              Is Popular ?
              <input
                type="checkbox"
                checked={isPopular}
                onChange={(e) => setIsPopular(e.target.checked)}
                className="ml-2 "
              />
            </label>
            <button
              type="submit"
              className="px-4 py-2 mt-4 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring focus:border-green-300"
            >
              Add Service
            </button>
          </form>
        </div>
        {/* right side */}
        <div className="w-[50%]">
          {prices.length > 0 && (
            <table className="w-full mt-4 border border-gray-300">
              <thead>
                <tr>
                  <th className="p-2 border-b border-gray-300">Center</th>
                  <th className="p-2 border-b border-gray-300">Department</th>
                  <th className="p-2 border-b border-gray-300">Price</th>
                  <th className="p-2 border-b border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {prices.map((price, index) => (
                  <tr key={index}>
                    <td className="p-2 border-b border-gray-300">
                      {price.centerName}
                    </td>
                    <td className="p-2 border-b border-gray-300">
                      {price.departmentName}
                    </td>
                    <td className="p-2 border-b border-gray-300">
                      {price.price}
                    </td>
                    <td className="p-2 border-b border-gray-300">
                      <button
                        type="button"
                        onClick={() => handleRemovePrice(index)}
                        className="text-red-500 hover:text-red-700 focus:outline-none"
                      >
                        <XCircle size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddServiceForm;
