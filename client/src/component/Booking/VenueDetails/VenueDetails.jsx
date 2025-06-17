import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { 
  FaCheck, FaPhone, FaMapMarkerAlt, FaStar, 
  FaUtensils, FaParking, FaBed, FaMoneyBillWave, 
  FaClock, FaCalendarAlt, FaInfoCircle, FaImages,
  FaListUl, FaEnvelope, FaArrowRight
} from "react-icons/fa";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ReviewSection from "../../Review/Review.jsx";
import Availability from "../check/availability.jsx";
import Portfolio from "./Portfolio.jsx";

const VenueDetails = () => {
  const { pathname } = useLocation();
  const cleanedPathvenueId = pathname.split("/").pop();
  const [venueData, setVenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchVenueData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/venue/venueDetails/${cleanedPathvenueId}`
        );
        setVenueData(response.data);
      } catch (error) {
        console.error("Error fetching venue data:", error);
        setError("Failed to load venue details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchVenueData();
  }, [cleanedPathvenueId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          <p className="mt-4 text-gray-600 ">Loading venue details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Venue</h2>
          <p className="text-gray-600  mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!venueData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">No Venue Data</h2>
          <p className="text-gray-600  mb-6">The venue details could not be loaded.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">About {venueData.name}</h2>
              <p className="text-gray-600  leading-relaxed">
                {venueData.description}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Capacity & Space</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-white">Seating Capacity</h3>
                  <p className="text-2xl font-bold text-pink-600 dark:text-pink-400 mt-2">
                    {venueData.capacity.seating}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-white">Maximum Capacity</h3>
                  <p className="text-2xl font-bold text-pink-600 dark:text-pink-400 mt-2">
                    {venueData.capacity.maxCapacity}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case "services":
        return (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Services & Amenities</h2>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <FaListUl className="mr-2 text-pink-500" />
                  Banquet Types
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {venueData.services.banquetType.map((type, index) => (
                    <div key={index} className="flex items-start bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 ">{type}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <FaUtensils className="mr-2 text-pink-500" />
                  Serves
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {venueData.services.serves.map((serve, index) => (
                    <div key={index} className="flex items-start bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 ">{serve}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case "policies":
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Venue Policies</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-white flex items-center mb-3">
                  <FaClock className="mr-2 text-pink-500" />
                  Timing & Slots
                </h3>
                <ul className="space-y-2">
                  {venueData.policies.timingSlots.map((slot, index) => (
                    <li key={index} className="text-gray-600  flex items-start">
                      <span className="inline-block w-2 h-2 bg-pink-500 rounded-full mt-2 mr-2"></span>
                      {slot}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-white flex items-center mb-3">
                  <FaBed className="mr-2 text-pink-500" />
                  Changing Rooms
                </h3>
                <ul className="space-y-2">
                  <li className="text-gray-600 ">{venueData.policies.changingRooms} Rooms</li>
                  <li className="text-gray-600 ">AC Rooms</li>
                </ul>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-white flex items-center mb-3">
                  <FaParking className="mr-2 text-pink-500" />
                  Parking
                </h3>
                <p className="text-gray-600 ">{venueData.policies.parking}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-white flex items-center mb-3">
                  <FaMoneyBillWave className="mr-2 text-pink-500" />
                  Advance Payment
                </h3>
                <p className="text-gray-600 ">{venueData.policies.advancePayment}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-white flex items-center mb-3">
                  <FaMoneyBillWave className="mr-2 text-pink-500" />
                  Taxes
                </h3>
                <p className="text-gray-600 ">{venueData.policies.taxes}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-white flex items-center mb-3">
                  <FaCalendarAlt className="mr-2 text-pink-500" />
                  Cancellation
                </h3>
                <p className="text-gray-600 ">{venueData.policies.cancellation}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-white flex items-center mb-3">
                  <FaUtensils className="mr-2 text-pink-500" />
                  Food Policy
                </h3>
                <ul className="space-y-2">
                  {venueData.policies.food.map((food, index) => (
                    <li key={index} className="text-gray-600 ">
                      {food}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-white flex items-center mb-3">
                  <FaInfoCircle className="mr-2 text-pink-500" />
                  Decoration
                </h3>
                <ul className="space-y-2">
                  {venueData.policies.decoration.map((decor, index) => (
                    <li key={index} className="text-gray-600 ">
                      {decor}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-white flex items-center mb-3">
                  <FaBed className="mr-2 text-pink-500" />
                  Lodging
                </h3>
                <p className="text-gray-600 ">{venueData.policies.lodging}</p>
              </div>
            </div>
          </div>
        );
      case "gallery":
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <Portfolio photos={venueData.photos} videos={venueData.videos || []} />
          </div>
        );
      case "reviews":
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <ReviewSection entityId={venueData._id} type="venue" />
          </div>
        );
      case "location":
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="h-96">
                <iframe
                  src={venueData.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  allowFullScreen=""
                  loading="lazy"
                  className="border-0"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Venue Location"
                ></iframe>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Visit Us</h2>
                <div className="flex items-start mb-4">
                  <FaMapMarkerAlt className="text-pink-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">Address</h3>
                    <p className="text-gray-600 ">{venueData.location}</p>
                  </div>
                </div>
                <div className="flex items-start mb-4">
                  <FaPhone className="text-pink-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">Phone</h3>
                    <p className="text-gray-600 ">{venueData.contact.phone}</p>
                  </div>
                </div>
                {venueData.contact.email && (
                  <div className="flex items-start">
                    <FaEnvelope className="text-pink-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white">Email</h3>
                      <p className="text-gray-600 ">{venueData.contact.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50  min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-pink-500 to-pink-400 text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-1/2">
              <h1 className="text-4xl font-bold mb-4">{venueData.name}</h1>
              <div className="flex items-center mb-4">
                <FaMapMarkerAlt className="mr-2 text-pink-200" />
                <span>{venueData.location}</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                  Wedding Hall
                </span>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                  Banquet Hall
                </span>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                  Engagement Hall
                </span>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                  Party Hall
                </span>
              </div>

              <div className="flex items-center mb-6">
                <div className="flex items-center mr-6">
                  <FaStar className="text-yellow-300 mr-1" />
                  <span>4.8 (120 reviews)</span>
                </div>
                <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                  Veg: ₹260/plate
                </div>
              </div>

              <div className="flex space-x-4">
                <button className="bg-white text-pink-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors shadow-md">
                  Contact Now
                </button>
                <button 
                  onClick={() => setActiveTab("location")}
                  className="bg-transparent border-2 border-white hover:bg-white hover:text-pink-600 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  View Location
                </button>
              </div>
            </div>
            
            <div className="lg:w-1/2 mt-8 lg:mt-0">
              <Carousel
                showThumbs={false}
                infiniteLoop
                autoPlay
                interval={5000}
                showStatus={false}
                className="rounded-xl overflow-hidden shadow-2xl"
              >
                {venueData.photos.map((photo, index) => (
                  <div key={index} className="h-96">
                    <img
                      src={photo}
                      alt={`Venue ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = 'https://via.placeholder.com/800x500?text=Image+Not+Available';
                      }}
                    />
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Venue Info */}
          <div className="lg:w-2/3">
            {/* Navigation Tabs */}
            <div className="mb-8 bg-white  rounded-xl shadow-md overflow-hidden">
              <nav className="flex overflow-x-auto">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-6 py-4 font-medium text-sm border-b-2 whitespace-nowrap transition-colors ${activeTab === "overview" ? "border-pink-500 text-pink-600 dark:text-pink-400" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                >
                  <div className="flex items-center">
                    <FaInfoCircle className="mr-2" />
                    Overview
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("services")}
                  className={`px-6 py-4 font-medium text-sm border-b-2 whitespace-nowrap transition-colors ${activeTab === "services" ? "border-pink-500 text-pink-600 dark:text-pink-400" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                >
                  <div className="flex items-center">
                    <FaListUl className="mr-2" />
                    Services
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("policies")}
                  className={`px-6 py-4 font-medium text-sm border-b-2 whitespace-nowrap transition-colors ${activeTab === "policies" ? "border-pink-500 text-pink-600 dark:text-pink-400" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                >
                  <div className="flex items-center">
                    <FaInfoCircle className="mr-2" />
                    Policies
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("gallery")}
                  className={`px-6 py-4 font-medium text-sm border-b-2 whitespace-nowrap transition-colors ${activeTab === "gallery" ? "border-pink-500 text-pink-600 dark:text-pink-400" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                >
                  <div className="flex items-center">
                    <FaImages className="mr-2" />
                    Gallery
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`px-6 py-4 font-medium text-sm border-b-2 whitespace-nowrap transition-colors ${activeTab === "reviews" ? "border-pink-500 text-pink-600 dark:text-pink-400" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                >
                  <div className="flex items-center">
                    <FaStar className="mr-2" />
                    Reviews
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("location")}
                  className={`px-6 py-4 font-medium text-sm border-b-2 whitespace-nowrap transition-colors ${activeTab === "location" ? "border-pink-500 text-pink-600 dark:text-pink-400" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                >
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-2" />
                    Location
                  </div>
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {renderTabContent()}
          </div>

          {/* Right Side - Booking & Contact */}
          <div className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              {/* Pricing Card */}
              <div className="bg-white  rounded-xl shadow-lg overflow-hidden">
                <div className="bg-pink-600 dark:bg-pink-700 px-6 py-4">
                  <h3 className="text-xl font-bold text-white">Pricing</h3>
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 ">Veg Package</h4>
                    <p className="text-3xl font-bold text-pink-600 dark:text-pink-400 mt-2">
                      ₹260 / plate
                    </p>
                    <p className="text-gray-500  mt-2">Starting price</p>
                  </div>
                  <button className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                    Get Exact Quote
                  </button>
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-white  rounded-xl shadow-lg overflow-hidden">
                <div className="bg-emerald-600 dark:bg-emerald-700 px-6 py-4">
                  <h3 className="text-xl font-bold text-white">Contact Info</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <FaPhone className="text-emerald-500 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-800 ">Phone</h4>
                        <p className="text-gray-600 ">{venueData.contact.phone}</p>
                      </div>
                    </div>
                    {venueData.contact.email && (
                      <div className="flex items-start">
                        <FaEnvelope className="text-emerald-500 mt-1 mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-gray-800 ">Email</h4>
                          <p className="text-gray-600 ">{venueData.contact.email}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg font-medium mt-6 transition-colors">
                    Send Inquiry
                  </button>
                </div>
              </div>

              {/* Availability Component */}
              <Availability vendorId={cleanedPathvenueId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;