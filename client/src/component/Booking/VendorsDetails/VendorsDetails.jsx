import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Availability from "../check/availability";
import ReviewSection from "../../Review/Review";
import { FaPhone, FaCheck, FaStar, FaImages, FaInfoCircle, FaListUl, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const VendorDetails = () => {
  const { category, id } = useParams();
  const [vendorData, setVendorData] = useState(null);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/vendors/${category}/${id}`
        );
        setVendorData(response.data);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    };

    fetchVendorData();
  }, [id]);

  if (!vendorData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-pink-700 to-pink-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <h1 className="text-4xl font-bold mb-3">{vendorData.name}</h1>
              <div className="flex items-center mb-5">
                <div className="flex text-yellow-400 mr-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="w-5 h-5" />
                  ))}
                </div>
                <span className="text-pink-100">(24 reviews)</span>
              </div>
              <p className="text-lg mb-6 text-pink-100">{vendorData.location}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-white text-pink-700 px-3 py-1 rounded-full text-sm font-medium">
                  {vendorData.type}
                </span>
                {vendorData.tags?.map((tag, index) => (
                  <span key={index} className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
              <button className="bg-white text-pink-700 hover:bg-gray-100 font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 flex items-center">
                Contact Vendor <IoIosArrowForward className="ml-2" />
              </button>
            </div>

            <div className="lg:w-1/2">
              <Carousel
                showArrows
                infiniteLoop
                showThumbs={false}
                showStatus={false}
                autoPlay
                interval={5000}
                className="rounded-xl overflow-hidden shadow-2xl"
              >
                {vendorData.photos.map((photo, index) => (
                  <div key={index} className="h-64 md:h-96">
                    <img src={photo} alt={`Vendor ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="lg:w-2/3">
            {/* Pricing Card */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Package Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-pink-700 mb-3">
                    {vendorData.pricing.package}
                  </h3>
                  <p className="text-gray-600 mb-4">Comprehensive service package includes:</p>
                  <ul className="space-y-3 mb-4">
                    {vendorData.services.slice(0, 4).map((service, index) => (
                      <li key={index} className="flex items-start">
                        <FaCheck className="text-pink-600 mt-1 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-pink-50 p-6 rounded-lg border border-pink-100">
                  <div className="text-3xl font-bold text-pink-700 mb-3">
                    {vendorData.pricing.price}
                  </div>
                  <p className="text-gray-600 mb-5">Starting price</p>
                  <button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-md hover:shadow-lg">
                    Check Availability
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-gray-100">
              <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200">
                {["about", "services", "photos", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 font-medium text-sm flex items-center ${
                      activeTab === tab 
                        ? "text-pink-700 border-b-2 border-pink-700 font-semibold" 
                        : "text-gray-600 hover:text-pink-600"
                    }`}
                  >
                    {tab === "about" && <FaInfoCircle className="mr-2" />}
                    {tab === "services" && <FaListUl className="mr-2" />}
                    {tab === "photos" && <FaImages className="mr-2" />}
                    {tab === "reviews" && <FaStar className="mr-2" />}
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="p-8">
                {activeTab === "about" && (
                  <>
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">About {vendorData.name}</h3>
                    <p className="text-gray-600 leading-relaxed">{vendorData.description}</p>
                  </>
                )}
                {activeTab === "services" && (
                  <>
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">Our Services</h3>
                    <ul className="space-y-4">
                      {vendorData.services.map((service, index) => (
                        <li key={index} className="flex items-start">
                          <div className="bg-pink-100 p-1.5 rounded-full mr-4 mt-0.5">
                            <FaCheck className="text-pink-600 w-3 h-3" />
                          </div>
                          <span className="text-gray-700">{service}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {activeTab === "photos" && (
                  <>
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">Gallery</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                      {vendorData.photos.map((photo, index) => (
                        <div key={index} className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                          <img 
                            src={photo} 
                            alt={`Vendor ${index + 1}`} 
                            className="w-full h-48 object-cover hover:scale-105 transition duration-300 transform-gpu"
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {activeTab === "reviews" && (
                  <ReviewSection entityId={vendorData._id} type="vendor" />
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:w-1/3">
            <Availability />

            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
              <h2 className="text-xl font-bold mb-5 text-gray-800">Contact Information</h2>
              <div className="space-y-5">
                <div className="flex items-start">
                  <div className="bg-pink-100 p-3 rounded-full mr-4">
                    <FaPhone className="text-pink-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Phone</h4>
                    <p className="text-gray-600">{vendorData.contact.phone}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-pink-100 p-3 rounded-full mr-4">
                    <FaEnvelope className="text-pink-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Email</h4>
                    <p className="text-gray-600">{vendorData.contact.email || "info@example.com"}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-pink-100 p-3 rounded-full mr-4">
                    <FaMapMarkerAlt className="text-pink-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Location</h4>
                    <p className="text-gray-600">{vendorData.location}</p>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center shadow-md hover:shadow-lg">
                <FaPhone className="mr-2" /> Contact Now
              </button>
            </div>

            {/* Quick Action */}
            <div className="bg-gradient-to-r from-pink-600 to-pink-500 rounded-xl shadow-md p-6 text-white">
              <h2 className="text-xl font-bold mb-3">Ready to Book?</h2>
              <p className="mb-5 text-pink-100">Limited availability for your selected date. Secure your spot now!</p>
              <button className="w-full bg-white text-pink-700 hover:bg-gray-50 font-bold py-3 px-4 rounded-lg transition duration-300 shadow-md hover:shadow-lg">
                Check Availability
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;