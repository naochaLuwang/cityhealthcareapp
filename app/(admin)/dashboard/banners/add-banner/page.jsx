"use client";
import { useState } from "react";
import { db, storage, serverTimestamp } from "@/config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Camera, X, Check, XCircle } from "lucide-react";

export default function BannerForm() {
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [bannerName, setBannerName] = useState("");
  const [published, setPublished] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);

      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setImage(null);
    setPreviewImage(null);
  };

  const handleContainerClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `banner/${image.name}`);
      await uploadBytes(storageRef, image);

      // Get download URL
      const imageUrl = await getDownloadURL(storageRef);

      // Save form data to Firestore
      const bannersCollection = collection(db, "banners");
      await addDoc(bannersCollection, {
        imageUrl,
        name: bannerName,
        published,
        timestamp: serverTimestamp(),
      });

      // Reset form fields
      setImage(null);
      setPreviewImage(null);
      setBannerName("");
      setPublished(false);
      setErrorMessage("");
    } catch (error) {
      console.error("Error uploading image and saving form data: ", error);
      setErrorMessage(
        "Error uploading image and saving form data. Please try again."
      );
    }
  };

  return (
    <div className="flex w-full h-full">
      <div className="w-full max-w-5xl p-6 ">
        <h1 className="mb-4 text-2xl font-bold">Add Banner</h1>
        <div className="relative mb-4" onClick={handleContainerClick}>
          {previewImage ? (
            <img
              src={previewImage}
              alt="Preview"
              className="w-full rounded-lg cursor-pointer h-96"
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full bg-gray-100 rounded-lg cursor-pointer h-96">
              <Camera size={64} className="mb-2" />
              <span className="text-sm text-gray-500">Upload Banner Image</span>
            </div>
          )}
          {previewImage && (
            <button
              onClick={handleClearImage}
              className="absolute p-2 bg-white rounded-full shadow-md top-2 right-2 hover:bg-gray-200 focus:outline-none"
            >
              <X size={20} />
            </button>
          )}
        </div>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        <div className="mb-4">
          <label htmlFor="bannerName" className="block mb-2 text-gray-700">
            Banner Name:
          </label>
          <input
            type="text"
            id="bannerName"
            value={bannerName}
            onChange={(e) => setBannerName(e.target.value)}
            className="w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="published"
            checked={published}
            onChange={() => setPublished(!published)}
            className="hidden"
          />
          <label
            htmlFor="published"
            className="relative flex items-center cursor-pointer"
          >
            <div
              className={`w-12 h-6 rounded-full mr-3 ${
                published ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <div
              className={`w-6 h-6 rounded-full bg-white shadow-md absolute left-0 transition-transform duration-300 ease-in-out transform ${
                published ? "translate-x-full" : ""
              }`}
            >
              {published ? (
                <Check size={18} className="mx-auto my-auto text-green-500" />
              ) : (
                <XCircle size={18} className="mx-auto my-auto text-gray-400" />
              )}
            </div>
            <span className="text-gray-700">Published</span>
          </label>
        </div>
        <button
          onClick={handleFormSubmit}
          disabled={!image || !bannerName}
          className={`w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600 ${
            (!image || !bannerName) && "opacity-50 cursor-not-allowed"
          }`}
        >
          Save
        </button>
        {errorMessage && <p className="mt-2 text-red-500">{errorMessage}</p>}
      </div>
    </div>
  );
}
