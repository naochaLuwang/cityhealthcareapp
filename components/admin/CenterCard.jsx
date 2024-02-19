"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";

const DiagnosticCentersCard = () => {
  const [centersCount, setCentersCount] = useState(0);

  useEffect(() => {
    const fetchCentersCount = async () => {
      const querySnapshot = await getDocs(collection(db, "centers"));
      setCentersCount(querySnapshot.size);
    };

    fetchCentersCount();
  }, []);

  return (
    <div className="p-6 bg-white border rounded-lg shadow-md border-1 border-slate-300">
      <h3 className="mb-2 text-xl font-semibold text-gray-800">
        Diagnostic Centers
      </h3>
      <div className=" text-slate-700">
        <p className="text-4xl font-medium">{centersCount}</p>
      </div>
    </div>
  );
};

export default DiagnosticCentersCard;
