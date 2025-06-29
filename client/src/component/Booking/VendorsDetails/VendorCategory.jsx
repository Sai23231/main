import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { FaSearch, FaFilter, FaStar, FaMapMarkerAlt, FaSort, FaEye, FaHeart } from "react-icons/fa";

const VendorCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [locationFilter, setLocationFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/vendors/${category}`
        );
        setVendors(response.data);
        setFilteredVendors(response.data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [category]);

  useEffect(() => {
    applyFilters();
  }, [vendors, searchTerm, sortBy, priceRange, ratingFilter, locationFilter]);

  const applyFilters = () => {
    let filtered = [...vendors];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(vendor =>
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Rating filter
    if (ratingFilter > 0) {
      filtered = filtered.filter(vendor => 
        parseFloat(vendor.rating) >= ratingFilter
      );
    }

    // Location filter
    if (locationFilter) {
      filtered = filtered.filter(vendor =>
        vendor.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Price range filter
    filtered = filtered.filter(vendor => {
      const price = parseFloat(vendor.pricing?.price?.replace(/[^\d]/g, '')) || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return parseFloat(b.rating) - parseFloat(a.rating);
        case "price-low":
          return (parseFloat(a.pricing?.price?.replace(/[^\d]/g, '')) || 0) - 
                 (parseFloat(b.pricing?.price?.replace(/[^\d]/g, '')) || 0);
        case "price-high":
          return (parseFloat(b.pricing?.price?.replace(/[^\d]/g, '')) || 0) - 
                 (parseFloat(a.pricing?.price?.replace(/[^\d]/g, '')) || 0);
        case "reviews":
          return (b.reviews || 0) - (a.reviews || 0);
        default:
          return 0;
      }
    });

    setFilteredVendors(filtered);
  };

  const handleNavigation = (id) => {
    navigate(`/vendors/${category}/${id}`);
  };

  const getUniqueLocations = () => {
    const locations = vendors.map(vendor => vendor.location).filter(Boolean);
    return [...new Set(locations)];
  };

  const formatPrice = (price) => {
    if (!price) return "Contact for pricing";
    if (typeof price === 'string') {
      const numPrice = price.replace(/[^\d]/g, '');
      return numPrice ? `₹${parseInt(numPrice).toLocaleString()}` : price;
    }
    return `₹${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex space-x-2 text-pink-100 text-sm">
          <li>
                <NavLink to="/" className="hover:text-white">
              Home
            </NavLink>
          </li>
          <li>/</li>
          <li>
                <NavLink to="/vendors" className="hover:text-white">
              Vendors
            </NavLink>
          </li>
          <li>/</li>
              <li className="text-white">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </li>
        </ol>
      </nav>

      {/* Page Title */}
          <h1 className="text-4xl font-bold mb-4">
        Top {category.charAt(0).toUpperCase() + category.slice(1)} in Your Area
      </h1>
          <p className="text-xl text-pink-100">
        Explore curated professionals to make your event unforgettable.
      </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="rating">Sort by Rating</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="reviews">Most Reviews</option>
              </select>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:w-auto px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center"
            >
              <FaFilter className="mr-2" />
              Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value={0}>Any Rating</option>
                    <option value={4.5}>4.5+ Stars</option>
                    <option value={4.0}>4.0+ Stars</option>
                    <option value={3.5}>3.5+ Stars</option>
                    <option value={3.0}>3.0+ Stars</option>
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">All Locations</option>
                    {getUniqueLocations().map((location, index) => (
                      <option key={index} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range (₹)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 100000])}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredVendors.length} of {vendors.length} vendors
          </p>
        </div>

      {/* Vendor Cards Grid */}
        {loading ? (
          null // Don't show loading, just return null
        ) : filteredVendors.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No vendors found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVendors.map((vendor, index) => (
          <div
            key={index}
                className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer"
            onClick={() => handleNavigation(vendor._id)}
          >
            {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
              <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={vendor.CoverImage || "https://via.placeholder.com/400x300?text=No+Image"}
                alt={vendor.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                    }}
              />
                  
              {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-white/95 px-2 py-1 rounded-full text-xs font-semibold shadow-sm">
                {vendor.rating} ★
                  </div>
                  
                  {/* Favorite Button */}
                  <button className="absolute top-3 left-3 bg-white/95 hover:bg-white p-2 rounded-full shadow-sm transition-all duration-300">
                    <FaHeart className="text-pink-500 text-sm" />
                  </button>
            </div>

            {/* Details Section */}
                <div className="p-5">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors line-clamp-1">
                {vendor.name}
              </h2>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <FaMapMarkerAlt className="text-pink-400 mr-2 flex-shrink-0" />
                    <span className="line-clamp-1">{vendor.location}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400 mr-3">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={`w-4 h-4 mr-0.5 ${i < Math.floor(parseFloat(vendor.rating)) ? 'text-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 font-medium">({vendor.reviews || 0} reviews)</span>
                    </div>
              </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                {vendor.description}
              </p>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="text-pink-600 font-semibold text-base">
                      {formatPrice(vendor.pricing?.price)}
            </div>
                    <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors font-medium flex items-center">
                      <FaEye className="mr-2" />
                View Details
              </button>
                  </div>
            </div>
          </div>
        ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorCategory;
