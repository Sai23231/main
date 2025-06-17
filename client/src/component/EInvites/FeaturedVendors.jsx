import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const FeaturedVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/vendors/invite`
        );        
        if (Array.isArray(response.data)) {
          setVendors(response.data);
        } else if (response.data.data && Array.isArray(response.data.data)) {
          setVendors(response.data.data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching vendors:", error);
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/vendors/invite/${id}`);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Featured Card Vendors</h2>
        </div>
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            <p className="text-gray-600">Loading featured vendors...</p>
          </div>
        </div>
      </div>
    );
  }

  return (    
  <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Featured Card Vendors</h2>
        <button
          onClick={() => navigate('/vendors/invite')}
          className="text-pink-600 hover:text-pink-700 font-medium flex items-center gap-2"
        >
          View All
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>     
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={4}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          320: { 
            slidesPerView: 1,
            
          },
          640: { 
            slidesPerView: 2,
            
          },
          768: { 
            slidesPerView: 3,
            
          },
          1024: { 
            slidesPerView: 3,
            
          },
        }}
        className="rounded-lg"
      >
        {vendors.map((vendor, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col">
              {/* Image Section */}
              <div className="relative h-56">
                <img
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  src={vendor.CoverImage}
                  alt={vendor.name}
                />
                {/* Rating Badge */}
                <span className="absolute top-4 right-4 bg-green-600 text-white px-2 py-1 text-sm font-semibold rounded-full shadow-sm">
                  {vendor.rating} ★
                </span>
              </div>

              {/* Details Section */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 hover:text-pink-500 transition">
                {vendor.name}
              </h2>
              <p className="text-gray-600 mt-2">
                Starting Price:{" "}
                <span className="text-pink-600 font-bold">
                  &#x20b9; {vendor.pricing.price}
                </span>
              </p>
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <span>{vendor.rating} ★</span>
                <span className="mx-2">•</span>
                <span>{vendor.reviews} Reviews</span>
              </div>
              <p className="text-sm text-gray-600 italic mt-4">
                {vendor.description}
              </p>
            </div>

              {/* CTA Section */}
              <div className="p-4 bg-gray-50 border-t text-center">
                <button
                  className="w-full py-2 text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg hover:opacity-90 transition"
                  onClick={() => handleViewDetails(vendor._id)}
                >
                  View Details
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FeaturedVendors;
