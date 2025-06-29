import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaSearch, FaFilter, FaStar, FaMapMarkerAlt, FaHeart, 
  FaRegHeart, FaEye, FaPhone, FaEnvelope, FaGlobe,
  FaArrowRight, FaUsers, FaCalendar, FaAward, FaCheckCircle
} from 'react-icons/fa';

const VendorMarketplace = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [featuredVendors, setFeaturedVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [stats, setStats] = useState({
    totalVendors: 0,
    totalBookings: 0,
    avgRating: 0,
    happyCustomers: 0
  });

  const categories = [
    { name: "Photographer 📸", value: "photographer", icon: "📸" },
    { name: "Mehndi Artist 🌿", value: "mehndi", icon: "🌿" },
    { name: "Make-Up Artist 💄", value: "makeup", icon: "💄" },
    { name: "Caterers 🍲", value: "caterers", icon: "🍲" },
    { name: "DJ/Bands 🎶", value: "dj", icon: "🎶" },
    { name: "Decorators ✨", value: "decorators", icon: "✨" },
    { name: "Pandits 🕉️", value: "pandits", icon: "🕉️" },
    { name: "Invites & Gifts 🎁", value: "invite", icon: "🎁" },
    { name: "Venues 🏛️", value: "venues", icon: "🏛️" },
    { name: "Transport 🚗", value: "transport", icon: "🚗" },
    { name: "Fashion Wear 👗", value: "fashion", icon: "👗" },
    { name: "Jewelry 💎", value: "jewelry", icon: "💎" }
  ];

  const locations = [
    "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", 
    "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow"
  ];

  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "0-10000", label: "Under ₹10,000" },
    { value: "10000-25000", label: "₹10,000 - ₹25,000" },
    { value: "25000-50000", label: "₹25,000 - ₹50,000" },
    { value: "50000+", label: "Above ₹50,000" }
  ];

  const ratings = [
    { value: "all", label: "All Ratings" },
    { value: "4.5+", label: "4.5+ Stars" },
    { value: "4.0+", label: "4.0+ Stars" },
    { value: "3.5+", label: "3.5+ Stars" }
  ];

  useEffect(() => {
    fetchVendors();
    fetchFeaturedVendors();
    fetchStats();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/vendors/all`);
      setVendors(response.data || []);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedVendors = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/vendors/featured`);
      setFeaturedVendors(response.data || []);
    } catch (error) {
      console.error("Error fetching featured vendors:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/vendors/stats`);
      setStats(response.data || {
        totalVendors: 150,
        totalBookings: 2500,
        avgRating: 4.7,
        happyCustomers: 1200
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleVendorClick = (vendor) => {
    navigate(`/vendors/${vendor.type}/${vendor._id}`);
  };

  const toggleFavorite = (vendorId) => {
    setFavorites(prev => 
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || vendor.type === selectedCategory;
    const matchesLocation = selectedLocation === "all" || vendor.location.includes(selectedLocation);
    const matchesRating = ratingFilter === "all" || parseFloat(vendor.rating) >= parseFloat(ratingFilter);
    
    return matchesSearch && matchesCategory && matchesLocation && matchesRating;
  });

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar 
        key={i} 
        className={`${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'} text-sm`} 
      />
    ));
  };

  const VendorCard = ({ vendor, featured = false }) => (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow ${featured ? 'ring-2 ring-pink-500' : ''}`}>
      <div className="relative">
        <img
          src={vendor.CoverImage || "https://via.placeholder.com/400x250?text=No+Image"}
          alt={vendor.name}
          className="w-full h-48 object-cover"
        />
        {featured && (
          <div className="absolute top-2 left-2 bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
        <button
          onClick={() => toggleFavorite(vendor._id)}
          className="absolute top-2 right-2 bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-all"
        >
          {favorites.includes(vendor._id) ? (
            <FaHeart className="text-pink-500" />
          ) : (
            <FaRegHeart className="text-gray-400" />
          )}
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-800 text-lg">{vendor.name}</h3>
          <span className="text-sm text-gray-500 capitalize">{vendor.type}</span>
        </div>
        
        <div className="flex items-center mb-2">
          <FaMapMarkerAlt className="text-gray-400 mr-1 text-sm" />
          <span className="text-sm text-gray-600">{vendor.location}</span>
        </div>
        
        <div className="flex items-center mb-3">
          {renderStars(vendor.averageRating || 0)}
          <span className="text-sm text-gray-600 ml-1">
            {vendor.averageRating || 0} ({vendor.reviews || 0} reviews)
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {vendor.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-pink-600 font-semibold">
            {vendor.pricing?.price || "Contact for pricing"}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleVendorClick(vendor)}
              className="bg-pink-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-pink-700 transition-colors flex items-center gap-1"
            >
              <FaEye />
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Wedding Vendors
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-pink-100">
              Connect with trusted professionals to make your special day unforgettable
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for vendors, services, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 pl-12 text-gray-800 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">{stats.totalVendors}+</div>
              <div className="text-gray-600">Trusted Vendors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">{stats.totalBookings}+</div>
              <div className="text-gray-600">Successful Bookings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">{stats.avgRating}</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">{stats.happyCustomers}+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => navigate(`/vendors/${category.value}`)}
                className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center group"
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="text-sm font-medium text-gray-800 group-hover:text-pink-600 transition-colors">
                  {category.name.split(' ')[0]}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Vendors */}
        {featuredVendors.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Featured Vendors</h2>
              <button
                onClick={() => navigate('/vendors')}
                className="text-pink-600 hover:text-pink-700 font-semibold flex items-center gap-2"
              >
                View All
                <FaArrowRight />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVendors.slice(0, 6).map((vendor) => (
                <VendorCard key={vendor._id} vendor={vendor} featured={true} />
              ))}
            </div>
          </div>
        )}

        {/* All Vendors Section */}
        <div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <h2 className="text-3xl font-bold text-gray-800">All Vendors</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-lg hover:bg-pink-200 transition-colors"
              >
                <FaFilter />
                Filters
              </button>
              <span className="text-gray-600">
                {filteredVendors.length} vendors found
              </span>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                  >
                    <option value="all">All Locations</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                  >
                    {priceRanges.map((range) => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                  >
                    {ratings.map((rating) => (
                      <option key={rating.value} value={rating.value}>
                        {rating.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Vendors Grid */}
          {loading ? (
            null // Don't show loading, just return null
          ) : filteredVendors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.map((vendor) => (
                <VendorCard key={vendor._id} vendor={vendor} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No vendors found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedLocation('all');
                  setPriceRange('all');
                  setRatingFilter('all');
                }}
                className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl p-8 text-white text-center mt-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Planning?</h2>
          <p className="text-xl mb-6 text-pink-100">
            Join thousands of happy couples who found their perfect vendors
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/vendor-registration")}
              className="bg-white text-pink-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Register as Vendor
            </button>
            <button
              onClick={() => navigate("/user-registration")}
              className="bg-transparent border-2 border-white hover:bg-white hover:text-pink-600 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorMarketplace; 