"use client";
import { useEffect, useState } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Image from "next/image";

const LandingPage = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true); // State variable for loading

  useEffect(() => {
    const fetchBanners = async () => {
      const bannersQuery = query(
        collection(db, "banners"),
        where("published", "==", true)
      );
      const bannersSnapshot = await getDocs(bannersQuery);
      const bannersData = bannersSnapshot.docs.map((doc) => doc.data());
      setBanners(bannersData);
      setLoading(false); // Set loading to false when data is fetched
    };

    fetchBanners();
  }, []);

  return (
    <div className="w-full h-96">
      {loading ? ( // Show loading skeleton if loading is true
        <div className="w-full h-[26rem] bg-gray-200 animate-pulse"></div>
      ) : (
        <Carousel>
          {banners.map((banner, index) => (
            <div key={index} className="relative w-full h-[26rem]">
              <Image src={banner.imageUrl} alt={banner.title} fill />
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default LandingPage;
