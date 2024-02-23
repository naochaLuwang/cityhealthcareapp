"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";

const Navbar = () => {
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState(null);

  console.log(user);
  console.log(user?.uid);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        console.log("User Doc", userDoc);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.log("No such document!");
        }
      };
      fetchUserData();
    } else {
      setUserData(null);
    }
  }, [user]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {user && <p>Welcome, {userData ? userData.firstName : "User"}!</p>}
      {/* {!user && <SignIn />} */}
    </div>
  );
};

export default Navbar;
