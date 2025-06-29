import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaSearch, FaFilter, FaStar, FaMapMarkerAlt, FaHeart, 
  FaRegHeart, FaEye, FaPhone, FaEnvelope, FaGlobe,
  FaArrowRight, FaUsers, FaCalendar, FaAward, FaCheckCircle,
  FaBuilding, FaParking, FaWifi, FaUtensils, FaMusic
} from 'react-icons/fa';

const VenueMarketplace = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [capacityFilter, setCapacityFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [venues, setVenues] = useState([]);
  const [featuredVenues, setFeaturedVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [stats, setStats] = useState({
    totalVenues: 0,
    totalBookings: 0,
    avgRating: 0,
    happyCustomers: 0
  });

  const categories = [
    { name: "Wedding Halls", value: "wedding-halls", icon: "🏛️" },
    { name: "Banquet Halls", value: "banquet-halls", icon: "🏰" },
    { name: "Garden Venues", value: "garden-venues", icon: "🌺" },
    { name: "Beach Venues", value: "beach-venues", icon: "🏖️" },
    { name: "Resort Venues", value: "resort-venues", icon: "🏨" },
    { name: "Farm Houses", value: "farm-houses", icon: "🏡" },
    { name: "Rooftop Venues", value: "rooftop-venues", icon: "🏢" },
    { name: "Heritage Venues", value: "heritage-venues", icon: "🏛️" },
    { name: "Luxury Hotels", value: "luxury-hotels", icon: "⭐" },
    { name: "Community Halls", value: "community-halls", icon: "🏢" },
    { name: "Outdoor Venues", value: "outdoor-venues", icon: "🌳" },
    { name: "Indoor Venues", value: "indoor-venues", icon: "🏠" }
  ];

  const locations = [
    "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", 
    "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow"
  ];

  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "0-50000", label: "Under ₹50,000" },
    { value: "50000-100000", label: "₹50,000 - ₹1,00,000" },
    { value: "100000-200000", label: "₹1,00,000 - ₹2,00,000" },
    { value: "200000+", label: "Above ₹2,00,000" }
  ];

  const ratings = [
    { value: "all", label: "All Ratings" },
    { value: "4.5+", label: "4.5+ Stars" },
    { value: "4.0+", label: "4.0+ Stars" },
    { value: "3.5+", label: "3.5+ Stars" }
  ];

  const capacities = [
    { value: "all", label: "All Capacities" },
    { value: "0-100", label: "Up to 100 guests" },
    { value: "100-300", label: "100-300 guests" },
    { value: "300-500", label: "300-500 guests" },
    { value: "500+", label: "500+ guests" }
  ];

  useEffect(() => {
    fetchVenues();
    fetchFeaturedVenues();
    fetchStats();
  }, []);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/venues/all`);
      setVenues(response.data || []);
    } catch (error) {
      console.error("Error fetching venues:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedVenues = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/venues/featured`);
      setFeaturedVenues(response.data || []);
    } catch (error) {
      console.error("Error fetching featured venues:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/venues/stats`);
      setStats(response.data || {
        totalVenues: 85,
        totalBookings: 1200,
        avgRating: 4.6,
        happyCustomers: 800
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleVenueClick = (venue) => {
    navigate(`/venues/${venue.type}/${venue._id}`);
  };

  const toggleFavorite = (venueId) => {
    setFavorites(prev => 
      prev.includes(venueId) 
        ? prev.filter(id => id !== venueId)
        : [...prev, venueId]
    );
  };

  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || venue.type === selectedCategory;
    const matchesLocation = selectedLocation === "all" || venue.location.includes(selectedLocation);
    const matchesRating = ratingFilter === "all" || parseFloat(venue.rating) >= parseFloat(ratingFilter);
    const matchesCapacity = capacityFilter === "all" || 
      (venue.capacity && venue.capacity >= parseInt(capacityFilter.split('-')[0]) && 
       venue.capacity <= parseInt(capacityFilter.split('-')[1] || '999999'));
    
    return matchesSearch && matchesCategory && matchesLocation && matchesRating && matchesCapacity;
  });

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar 
        key={i} 
        className={`${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'} text-sm`} 
      />
    ));
  };

  const VenueCard = ({ venue, featured = false }) => (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow ${featured ? 'ring-2 ring-pink-500' : ''}`}>
      <div className="relative">
        <img
          src={venue.CoverImage || "https://via.placeholder.com/400x250?text=No+Image"}
          alt={venue.name}
          className="w-full h-48 object-cover"
        />
        {featured && (
          <div className="absolute top-2 left-2 bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
        <button
          onClick={() => toggleFavorite(venue._id)}
          className="absolute top-2 right-2 bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-all"
        >
          {favorites.includes(venue._id) ? (
            <FaHeart className="text-pink-500" />
          ) : (
            <FaRegHeart className="text-gray-400" />
          )}
        </button>
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
          {venue.capacity || 'N/A'} guests
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-800 text-lg">{venue.name}</h3>
          <span className="text-sm text-gray-500 capitalize">{venue.type}</span>
        </div>
        
        <div className="flex items-center mb-2">
          <FaMapMarkerAlt className="text-gray-400 mr-1 text-sm" />
          <span className="text-sm text-gray-600">{venue.location}</span>
        </div>
        
        <div className="flex items-center mb-3">
          {renderStars(venue.averageRating || 0)}
          <span className="text-sm text-gray-600 ml-1">
            {venue.averageRating || 0} ({venue.reviews || 0} reviews)
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {venue.description}
        </p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1 mb-3">
          {venue.amenities?.slice(0, 4).map((amenity, index) => (
            <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
              {amenity}
            </span>
          ))}
          {venue.amenities?.length > 4 && (
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
              +{venue.amenities.length - 4} more
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-pink-600 font-semibold">
            {venue.pricing?.price || "Contact for pricing"}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleVenueClick(venue)}
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Wedding Venue
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Discover stunning venues for your special day
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for venues, locations, or amenities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 pl-12 text-gray-800 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
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
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalVenues}+</div>
              <div className="text-gray-600">Beautiful Venues</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalBookings}+</div>
              <div className="text-gray-600">Successful Bookings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.avgRating}</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.happyCustomers}+</div>
              <div className="text-gray-600">Happy Couples</div>
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
                onClick={() => navigate(`/venues/${category.value}`)}
                className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center group"
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                  {category.name.split(' ')[0]}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Venues */}
        {featuredVenues.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Featured Venues</h2>
              <button
                onClick={() => navigate('/venues')}
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
              >
                View All
                <FaArrowRight />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVenues.slice(0, 6).map((venue) => (
                <VenueCard key={venue._id} venue={venue} featured={true} />
              ))}
            </div>
          </div>
        )}

        {/* All Venues Section */}
        <div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <h2 className="text-3xl font-bold text-gray-800">All Venues</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <FaFilter />
                Filters
              </button>
              <span className="text-gray-600">
                {filteredVenues.length} venues found
              </span>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
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
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
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
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
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
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    {ratings.map((rating) => (
                      <option key={rating.value} value={rating.value}>
                        {rating.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                  <select
                    value={capacityFilter}
                    onChange={(e) => setCapacityFilter(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    {capacities.map((capacity) => (
                      <option key={capacity.value} value={capacity.value}>
                        {capacity.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Venues Grid */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredVenues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVenues.map((venue) => (
                <VenueCard key={venue._id} venue={venue} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🏛️</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No venues found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedLocation('all');
                  setPriceRange('all');
                  setRatingFilter('all');
                  setCapacityFilter('all');
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center mt-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your Venue?</h2>
          <p className="text-xl mb-6 text-blue-100">
            Join thousands of happy couples who found their perfect venue
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/venue-registration")}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Register as Venue
            </button>
            <button
              onClick={() => navigate("/user-registration")}
              className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueMarketplace; 