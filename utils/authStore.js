// utils/authStore.js
import { create } from "zustand";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

const useAuthStore = create((set) => ({
  currentUser: null,
  isLoading: true, // Add loading state
  setCurrentUser: async (user) => {
    set({ isLoading: true }); // Set loading state to true when fetching user data
    set({ currentUser: user });
    if (user) {
      // Fetch user data from Firestore using the UID
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          set({ currentUser: { ...user, ...userData } }); // Merge user data with user object
        } else {
          console.error("User data not found in Firestore");
        }
      } catch (error) {
        console.error("Error fetching user data from Firestore:", error);
      } finally {
        set({ isLoading: false }); // Set loading state to false after data fetching is complete
      }
    }
  },
}));

export default useAuthStore;
