"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebase";

export const withAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        if (!loading) {
          if (!user) {
            router.replace("/sign-in");
          } else {
            try {
              const userDocRef = doc(db, "users", user.uid);
              const docSnapshot = await getDoc(userDocRef);
              if (docSnapshot.exists()) {
                const userData = docSnapshot.data();
                setUserData(userData);
              }
            } catch (error) {
              console.error("Error fetching user data:", error);
            }
          }
        }
      };

      fetchData();
    }, [user, loading, router]);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!user) {
      return null; // or a loading indicator, or a message indicating redirection
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};
