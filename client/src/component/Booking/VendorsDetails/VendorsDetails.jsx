import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Availability from "../check/availability";
import ReviewSection from "../../Review/Review";
import { FaPhone, FaCheck, FaStar, FaImages, FaInfoCircle, FaListUl, FaEnvelope, FaMapMarkerAlt, FaHeart, FaShare, FaCalendar, FaClock, FaUsers, FaAward } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const VendorDetails = () => {
  const { category, id } = useParams();
  const [vendorData, setVendorData] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching vendor details for:', category, id);
        
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/vendors/${category}/${id}`
        );
        
        console.log('Vendor details response:', response.data);
        setVendorData(response.data);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
        setError(error.response?.data?.message || 'Failed to load vendor details');
      } finally {
        setLoading(false);
      }
    };

    if (category && id) {
      fetchVendorData();
    }
  }, [category, id]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      // Here you would typically send the contact form data to your backend
      console.log('Contact form submitted:', contactForm);
      setShowContactForm(false);
      setContactForm({ name: "", email: "", phone: "", message: "" });
      // You can add a success toast here
    } catch (error) {
      console.error('Error submitting contact form:', error);
    }
  };

  const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Here you would typically save to user's favorites
  };

  const shareVendor = () => {
    if (navigator.share) {
      navigator.share({
        title: vendorData.name,
        text: `Check out ${vendorData.name} - ${vendorData.description}`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return null;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Vendor</h2>
          <p className="text-gray-600 mb-6">{error}</p>
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

  if (!vendorData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Vendor Not Found</h2>
          <p className="text-gray-600 mb-6">The vendor details could not be loaded.</p>
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

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-pink-700 to-pink-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-4xl font-bold">{vendorData.name}</h1>
                <div className="flex space-x-2">
                  <button
                    onClick={toggleFavorite}
                    className={`p-2 rounded-full transition-colors ${
                      isFavorite ? 'bg-red-500 text-white' : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                    }`}
                  >
                    <FaHeart className="w-5 h-5" />
                  </button>
                  <button
                    onClick={shareVendor}
                    className="p-2 rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-colors"
                  >
                    <FaShare className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center mb-5">
                <div className="flex text-yellow-400 mr-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="w-5 h-5" />
                  ))}
                </div>
                <span className="text-pink-100">({vendorData.reviews || 0} reviews)</span>
              </div>
              
              <div className="flex items-center mb-6">
                <FaMapMarkerAlt className="mr-2 text-pink-200" />
                <span className="text-lg text-pink-100">{vendorData.location}</span>
              </div>
              
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
              
              <div className="flex space-x-4">
                <button 
                  onClick={() => setShowContactForm(true)}
                  className="bg-white text-pink-700 hover:bg-gray-100 font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 flex items-center"
                >
                Contact Vendor <IoIosArrowForward className="ml-2" />
              </button>
                <button className="bg-transparent border-2 border-white hover:bg-white hover:text-pink-700 font-bold py-3 px-6 rounded-full transition duration-300">
                  View Gallery
                </button>
              </div>
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
                {(vendorData.photos && vendorData.photos.length > 0) ? (
                  vendorData.photos.map((photo, index) => (
                    <div key={index} className="h-64 md:h-96">
                      <img 
                        src={photo} 
                        alt={`Vendor ${index + 1}`} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/800x500?text=No+Image';
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="h-64 md:h-96">
                    <img 
                      src={vendorData.CoverImage || 'https://via.placeholder.com/800x500?text=No+Image'} 
                      alt="Vendor" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </Carousel>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <FaAward className="text-pink-600 w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{vendorData.rating || "0.0"}</div>
              <div className="text-sm text-gray-600">Rating</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <FaUsers className="text-pink-600 w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{vendorData.reviews || 0}</div>
              <div className="text-sm text-gray-600">Reviews</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <FaCalendar className="text-pink-600 w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-gray-800">5+</div>
              <div className="text-sm text-gray-600">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <FaClock className="text-pink-600 w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-gray-800">24h</div>
              <div className="text-sm text-gray-600">Response Time</div>
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
                    {vendorData.pricing?.package || "Standard Package"}
                  </h3>
                  <p className="text-gray-600 mb-4">Comprehensive service package includes:</p>
                  <ul className="space-y-3 mb-4">
                    {(vendorData.services || []).slice(0, 4).map((service, index) => (
                      <li key={index} className="flex items-start">
                        <FaCheck className="text-pink-600 mt-1 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-pink-50 p-6 rounded-lg border border-pink-100">
                  <div className="text-3xl font-bold text-pink-700 mb-3">
                    {vendorData.pricing?.price || "Contact for pricing"}
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
                    <p className="text-gray-600 leading-relaxed mb-6">{vendorData.description}</p>
                    
                    {/* Business Details */}
                    {vendorData.businessDetails && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        {vendorData.businessDetails.experience && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-800 mb-2">Experience</h4>
                            <p className="text-gray-600">{vendorData.businessDetails.experience}</p>
                          </div>
                        )}
                        {vendorData.businessDetails.teamSize && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-800 mb-2">Team Size</h4>
                            <p className="text-gray-600">{vendorData.businessDetails.teamSize}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
                {activeTab === "services" && (
                  <>
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">Our Services</h3>
                    <ul className="space-y-4">
                      {(vendorData.services || []).map((service, index) => (
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
                      {(vendorData.photos && vendorData.photos.length > 0) ? (
                        vendorData.photos.map((photo, index) => (
                          <div key={index} className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                            <img 
                              src={photo} 
                              alt={`Vendor ${index + 1}`} 
                              className="w-full h-48 object-cover hover:scale-105 transition duration-300 transform-gpu"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                              }}
                            />
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-8 text-gray-500">
                          No photos available
                        </div>
                      )}
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
            <Availability vendorName={vendorData.name} vendorId={vendorData._id} />

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
                    <p className="text-gray-600">{vendorData.contact?.phone || "Not available"}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-pink-100 p-3 rounded-full mr-4">
                    <FaEnvelope className="text-pink-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Email</h4>
                    <p className="text-gray-600">{vendorData.contact?.email || "Not available"}</p>
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

              <button 
                onClick={() => setShowContactForm(true)}
                className="w-full mt-6 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
              >
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

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Contact {vendorData.name}</h3>
              <button
                onClick={() => setShowContactForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={contactForm.name}
                  onChange={handleContactChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={contactForm.email}
                  onChange={handleContactChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={contactForm.phone}
                  onChange={handleContactChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea
                  name="message"
                  value={contactForm.message}
                  onChange={handleContactChange}
                  required
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Tell us about your event requirements..."
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Send Message
                </button>
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDetails;