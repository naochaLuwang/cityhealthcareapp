"use client";

import { useEffect, useState } from "react";
import { db } from "@/config/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { format } from "date-fns";

const BannerPage = () => {
  const [banners, setBanners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const bannersCollection = collection(db, "banners");
        const querySnapshot = await getDocs(bannersCollection);
        const bannersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBanners(bannersData);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, []);

  const handlePublishToggle = async (bannerId, published) => {
    try {
      const bannerRef = doc(db, "banners", bannerId);
      await updateDoc(bannerRef, {
        published: !published,
      });
      setBanners((prevBanners) => {
        return prevBanners.map((banner) => {
          if (banner.id === bannerId) {
            return { ...banner, published: !published };
          }
          return banner;
        });
      });
    } catch (error) {
      console.error("Error updating published status:", error);
    }
  };

  // Pagination Logic
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = banners.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl">
      <h1 className="mb-4 text-3xl font-semibold">Banners</h1>
      <div className="overflow-x-auto">
        <table className="w-full border border-collapse border-gray-200 table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-gray-800 bg-gray-200 border border-gray-200">
                Image
              </th>
              <th className="px-4 py-2 text-gray-800 bg-gray-200 border border-gray-200">
                Name
              </th>
              <th className="px-4 py-2 text-gray-800 bg-gray-200 border border-gray-200">
                Published
              </th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((banner) => (
              <tr key={banner.id}>
                <td className="px-4 py-2 border border-gray-200">
                  <img
                    src={banner.imageUrl}
                    alt="Banner"
                    className="w-auto h-16"
                  />
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  {banner.name}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-5 rounded-full mr-2 ${
                        banner.published ? "bg-green-500" : "bg-yellow-500"
                      }`}
                      onClick={() =>
                        handlePublishToggle(banner.id, banner.published)
                      }
                    >
                      <div
                        className={`w-5 h-5 rounded-full ${
                          banner.published ? "bg-white" : "bg-black"
                        }`}
                      />
                    </div>
                    <span className="font-semibold text-gray-800">
                      {banner.published ? "Published" : "Unpublished"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  {format(
                    new Date(banner.timestamp?.toDate()),
                    "yyyy-MM-dd HH:mm:ss"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          {/* Table Footer */}
          <tfoot>
            <tr>
              <td colSpan="4" className="px-4 py-2 border border-gray-200">
                <div className="flex items-center justify-between">
                  <span>{`Showing ${indexOfFirstItem + 1} to ${Math.min(
                    indexOfLastItem,
                    banners.length
                  )} of ${banners.length} banners`}</span>
                  <div className="flex">
                    <button
                      onClick={() =>
                        setCurrentPage((prevPage) =>
                          prevPage > 1 ? prevPage - 1 : prevPage
                        )
                      }
                      className="px-4 py-2 mr-2 text-gray-800 bg-gray-200 rounded-md"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((prevPage) =>
                          prevPage < Math.ceil(banners.length / itemsPerPage)
                            ? prevPage + 1
                            : prevPage
                        )
                      }
                      className="px-4 py-2 text-gray-800 bg-gray-200 rounded-md"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default BannerPage;
