import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Availability from "../check/availability";
import ReviewSection from "../../Review/Review";
import { FaPhone, FaCheck, FaStar, FaImages, FaInfoCircle, FaListUl } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const VendorDetails = () => {
  const { category, id } = useParams();
  const [vendorData, setVendorData] = useState(null);
  const [activeTab, setActiveTab] = useState("about");

  // Fetch vendor data from the backend
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 ">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-pink-600 to-pink-500 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <h1 className="text-4xl font-bold mb-2">{vendorData.name}</h1>
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="w-5 h-5" />
                  ))}
                </div>
                <span className="text-white">(24 reviews)</span>
              </div>
              <p className="text-lg mb-6">{vendorData.location}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-white text-pink-600 px-3 py-1 rounded-full text-sm font-medium">
                  {vendorData.type}
                </span>
                {vendorData.tags?.map((tag, index) => (
                  <span key={index} className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
              <button className="bg-white text-pink-600 hover:bg-gray-100 font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 flex items-center">
                Contact Vendor <IoIosArrowForward className="ml-2" />
              </button>
            </div>
            
            <div className="lg:w-1/2">
              <Carousel
                showArrows={true}
                infiniteLoop={true}
                showThumbs={false}
                showStatus={false}
                autoPlay={true}
                interval={5000}
                className="rounded-xl overflow-hidden shadow-2xl"
              >
                {vendorData.photos.map((photo, index) => (
                  <div key={index} className="h-64 md:h-96">
                    <img
                      src={photo}
                      alt={`Vendor ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="lg:w-2/3">
            {/* Pricing Card */}
            <div className="bg-white  rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Package Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-pink-600 dark:text-pink-400">
                    {vendorData.pricing.package}
                  </h3>
                  <p className="text-gray-600  mb-2">Includes all basic services</p>
                  <ul className="space-y-2 mb-4">
                    {vendorData.services.slice(0, 4).map((service, index) => (
                      <li key={index} className="flex items-start">
                        <FaCheck className="text-pink-500 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-gray-700 ">{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-50  p-4 rounded-lg">
                  <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-2">
                    {vendorData.pricing.price}
                  </div>
                  <p className="text-gray-600  mb-4">Starting price</p>
                  <button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300">
                    Check Availability
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white  rounded-xl shadow-md overflow-hidden mb-8">
              <div className="flex overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setActiveTab("about")}
                  className={`px-6 py-4 font-medium text-sm flex items-center ${activeTab === "about" ? "text-pink-600 border-b-2 border-pink-600" : "text-gray-600 "}`}
                >
                  <FaInfoCircle className="mr-2" /> About
                </button>
                <button
                  onClick={() => setActiveTab("services")}
                  className={`px-6 py-4 font-medium text-sm flex items-center ${activeTab === "services" ? "text-pink-600 border-b-2 border-pink-600" : "text-gray-600 "}`}
                >
                  <FaListUl className="mr-2" /> Services
                </button>
                <button
                  onClick={() => setActiveTab("photos")}
                  className={`px-6 py-4 font-medium text-sm flex items-center ${activeTab === "photos" ? "text-pink-600 border-b-2 border-pink-600" : "text-gray-600 "}`}
                >
                  <FaImages className="mr-2" /> Photos
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`px-6 py-4 font-medium text-sm flex items-center ${activeTab === "reviews" ? "text-pink-600 border-b-2 border-pink-600" : "text-gray-600 "}`}
                >
                  <FaStar className="mr-2" /> Reviews
                </button>
              </div>
              
              <div className="p-6">
                {activeTab === "about" && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">About {vendorData.name}</h3>
                    <p className="text-gray-600  leading-relaxed">
                      {vendorData.description}
                    </p>
                  </div>
                )}
                
                {activeTab === "services" && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Our Services</h3>
                    <ul className="space-y-3">
                      {vendorData.services.map((service, index) => (
                        <li key={index} className="flex items-start">
                          <div className="bg-pink-100 dark:bg-pink-900 p-1 rounded-full mr-3 mt-1">
                            <FaCheck className="text-pink-600 dark:text-pink-400 w-3 h-3" />
                          </div>
                          <span className="text-gray-700 ">{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {activeTab === "photos" && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Gallery</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {vendorData.photos.map((photo, index) => (
                        <div key={index} className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                          <img
                            src={photo}
                            alt={`Vendor ${index + 1}`}
                            className="w-full h-48 object-cover hover:scale-105 transition duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === "reviews" && (
                  <div>
                    <ReviewSection entityId={vendorData._id} type="vendor" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:w-1/3">
            <Availability />
            
            {/* Contact Card */}
            <div className="bg-white  rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-pink-100 dark:bg-pink-900 p-2 rounded-full mr-3">
                    <FaPhone className="text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 ">Phone</h4>
                    <p className="text-gray-600 dark:text-gray-400">{vendorData.contact.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-pink-100 dark:bg-pink-900 p-2 rounded-full mr-3">
                    <svg className="w-5 h-5 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 ">Email</h4>
                    <p className="text-gray-600 dark:text-gray-400">{vendorData.contact.email || "info@example.com"}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-pink-100 dark:bg-pink-900 p-2 rounded-full mr-3">
                    <svg className="w-5 h-5 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 ">Location</h4>
                    <p className="text-gray-600 dark:text-gray-400">{vendorData.location}</p>
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-6 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center">
                <FaPhone className="mr-2" /> Call Now
              </button>
            </div>
            
            {/* Quick Action Card */}
            <div className="bg-gradient-to-r from-pink-500 to-teal-400 rounded-xl shadow-md p-6 text-white">
              <h2 className="text-xl font-bold mb-2">Ready to Book?</h2>
              <p className="mb-4">Limited availability for your selected date. Secure your spot now!</p>
              <button className="w-full bg-white text-pink-600 hover:bg-gray-100 font-bold py-3 px-4 rounded-lg transition duration-300">
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