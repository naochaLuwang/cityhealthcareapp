"use client";
import { auth, storage, db, serverTimestamp } from "@/config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import React, { useState } from "react";

const DoctorSignupForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    setProfilePicUrl(URL.createObjectURL(file)); // Preview the uploaded image
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create user account
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Upload profile picture to Firebase Storage
      const storageRef = ref(storage, `profile_pics/${user.uid}`);
      await uploadBytes(storageRef, profilePic);

      const imageUrl = await getDownloadURL(storageRef);

      // Save user information to Firestore
      await setDoc(doc(db, "doctors", user.uid), {
        firstName,
        lastName,
        phoneNumber,
        email,
        status: "ACTIVE",
        role: "DOCTOR",
        createdTime: serverTimestamp(),
        updatedTime: serverTimestamp(),
        profilePicUrl: imageUrl,
      });

      // Reset form fields
      setFirstName("");
      setLastName("");
      setPhoneNumber("");
      setEmail("");
      setPassword("");
      setProfilePic(null);
      setProfilePicUrl(null);

      alert("Doctor signed up successfully!");
    } catch (error) {
      console.error("Error signing up doctor:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h2 className="mb-4 text-2xl font-bold text-center">Doctor Sign Up</h2>
        <form onSubmit={handleSubmit}>
          {/* Profile Picture Upload */}
          <div className="flex items-center justify-center mb-4">
            <label
              htmlFor="profilePic"
              className="flex items-center justify-center w-32 h-32 bg-gray-200 rounded-full cursor-pointer"
            >
              {profilePicUrl ? (
                <img
                  src={profilePicUrl}
                  alt="Profile Preview"
                  className="w-32 h-32 rounded-full"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-16 h-16 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zM9 3a1 1 0 012 0v4a1 1 0 11-2 0V3zM5 7a1 1 0 110-2h4a1 1 0 110 2H5zm11 8a1 1 0 010-2h-4a1 1 0 110-2h4a3 3 0 013 3v1a1 1 0 01-2 0v-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </label>
            <input
              type="file"
              id="profilePic"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
              required
            />
          </div>
          {/* First Name */}
          <div className="mb-4">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          {/* Last Name */}
          <div className="mb-4">
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          {/* Phone Number */}
          <div className="mb-4">
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {/* Password */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorSignupForm;
