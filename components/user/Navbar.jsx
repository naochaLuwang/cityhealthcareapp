"use client";
import Link from "next/link";
import { Command, LogOut } from "lucide-react";
import { auth } from "@/config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [initials, setInitials] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      if (user) {
        // Extracting initials from the display name
        const name = user.displayName;
        if (name) {
          const nameInitials = name
            .split(" ")
            .map((part) => part.charAt(0))
            .join("");
          setInitials(nameInitials.toUpperCase());
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="sticky top-0 z-50 bg-white shadow-md">
      <div className="flex items-center justify-between w-full h-auto pt-4 pb-4 pl-10 pr-0">
        <div className="flex items-center space-x-2 cursor-pointer">
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
          <div className="flex items-center space-x-5">
            <Link href="/" className="text-base font-medium">
              About Us
            </Link>
            <Link href="/" className="text-base font-medium">
              Contact Us
            </Link>
            {currentUser && (
              <div className="flex items-center px-4 space-x-5">
                <Link
                  href="/book-home-collection"
                  className="text-base font-medium"
                >
                  Book Home Collection
                </Link>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center focus:outline-none"
                >
                  {initials ? (
                    <div className="flex items-center justify-center w-10 h-10 font-semibold text-white bg-blue-800 rounded-full">
                      {initials}
                    </div>
                  ) : (
                    <span className="text-base font-medium">Profile</span>
                  )}
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 z-10 mt-1 bg-white rounded-md shadow-lg w-60 top-full">
                    <div className="px-4 py-2">
                      <p className="text-sm">{currentUser.displayName}</p>
                    </div>
                    <Link href="/profile">
                      <p className="block px-4 py-2 text-sm text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100">
                        My Profile
                      </p>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 space-x-2 text-sm font-medium text-left text-red-600 transition duration-150 ease-in-out hover:bg-gray-100"
                    >
                      <LogOut width={15} height={15} />
                      <p>Sign Out</p>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
