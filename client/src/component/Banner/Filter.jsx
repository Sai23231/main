import { useState, useEffect } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";

export default function VenueForm() {
  const [venues, setVenues] = useState([]);
  const [uniqueValues, setUniqueValues] = useState({
    venueTypes: [],
    cities: [],
    budgets: ["Under ₹50,000", "₹50,000 - ₹1,00,000", "₹1,00,000 - ₹2,00,000", "Over ₹2,00,000"],
    capacities: ["Under 200", "200-300", "300-500", "500+"],
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [matchThreshold, setMatchThreshold] = useState(50);
  const [filters, setFilters] = useState({
    venueType: [],
    budget: [],
    capacity: [],
    city: [],
    vegOnly: false,
    nonVegOnly: false
  });
  const [activeFilter, setActiveFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch venues from backend API
  const fetchVenues = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/venue`);
      return response.data;
    } catch (error) {
      console.error("Error fetching venues:", error);
      throw error;
    }
  };

  // Fetch reviews for a venue
  const fetchReviews = async (venueId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/venue/venuereviews/${venueId}`
      );
      const reviewsData = response.data;

      const totalRating = reviewsData.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      const averageRating = reviewsData.length
        ? (totalRating / reviewsData.length).toFixed(1)
        : 0;

      return {
        averageRating,
        count: reviewsData.length,
      };
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return {
        averageRating: 0,
        count: 0,
      };
    }
  };

  // Extract city name from location string
  const extractCity = (location) => {
    if (!location) return "";
    // Split by comma and get the first part (city name)
    return location.split(",")[0].trim();
  };

  // Load venues data
  useEffect(() => {
    const loadData = async () => {
      try {
        const venuesData = await fetchVenues();
        
        // Process venues data to extract cities and add reviews
        const processedVenues = await Promise.all(
          venuesData.map(async (venue) => {
            const reviewData = await fetchReviews(venue._id);
            return {
              ...venue,
              averageRating: reviewData.averageRating,
              reviewCount: reviewData.count,
              city: extractCity(venue.location), // Add extracted city
              capacity: venue.guests ? parseInt(venue.guests) : 0,
              rentPrice: venue.rentPrice ? parseInt(venue.rentPrice) : null,
              vegPrice: venue.price?.veg && venue.price.veg !== "NA" ? parseInt(venue.price.veg) : null,
              nonVegPrice: venue.price?.nonVeg && venue.price.nonVeg !== "NA" ? parseInt(venue.price.nonVeg) : null
            };
          })
        );

        // Extract unique values
        const cities = [...new Set(processedVenues.map(v => v.city))].filter(Boolean);
        const venueTypes = [...new Set(processedVenues.map(v => v.type))].filter(Boolean);

        setVenues(processedVenues);
        setUniqueValues(prev => ({
          ...prev,
          venueTypes,
          cities
        }));
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Failed to load data: " + error.message);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate match score based on filters
  const calculateMatchScore = (venue, filters) => {
    let score = 0;
    const maxPossibleScore = Object.keys(filters).filter(k => 
      k !== 'vegOnly' && k !== 'nonVegOnly' && filters[k].length > 0
    ).length;

    if (maxPossibleScore === 0) return { venue, score: 0 };

    // Check venue type
    if (filters.venueType.length > 0 && venue.type) {
      if (filters.venueType.includes(venue.type)) {
        score++;
      }
    }

    // Check budget
    if (filters.budget.length > 0 && venue.rentPrice) {
      const price = venue.rentPrice;
      const matches = filters.budget.some(range => {
        if (range === "Under ₹50,000") return price < 50000;
        if (range === "₹50,000 - ₹1,00,000") return price >= 50000 && price < 100000;
        if (range === "₹1,00,000 - ₹2,00,000") return price >= 100000 && price < 200000;
        if (range === "Over ₹2,00,000") return price >= 200000;
        return false;
      });
      if (matches) score++;
    }

    // Check capacity
    if (filters.capacity.length > 0 && venue.capacity) {
      const capacity = venue.capacity;
      const matches = filters.capacity.some(range => {
        if (range === "Under 200") return capacity < 200;
        if (range === "200-300") return capacity >= 200 && capacity <= 300;
        if (range === "300-500") return capacity > 300 && capacity <= 500;
        if (range === "500+") return capacity > 500;
        return false;
      });
      if (matches) score++;
    }

    // Check city
    if (filters.city.length > 0 && venue.city) {
      if (filters.city.includes(venue.city)) {
        score++;
      }
    }

    const percentage = Math.round((score / maxPossibleScore) * 100);
    return { venue, score: percentage };
  };

  // Handle checkbox change
  const handleCheckboxChange = (field, value) => {
    setFilters((prev) => {
      const updated = { ...prev };
      if (updated[field].includes(value)) {
        updated[field] = updated[field].filter((item) => item !== value);
      } else {
        updated[field] = [...updated[field], value];
      }
      return updated;
    });
  };

  // Toggle filter dropdown
  const toggleFilter = (filterName) => {
    setActiveFilter(activeFilter === filterName ? null : filterName);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    try {
      if (!venues || venues.length === 0) {
        throw new Error("No venue data available");
      }

      // Calculate scores for all venues
      let scoredVenues = venues.map((venue) =>
        calculateMatchScore(venue, filters)
      );

      // Apply veg/non-veg filters
      if (filters.vegOnly) {
        scoredVenues = scoredVenues.filter(item => item.venue.vegPrice !== null);
      }
      if (filters.nonVegOnly) {
        scoredVenues = scoredVenues.filter(item => item.venue.nonVegPrice !== null);
      }

      // Sort by score (highest first) and filter by threshold
      const matchingVenues = scoredVenues
        .filter((item) => item.score >= matchThreshold)
        .sort((a, b) => b.score - a.score);

      // Apply search filter if search query exists
      const filteredBySearch = searchQuery 
        ? matchingVenues.filter(item => 
            item.venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.venue.location.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : matchingVenues;

      setRecommendations(filteredBySearch);
      setActiveFilter(null);
    } catch (error) {
      console.error("Error filtering venues:", error);
      setError("Error finding matching venues: " + error.message);
    }
  };

  // Reset form
  const resetForm = () => {
    setFilters({
      venueType: [],
      budget: [],
      capacity: [],
      city: [],
      vegOnly: false,
      nonVegOnly: false
    });
    setSearchQuery("");
    setRecommendations([]);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-xl font-semibold">Loading venues data...</div>
    </div>
  );
  
  if (error) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-xl font-semibold text-red-600">Error: {error}</div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 py-8 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 animate-bounce">
            💍 Find Your Perfect Wedding Venue 💒
          </h1>
          <p className="text-lg text-center text-pink-200 mb-4 italic">
            "A day to remember, a venue to cherish!"
          </p>
          
          {/* Search Bar */}
          
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {recommendations.length > 0 ? (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-2xl font-semibold text-gray-800">
                  {recommendations.length} Venues Found
                </h3>
                {filters.venueType.length > 0 || filters.budget.length > 0 || 
                 filters.capacity.length > 0 || filters.city.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {filters.venueType.map((type, i) => (
                      <span key={`type-${i}`} className="bg-pink-100 text-pink-800 text-sm px-3 py-1 rounded-full">
                        {type}
                      </span>
                    ))}
                    {filters.budget.map((budget, i) => (
                      <span key={`budget-${i}`} className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                        {budget}
                      </span>
                    ))}
                    {filters.capacity.map((cap, i) => (
                      <span key={`cap-${i}`} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                        {cap}
                      </span>
                    ))}
                    {filters.city.map((city, i) => (
                      <span key={`city-${i}`} className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                        {city}
                      </span>
                    ))}
                    {filters.vegOnly && (
                      <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                        Veg Only
                      </span>
                    )}
                    {filters.nonVegOnly && (
                      <span className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">
                        Non-Veg Only
                      </span>
                    )}
                  </div>
                ) : null}
              </div>
              <button
                onClick={resetForm}
                className="bg-white hover:bg-gray-100 text-pink-600 border border-pink-300 px-4 py-2 rounded-lg transition-colors flex items-center shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Refine Search
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendations.map((item, index) => (
                <div
                  key={index}
                  className="relative flex flex-col w-full max-w-[26rem] rounded-xl bg-white border shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                >
                  <div className="relative group">
                    {item.venue.coverImgSrc ? (
                      <img 
                        src={item.venue.coverImgSrc} 
                        alt={item.venue.name}
                        className="w-full h-[300px] object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-[300px] bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-lg font-medium">{item.venue.name}</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                      {item.score}% Match
                    </div>
                  </div>
                  <div className="p-6">
                    <h5 className="text-2xl font-bold text-blue-gray-900 mb-2">
                      {item.venue.name}
                    </h5>
                    <p className="flex items-center gap-1.5 text-base text-yellow-600">
                      <FaStar className="w-4 h-4" />
                      <span className="font-semibold">
                        {item.venue.averageRating || "N/A"} (
                        {item.venue.reviewCount || 0} reviews)
                      </span>
                    </p>

                    <p className="text-lg text-gray-600 mb-1 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {item.venue.location}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded">
                        Capacity: {item.venue.capacity}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {item.venue.vegPrice && (
                        <span className="bg-green-400 text-green-100 text-sm font-medium px-2.5 py-0.5 rounded">
                          Veg: ₹{item.venue.vegPrice}/plate
                        </span>
                      )}
                      {item.venue.nonVegPrice && (
                        <span className="bg-red-400 text-gray-100 text-sm font-medium px-2.5 py-0.5 rounded">
                          Non Veg: ₹{item.venue.nonVegPrice}/plate
                        </span>
                      )}
                    </div>
                    <span className="bg-gray-100 text-gray-800 text-lg font-medium px-2.5 py-0.5 rounded">
                      Rental price: {item.venue.rentPrice ? `₹${item.venue.rentPrice.toLocaleString()}` : "On Request"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Refine Your Venue Search</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Venue Type Filter */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleFilter('venueType')}
                    className={`w-full flex justify-between items-center px-4 py-3 rounded-lg border transition-colors ${
                      filters.venueType.length > 0
                        ? "bg-pink-50 border-pink-500 text-pink-700"
                        : "border-gray-300 hover:border-pink-300"
                    }`}
                  >
                    <span>Venue Type</span>
                    <div className="flex items-center">
                      {filters.venueType.length > 0 && (
                        <span className="mr-2 bg-pink-600 text-white text-xs px-2 py-1 rounded-full">
                          {filters.venueType.length}
                        </span>
                      )}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </button>
                  {activeFilter === 'venueType' && (
                    <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-xl border border-gray-200 p-3">
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {uniqueValues.venueTypes.map((option, index) => (
                          <label key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              className="rounded text-pink-600 focus:ring-pink-500"
                              checked={filters.venueType.includes(option)}
                              onChange={() => handleCheckboxChange('venueType', option)}
                            />
                            <span className="text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between">
                        <button
                          type="button"
                          onClick={() => setFilters(prev => ({...prev, venueType: []}))}
                          className="text-sm text-pink-600 hover:text-pink-800"
                        >
                          Clear All
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveFilter(null)}
                          className="text-sm bg-pink-600 text-white px-3 py-1 rounded"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Budget Filter */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleFilter('budget')}
                    className={`w-full flex justify-between items-center px-4 py-3 rounded-lg border transition-colors ${
                      filters.budget.length > 0
                        ? "bg-pink-50 border-pink-500 text-pink-700"
                        : "border-gray-300 hover:border-pink-300"
                    }`}
                  >
                    <span>Budget</span>
                    <div className="flex items-center">
                      {filters.budget.length > 0 && (
                        <span className="mr-2 bg-pink-600 text-white text-xs px-2 py-1 rounded-full">
                          {filters.budget.length}
                        </span>
                      )}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </button>
                  {activeFilter === 'budget' && (
                    <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-xl border border-gray-200 p-3">
                      <div className="space-y-2">
                        {uniqueValues.budgets.map((option, index) => (
                          <label key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              className="rounded text-pink-600 focus:ring-pink-500"
                              checked={filters.budget.includes(option)}
                              onChange={() => handleCheckboxChange('budget', option)}
                            />
                            <span className="text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between">
                        <button
                          type="button"
                          onClick={() => setFilters(prev => ({...prev, budget: []}))}
                          className="text-sm text-pink-600 hover:text-pink-800"
                        >
                          Clear All
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveFilter(null)}
                          className="text-sm bg-pink-600 text-white px-3 py-1 rounded"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Capacity Filter */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleFilter('capacity')}
                    className={`w-full flex justify-between items-center px-4 py-3 rounded-lg border transition-colors ${
                      filters.capacity.length > 0
                        ? "bg-pink-50 border-pink-500 text-pink-700"
                        : "border-gray-300 hover:border-pink-300"
                    }`}
                  >
                    <span>Capacity</span>
                    <div className="flex items-center">
                      {filters.capacity.length > 0 && (
                        <span className="mr-2 bg-pink-600 text-white text-xs px-2 py-1 rounded-full">
                          {filters.capacity.length}
                        </span>
                      )}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </button>
                  {activeFilter === 'capacity' && (
                    <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-xl border border-gray-200 p-3">
                      <div className="space-y-2">
                        {uniqueValues.capacities.map((option, index) => (
                          <label key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              className="rounded text-pink-600 focus:ring-pink-500"
                              checked={filters.capacity.includes(option)}
                              onChange={() => handleCheckboxChange('capacity', option)}
                            />
                            <span className="text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between">
                        <button
                          type="button"
                          onClick={() => setFilters(prev => ({...prev, capacity: []}))}
                          className="text-sm text-pink-600 hover:text-pink-800"
                        >
                          Clear All
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveFilter(null)}
                          className="text-sm bg-pink-600 text-white px-3 py-1 rounded"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* City Filter */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleFilter('city')}
                    className={`w-full flex justify-between items-center px-4 py-3 rounded-lg border transition-colors ${
                      filters.city.length > 0
                        ? "bg-pink-50 border-pink-500 text-pink-700"
                        : "border-gray-300 hover:border-pink-300"
                    }`}
                  >
                    <span>Location</span>
                    <div className="flex items-center">
                      {filters.city.length > 0 && (
                        <span className="mr-2 bg-pink-600 text-white text-xs px-2 py-1 rounded-full">
                          {filters.city.length}
                        </span>
                      )}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </button>
                  {activeFilter === 'city' && (
                    <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-xl border border-gray-200 p-3">
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {uniqueValues.cities.map((option, index) => (
                          <label key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              className="rounded text-pink-600 focus:ring-pink-500"
                              checked={filters.city.includes(option)}
                              onChange={() => handleCheckboxChange('city', option)}
                            />
                            <span className="text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between">
                        <button
                          type="button"
                          onClick={() => setFilters(prev => ({...prev, city: []}))}
                          className="text-sm text-pink-600 hover:text-pink-800"
                        >
                          Clear All
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveFilter(null)}
                          className="text-sm bg-pink-600 text-white px-3 py-1 rounded"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Veg/Non-Veg Filters */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="vegOnly"
                      checked={filters.vegOnly}
                      onChange={(e) => setFilters(prev => ({...prev, vegOnly: e.target.checked}))}
                      className="form-checkbox h-5 w-5 text-green-500 rounded focus:ring-green-500"
                    />
                    <span className="text-gray-700">Veg Only</span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="nonVegOnly"
                      checked={filters.nonVegOnly}
                      onChange={(e) => setFilters(prev => ({...prev, nonVegOnly: e.target.checked}))}
                      className="form-checkbox h-5 w-5 text-red-500 rounded focus:ring-red-500"
                    />
                    <span className="text-gray-700">Non-Veg Only</span>
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                  <div className="w-full sm:w-auto space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Minimum Match: <span className="font-semibold text-pink-600">{matchThreshold}%</span>
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={matchThreshold}
                      onChange={(e) => setMatchThreshold(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-600"
                    />
                  </div>
                  <button
                    type="submit"
                    className={`w-full sm:w-auto px-8 py-3 rounded-lg transition-colors flex items-center justify-center ${
                      Object.values(filters).every((arr) => arr.length === 0) && !filters.vegOnly && !filters.nonVegOnly
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg"
                    }`}
                    disabled={Object.values(filters).every((arr) => arr.length === 0) && !filters.vegOnly && !filters.nonVegOnly}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                    Find Perfect Venues
                  </button>
                </div>
              </div>
            </form>
            
            {/* Popular Searches */}
            <div className="mt-10">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Popular Searches</h3>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => {
                    setFilters({
                      venueType: ["Banquet Hall"],
                      budget: ["₹50,000 - ₹1,00,000"],
                      capacity: ["200-300"],
                      city: [],
                      vegOnly: false,
                      nonVegOnly: false
                    });
                    setMatchThreshold(70);
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm transition-colors"
                >
                  Banquet Halls under ₹1L
                </button>
                <button 
                  onClick={() => {
                    setFilters({
                      venueType: ["Resort"],
                      budget: [],
                      capacity: ["300-500"],
                      city: [],
                      vegOnly: false,
                      nonVegOnly: true
                    });
                    setMatchThreshold(60);
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm transition-colors"
                >
                  Resorts for 300-500 guests (Non-Veg)
                </button>
                <button 
                  onClick={() => {
                    setFilters({
                      venueType: ["Beachfront"],
                      budget: ["Over ₹2,00,000"],
                      capacity: [],
                      city: [],
                      vegOnly: true,
                      nonVegOnly: false
                    });
                    setMatchThreshold(80);
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm transition-colors"
                >
                  Luxury Beachfront (Veg Only)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}