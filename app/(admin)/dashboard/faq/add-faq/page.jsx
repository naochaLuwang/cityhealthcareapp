"use client";
import { useState, useEffect } from "react";
import { collection, getDoc, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

const AddFAQPage = () => {
  const [services, setServices] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");

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

  const addFAQ = () => {
    if (newQuestion && newAnswer) {
      setFaqs([...faqs, { question: newQuestion, answer: newAnswer }]);
      setNewQuestion("");
      setNewAnswer("");
    }
  };

  const removeFAQ = (index) => {
    const updatedFaqs = faqs.filter((_, i) => i !== index);
    setFaqs(updatedFaqs);
  };

  const previewFAQ = () => {
    return (
      <div className="mt-4">
        {faqs.map((faq, index) => (
          <div key={index} className="p-4 mb-2 border">
            <p className="font-bold">Question:</p>
            <p>{faq.question}</p>
            <p className="font-bold">Answer:</p>
            <p>{faq.answer}</p>
            <button
              onClick={() => removeFAQ(index)}
              className="px-3 py-1 mt-2 text-white bg-red-500 rounded"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    );
  };

  const handleSubmit = async () => {
    if (selectedServiceId && faqs.length > 0) {
      try {
        const serviceRef = doc(db, "services", selectedServiceId);
        const serviceDoc = await getDoc(serviceRef);

        if (serviceDoc.exists()) {
          const serviceData = serviceDoc.data();
          const serviceName = serviceData.serviceName;

          const faqsRef = doc(db, "serviceFAQs", selectedServiceId);
          const faqsDoc = await getDoc(faqsRef);

          if (faqsDoc.exists()) {
            const existingFaqs = faqsDoc.data().faqs || [];
            const newFaqs = [...existingFaqs, ...faqs];
            await updateDoc(faqsRef, { faqs: newFaqs });
          } else {
            await setDoc(faqsRef, {
              serviceId: selectedServiceId,
              serviceName,
              faqs,
            });
          }

          setFaqs([]);
          setSelectedServiceId("");
          alert("FAQs added successfully!");
        } else {
          alert("Selected service not found.");
        }
      } catch (error) {
        console.error("Error adding FAQs: ", error);
        alert("An error occurred while adding FAQs. Please try again.");
      }
    } else {
      alert("Please select a service and add at least one FAQ.");
    }
  };

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Add FAQs</h1>
      <div className="mb-4">
        <label htmlFor="service" className="block font-bold">
          Select a service:
        </label>
        <select
          id="service"
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded"
          onChange={(e) => setSelectedServiceId(e.target.value)}
        >
          <option value="">Select a service</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.serviceName}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="question" className="block font-bold">
          Question:
        </label>
        <input
          id="question"
          type="text"
          placeholder="Enter question"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="answer" className="block font-bold">
          Answer:
        </label>
        <input
          id="answer"
          type="text"
          placeholder="Enter answer"
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded"
        />
      </div>
      <button
        onClick={addFAQ}
        className="px-4 py-2 mr-2 text-white bg-blue-500 rounded"
      >
        Add FAQ
      </button>
      <button
        onClick={handleSubmit}
        className="px-4 py-2 text-white bg-green-500 rounded"
      >
        Save FAQs
      </button>
      {previewFAQ()}
    </div>
  );
};

export default AddFAQPage;
