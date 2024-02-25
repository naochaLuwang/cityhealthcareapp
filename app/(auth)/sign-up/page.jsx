// pages/signup.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { db, auth } from "@/config/firebase";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleTogglePassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSignUpWithEmailAndPassword = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Add user data to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: userCredential.user.email,
        name: userCredential.user.displayName || "",
        phone: "",
        role: "ADMIN",
        // Add any additional user data you want to store
      });
      router.push("/"); // Redirect to dashboard or any other page after successful signup
    } catch (error) {
      console.error("Error signing up with email/password:", error);
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);

      const userDocRef = doc(db, "users", userCredential.user.uid);
      const docSnapshot = await getDoc(userDocRef);

      // Check if the user document already exists
      if (!docSnapshot.exists()) {
        // Add user data to Firestore only if the user document doesn't exist
        await setDoc(userDocRef, {
          email: userCredential.user.email,
          name: userCredential.user.displayName || "",
          phone: "",
          role: "USER",
          // Add any additional user data you want to store
        });
      }

      router.push("/"); // Redirect to dashboard or any other page after successful sign-in
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div className="flex w-full min-h-screen">
      <div className="w-[50%] bg-red-200"></div>
      <div className="w-[50%] min-h-screen flex flex-col justify-center px-10 items-center">
        <div className="flex flex-col w-96">
          <h1 className="text-2xl font-semibold">Sign Up</h1>
          <p>to continue to City Health Care</p>
        </div>

        <div
          className="flex items-center justify-center py-2 mt-5 space-x-5 bg-white border rounded-lg shadow-sm cursor-pointer w-96"
          onClick={handleSignInWithGoogle}
        >
          <Image src="/google.png" alt="google" width={25} height={25} />
          <p>Continue with Google</p>
        </div>

        <div className="flex items-center mt-5 space-x-5 w-96">
          <span className="w-full h-[1px] bg-slate-300 rounded-sm"></span>
          <p>or</p>
          <span className="w-full h-[1px] bg-slate-300 rounded-sm"></span>
        </div>

        <div className="flex flex-col mt-5 space-y-2 w-96">
          <label htmlFor="email">Email</label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col mt-5 space-y-2 w-96">
          <label htmlFor="password">Password</label>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className="block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-700 focus:outline-none"
              onClick={handleTogglePassword}
            >
              {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
          </div>
        </div>
        <button
          onClick={handleSignUpWithEmailAndPassword}
          className="relative flex justify-center px-4 py-2 mt-5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md w-96 group hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Sign up
        </button>

        <div className="flex items-center mt-5 space-x-2 text-sm w-96">
          <p>Have an account ? </p>
          <Link href="/sign-in" className="text-blue-600">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
