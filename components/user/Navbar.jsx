"use client";
import Link from "next/link";
import { Command } from "lucide-react";

import { auth } from "@/config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    // Unsubscribe from the auth state listener during cleanup
    return () => unsubscribe();
  }, []);
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/sign-in"); // Redirect to the sign-in page after sign-out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  console.log(currentUser);
  return (
    <div className="sticky top-0 z-50 bg-white shadow-md">
      <div className="flex items-center justify-between w-full h-auto px-10 pt-4 pb-4">
        <div>
          <Link href="/">
            <div className="flex items-center space-x-2">
              <Command className="w-10 h-10 font-bold text-blue-800" />
              <h1 className="text-xl font-semibold tracking-widest">
                CITY HEALTH CARE
              </h1>
            </div>
          </Link>
        </div>
        <div className="flex items-center space-x-5">
          {/* <SignedIn>
            <Link href="/" className="text-base font-medium">
              About Us
            </Link>
            <Link href="/" className="text-base font-medium">
              Contact Us
            </Link>
            <Link
              href="/book-home-collection"
              className="text-base font-medium"
            >
              Book Home Collection
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Link href="/" className="text-base font-medium">
              About Us
            </Link>
            <Link href="/" className="text-base font-medium">
              Contact Us
            </Link>
            <Link href="/sign-in" className="text-xs font-medium">
              SIGN IN
            </Link>
          </SignedOut> */}

          {/* {currentUser ? (
            <button className="text-white">Sign Out</button>
          ) : (
            <Link href="/login">
              <p className="mr-4 text-white">Login</p>
            </Link>
          )} */}

          <div>
            {currentUser ? (
              <div className="flex">
                <div className="text-sm ">
                  Welcome, {currentUser.displayName || currentUser.email}
                </div>
                <button onClick={handleSignOut}>Sign Out</button>
              </div>
            ) : (
              <div>Not signed in</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
