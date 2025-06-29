import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSearch, FaFilter, FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaHeart, FaEye, FaUsers, FaCalendar, FaTrophy, FaRegHeart } from "react-icons/fa";

const Vendors = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [featuredVendors, setFeaturedVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [marketplaceStats, setMarketplaceStats] = useState({
    totalVendors: 0,
    totalBookings: 0,
    happyCustomers: 0,
    cities: 0
  });

  const categories = [
    {
      name: "Photographer 📸",
      link: "photographer",
      img: "https://cdn.pixabay.com/photo/2016/11/29/04/54/photographer-1867417_1280.jpg",
      description: "Capture timeless memories with professional photographers.",
      count: 0
    },
    {
      name: "Mehndi Artist 🌿",
      link: "mehndi",
      img: "https://cdn.pixabay.com/photo/2017/10/08/16/06/mehndi-2830425_1280.jpg",
      description: "Add elegance with intricate Mehndi designs.",
      count: 0
    },
    {
      name: "Make-Up Artist 💄",
      link: "makeup",
      img: "https://cdn.pixabay.com/photo/2017/05/31/22/49/makeup-2361910_1280.jpg",
      description: "Look radiant with expert makeup artists.",
      count: 0
    },
    {
      name: "Caterers 🍲",
      link: "caterers",
      img: "https://cdn.pixabay.com/photo/2014/04/05/11/27/buffet-315691_960_720.jpg",
      description: "Delight guests with the best cuisines.",
      count: 0
    },
    {
      name: "DJ/Bands 🎶",
      link: "dj",
      img: "https://cdn.pixabay.com/photo/2016/11/22/19/15/hand-1850120_960_720.jpg",
      description: "Set the vibe with lively DJs and bands.",
      count: 0
    },
    {
      name: "Decorators ✨",
      link: "decorators",
      img: "https://cdn.pixabay.com/photo/2016/11/23/17/56/beach-1854076_1280.jpg",
      description: "Create stunning venues with expert decorators.",
      count: 0
    },
    {
      name: "Pandits 🕉️",
      link: "pandits",
      img: "https://cdn.pixabay.com/photo/2023/12/22/19/56/hinduism-8464313_1280.jpg",
      description: "Perform sacred rituals with experienced pandits.",
      count: 0
    },
    {
      name: "Invites & Gifts 🎁",
      link: "invite",
      img: "https://cdn.pixabay.com/photo/2017/08/06/07/16/wedding-2589803_640.jpg",
      description: "Share joy with beautiful invites and gifts.",
      count: 0
    },
    {
      name: "Venues 🏛️",
      link: "venues",
      img: "https://cdn.pixabay.com/photo/2016/11/18/17/20/hall-1835923_1280.jpg",
      description: "Find the perfect venue for your special day.",
      count: 0
    },
    {
      name: "Transport 🚗",
      link: "transport",
      img: "https://cdn.pixabay.com/photo/2016/11/18/12/49/bus-1835886_1280.jpg",
      description: "Arrive in style with luxury transportation.",
      count: 0
    },
    {
      name: "Fashion Wear 👗",
      link: "fashion",
      img: "https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2604149_1280.jpg",
      description: "Look stunning in designer wedding attire.",
      count: 0
    },
    {
      name: "Jewelry 💎",
      link: "jewelry",
      img: "https://cdn.pixabay.com/photo/2017/03/28/12/11/chairs-2181960_1280.jpg",
      description: "Adorn yourself with exquisite jewelry.",
      count: 0
    },
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
    fetchMarketplaceStats();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/vendors/all`);
      const allVendors = response.data || [];
      setVendors(allVendors);
      
      // Get featured vendors (top rated)
      const featured = allVendors
        .filter(vendor => vendor.averageRating >= 4.5)
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, 6);
      setFeaturedVendors(featured);
      
      // Update category counts
      const updatedCategories = categories.map(cat => ({
        ...cat,
        count: allVendors.filter(vendor => 
          vendor.type && vendor.type.toLowerCase().includes(cat.link.toLowerCase())
        ).length
      }));
      // Note: We can't directly update categories state as it's const, but we can use the updated data
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMarketplaceStats = async () => {
    try {
      // Mock stats for now - in real app, this would come from backend
      setMarketplaceStats({
        totalVendors: 1250,
        totalBookings: 8500,
        happyCustomers: 3200,
        cities: 15
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleNavigation = (link) => {
    navigate(`/vendors/${link}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

      {/* Marketplace Stats */}
     

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Vendors Section */}
        {featuredVendors.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Featured Vendors</h2>
              <div className="flex items-center text-pink-600">
                <FaTrophy className="mr-2" />
                <span className="font-semibold">Top Rated</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVendors.map((vendor) => (
                <div key={vendor._id} className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
                  <div className="relative overflow-hidden">
                    <img 
                      src={vendor.CoverImage || "https://via.placeholder.com/400x250?text=No+Image"} 
                      alt={vendor.name}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    <button
                      onClick={() => toggleFavorite(vendor._id)}
                      className="absolute top-3 right-3 bg-white/95 rounded-full p-2 shadow-sm hover:bg-white transition-all duration-300"
                    >
                      {favorites.includes(vendor._id) ? (
                        <FaHeart className="text-pink-500 text-sm" />
                      ) : (
                        <FaRegHeart className="text-gray-400 text-sm hover:text-pink-500 transition-colors" />
                      )}
                    </button>
                    
                    <div className="absolute bottom-3 left-3 bg-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
                      Featured
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-pink-600 transition-colors line-clamp-1">
                        {vendor.name}
                      </h3>
                    </div>
                    
                    <div className="flex items-center mb-3 text-sm text-gray-600">
                      <FaMapMarkerAlt className="text-pink-400 mr-2 flex-shrink-0" />
                      <span className="line-clamp-1">{vendor.location}</span>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      <div className="flex items-center mr-3">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={`${i < Math.floor(vendor.averageRating) ? 'text-yellow-400' : 'text-gray-300'} text-sm mr-0.5`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 font-medium">
                        {vendor.averageRating} ({vendor.reviews} reviews)
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {vendor.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-pink-600 font-semibold text-base">
                        {vendor.pricing?.price || "Contact for pricing"}
                      </span>
                      <button
                        onClick={() => handleVendorClick(vendor)}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.link}
                onClick={() => handleNavigation(category.link)}
                className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={category.img}
                    alt={category.name}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors line-clamp-1">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>
                 
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/vendor-registration")}
                className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
              >
                Register as Vendor
              </button>
              <button
                onClick={() => navigate("/userlogin")}
                className="border border-pink-600 text-pink-600 px-6 py-2 rounded-lg hover:bg-pink-50 transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.link} value={category.link}>
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
          )}
        </div>

        {/* All Vendors Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">All Vendors</h2>
          {loading ? (
            null // Don't show loading, just return null
          ) : filteredVendors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.map((vendor) => (
                <div key={vendor._id} className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
                  <div className="relative overflow-hidden">
                    <img 
                      src={vendor.CoverImage || "https://via.placeholder.com/400x250?text=No+Image"} 
                      alt={vendor.name}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    <button
                      onClick={() => toggleFavorite(vendor._id)}
                      className="absolute top-3 right-3 bg-white/95 rounded-full p-2 shadow-sm hover:bg-white transition-all duration-300"
                    >
                      {favorites.includes(vendor._id) ? (
                        <FaHeart className="text-pink-500 text-sm" />
                      ) : (
                        <FaRegHeart className="text-gray-400 text-sm hover:text-pink-500 transition-colors" />
                      )}
                    </button>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-pink-600 transition-colors line-clamp-1">
                        {vendor.name}
                      </h3>
                    </div>
                    
                    <div className="flex items-center mb-3 text-sm text-gray-600">
                      <FaMapMarkerAlt className="text-pink-400 mr-2 flex-shrink-0" />
                      <span className="line-clamp-1">{vendor.location}</span>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      <div className="flex items-center mr-3">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={`${i < Math.floor(vendor.averageRating) ? 'text-yellow-400' : 'text-gray-300'} text-sm mr-0.5`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 font-medium">
                        {vendor.averageRating} ({vendor.reviews} reviews)
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {vendor.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-pink-600 font-semibold text-base">
                        {vendor.pricing?.price || "Contact for pricing"}
                      </span>
                      <button
                        onClick={() => handleVendorClick(vendor)}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No vendors found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Vendors;
