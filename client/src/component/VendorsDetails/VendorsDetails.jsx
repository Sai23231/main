import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectLoggedInUser } from "../UserLogin/authSlice";
import { 
  FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, 
  FaHeart, FaShare, FaCalendar, FaClock, FaUsers, FaAward,
  FaRegHeart, FaFacebook, FaInstagram, FaTwitter, FaLinkedin,
  FaCheckCircle, FaTimes, FaEye, FaDownload
} from "react-icons/fa";

const VendorsDetails = () => {
  const { type, vendorId } = useParams();
  const navigate = useNavigate();
  const user = useSelector(selectLoggedInUser);
  
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showContactModal, setShowContactModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    fetchVendorDetails();
  }, [type, vendorId]);

  const fetchVendorDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/vendors/${type}/${vendorId}`);
      setVendor(response.data);
    } catch (error) {
      console.error("Error fetching vendor details:", error);
      toast.error("Failed to load vendor details");
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    if (!user) {
      toast.error("Please login to make a booking");
      navigate("/userlogin");
      return;
    }
    setShowBookingModal(true);
  };

  const handleContact = () => {
    setShowContactModal(true);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: vendor?.name,
          text: `Check out ${vendor?.name} on Dream Ventz!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const formatPrice = (price) => {
    if (!price || price === "Contact for pricing") return "Contact for pricing";
    if (typeof price === 'string' && price.includes('₹')) return price;
    return `₹${price}`;
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar 
        key={i} 
        className={`${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'} text-lg`} 
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vendor details...</p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">😕</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Vendor not found</h3>
          <p className="text-gray-600 mb-4">The vendor you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate("/vendors")}
            className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
          >
            Browse Other Vendors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-pink-600 to-purple-600">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">{vendor.name}</h1>
                <div className="flex items-center gap-4 text-lg">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{vendor.location}</span>
                  </div>
                  <div className="flex items-center">
                    {renderStars(vendor.averageRating || 0)}
                    <span className="ml-2">{vendor.averageRating || 0} ({vendor.reviews || 0} reviews)</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={toggleFavorite}
                  className="bg-white bg-opacity-20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-opacity-30 transition-all"
                >
                  {isFavorite ? <FaHeart className="text-pink-400" /> : <FaRegHeart />}
                </button>
                <button
                  onClick={handleShare}
                  className="bg-white bg-opacity-20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-opacity-30 transition-all"
                >
                  <FaShare />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <img
                    src={vendor.CoverImage || "https://via.placeholder.com/600x400?text=No+Image"}
                    alt={vendor.name}
                    className="w-full h-64 object-cover rounded-lg cursor-pointer"
                    onClick={() => setShowImageModal(true)}
                  />
                  <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-2 py-1 rounded-full text-sm font-semibold">
                    {vendor.photos?.length || 1} photos
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {vendor.photos?.slice(1, 5).map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`${vendor.name} ${index + 2}`}
                      className="w-full h-32 object-cover rounded-lg cursor-pointer"
                      onClick={() => setShowImageModal(true)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  {['overview', 'services', 'reviews', 'photos'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-4 text-sm font-medium capitalize ${
                        activeTab === tab
                          ? 'border-b-2 border-pink-500 text-pink-600'
                          : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">About {vendor.name}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{vendor.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Business Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <FaAward className="text-pink-500 mr-3 w-4" />
                            <span>Experience: {vendor.businessDetails?.experience || "Not specified"}</span>
                          </div>
                          <div className="flex items-center">
                            <FaUsers className="text-pink-500 mr-3 w-4" />
                            <span>Team Size: {vendor.businessDetails?.teamSize || "Not specified"}</span>
                          </div>
                          <div className="flex items-center">
                            <FaMapMarkerAlt className="text-pink-500 mr-3 w-4" />
                            <span>Address: {vendor.businessDetails?.address || "Not specified"}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Specializations</h4>
                        <div className="flex flex-wrap gap-2">
                          {vendor.businessDetails?.specializations?.map((spec, index) => (
                            <span key={index} className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm">
                              {spec}
                            </span>
                          )) || <span className="text-gray-500">Not specified</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'services' && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Services & Pricing</h3>
                    <div className="space-y-6">
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-800 mb-2">{vendor.pricing?.package || "Standard Package"}</h4>
                        <p className="text-3xl font-bold text-pink-600 mb-2">
                          {formatPrice(vendor.pricing?.price)}
                        </p>
                        <ul className="space-y-2">
                          {vendor.services?.map((service, index) => (
                            <li key={index} className="flex items-center text-gray-600">
                              <FaCheckCircle className="text-green-500 mr-2 w-4" />
                              {service}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Reviews & Ratings</h3>
                    <div className="text-center py-8">
                      <div className="text-6xl font-bold text-pink-600 mb-2">{vendor.averageRating || 0}</div>
                      <div className="flex justify-center mb-2">
                        {renderStars(vendor.averageRating || 0)}
                      </div>
                      <p className="text-gray-600">Based on {vendor.reviews || 0} reviews</p>
                    </div>
                    <div className="text-center text-gray-500">
                      <p>No reviews yet. Be the first to review this vendor!</p>
                    </div>
                  </div>
                )}

                {activeTab === 'photos' && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Photo Gallery</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {vendor.photos?.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`${vendor.name} ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => setShowImageModal(true)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FaPhone className="text-pink-500 mr-3 w-4" />
                  <span className="text-gray-600">{vendor.contact?.phone || "Not available"}</span>
                </div>
                <div className="flex items-center">
                  <FaEnvelope className="text-pink-500 mr-3 w-4" />
                  <span className="text-gray-600">{vendor.contact?.email || "Not available"}</span>
                </div>
                {vendor.contact?.website && (
                  <div className="flex items-center">
                    <FaGlobe className="text-pink-500 mr-3 w-4" />
                    <a href={vendor.contact.website} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">
                      Visit Website
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={handleContact}
                  className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition-colors font-semibold"
                >
                  Contact Vendor
                </button>
                <button
                  onClick={handleBooking}
                  className="w-full border-2 border-pink-600 text-pink-600 py-3 rounded-lg hover:bg-pink-50 transition-colors font-semibold"
                >
                  Check Availability
                </button>
              </div>
            </div>

            {/* Business Hours */}
            {vendor.businessHours && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Business Hours</h3>
                <div className="space-y-2 text-sm">
                  {Object.entries(vendor.businessHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="capitalize font-medium">{day}</span>
                      <span className="text-gray-600">{hours || "Closed"}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Media */}
            {vendor.socialMedia && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Follow Us</h3>
                <div className="flex space-x-3">
                  {vendor.socialMedia.facebook && (
                    <a href={vendor.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                      <FaFacebook className="text-2xl" />
                    </a>
                  )}
                  {vendor.socialMedia.instagram && (
                    <a href={vendor.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700">
                      <FaInstagram className="text-2xl" />
                    </a>
                  )}
                  {vendor.socialMedia.twitter && (
                    <a href={vendor.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500">
                      <FaTwitter className="text-2xl" />
                    </a>
                  )}
                  {vendor.socialMedia.linkedin && (
                    <a href={vendor.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800">
                      <FaLinkedin className="text-2xl" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Contact {vendor.name}</h3>
              <button onClick={() => setShowContactModal(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input type="text" className="w-full px-3 py-2 border rounded-md" placeholder="Enter your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                <input type="email" className="w-full px-3 py-2 border rounded-md" placeholder="Enter your email" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea className="w-full px-3 py-2 border rounded-md" rows="4" placeholder="Enter your message"></textarea>
              </div>
              <button className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 transition-colors">
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Book {vendor.name}</h3>
              <button onClick={() => setShowBookingModal(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes />
              </button>
            </div>
            <div className="text-center">
              <p className="text-gray-600 mb-4">Redirecting to booking page...</p>
              <button
                onClick={() => {
                  setShowBookingModal(false);
                  navigate(`/availability/${vendor.type}/${vendor._id}`);
                }}
                className="bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700 transition-colors"
              >
                Continue to Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-full mx-4">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
            >
              <FaTimes />
            </button>
            <img
              src={vendor.CoverImage || "https://via.placeholder.com/800x600?text=No+Image"}
              alt={vendor.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorsDetails; 