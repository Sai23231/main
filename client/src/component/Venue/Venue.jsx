import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";
import VenueForm from "../Banner/Filter";
import { FaBuilding, FaUserPlus, FaSignInAlt, FaStar, FaMapMarkerAlt, FaUsers } from "react-icons/fa";

const Venue = () => {
  const { city } = useParams();
  const [allVenues, setAllVenues] = useState([]);
  const [displayedVenues, setDisplayedVenues] = useState([]);
  const [reviews, setReviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    cities: city ? [city.charAt(0).toUpperCase() + city.slice(1)] : [],
    vegOnly: false,
    nonVegOnly: false,
    guestCapacity: null,
  });

  const navigate = useNavigate();

  // Helper function to safely render venue data
  const safeRender = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string' || typeof value === 'number') return value;
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') {
      // Handle specific object types
      if (value.seating && value.maxCapacity) {
        return `${value.seating} seating, ${value.maxCapacity} max`;
      }
      if (value.seating) return `${value.seating} seating`;
      if (value.maxCapacity) return `${value.maxCapacity} max`;
      // For other objects, try to convert to string safely
      try {
        return JSON.stringify(value);
      } catch {
        return 'N/A';
      }
    }
    return String(value);
  };

  const cityOptions = [
    { value: "Mumbai", label: "Mumbai" },
    { value: "Navi Mumbai", label: "Navi Mumbai" },
    { value: "Dombivli", label: "Dombivli" },
    { value: "Mulund", label: "Mulund" },
    { value: "Ghatkopar", label: "Ghatkopar" },
    { value: "Airoli", label: "Airoli" },
    { value: "Kalwa", label: "Kalwa" },
    { value: "Vashi", label: "Vashi" },
    { value: "Sanpada", label: "Sanpada" },
    { value: "Seawoods", label: "Seawoods" },
    { value: "Kalyan", label: "Kalyan" },
  ];

  // Fetch all venues on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/venue`);
        const venuesArray = Array.isArray(response.data.venues) ? response.data.venues : [];
        setAllVenues(venuesArray);
        setDisplayedVenues(venuesArray);
        venuesArray.forEach(venue => {
          fetchReviews(venue._id);
        });
      } catch (error) {
        console.error("Error fetching venues:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Update filters when city param changes
  useEffect(() => {
    if (city) {
      const formattedCity = city.charAt(0).toUpperCase() + city.slice(1);
      setFilters(prev => ({
        ...prev,
        cities: [formattedCity]
      }));
    }
  }, [city]);

  // Apply filters whenever filters change
  useEffect(() => {
    if (allVenues.length > 0) {
      applyFilters();
    }
  }, [filters, allVenues]);

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

      setReviews(prev => ({
        ...prev,
        [venueId]: {
          averageRating,
          count: reviewsData.length,
        },
      }));
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const applyFilters = () => {
    let filtered = [...allVenues];

    // Filter by cities
    if (filters.cities.length > 0) {
      filtered = filtered.filter(venue => 
        filters.cities.some(city => 
          venue.location.includes(city)
        )
      );
    }

    // Filter by food type
    if (filters.vegOnly) {
      filtered = filtered.filter(venue => venue.price.nonVeg === "NA");
    }
    if (filters.nonVegOnly) {
      filtered = filtered.filter(venue => venue.price.nonVeg !== "NA");
    }

    // Filter by guest capacity
    if (filters.guestCapacity) {
      filtered = filtered.filter(venue => 
        venue.guests && venue.guests.includes(filters.guestCapacity.toString())
      );
    }

    setDisplayedVenues(filtered);
  };

  const handleCityChange = (selectedOptions) => {
    setFilters(prev => ({
      ...prev,
      cities: selectedOptions ? selectedOptions.map(option => option.value) : []
    }));
  };

  const handleFoodTypeChange = (type) => {
    if (type === 'veg') {
      setFilters(prev => ({
        ...prev,
        vegOnly: !prev.vegOnly,
        nonVegOnly: false // Ensure they're mutually exclusive
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        nonVegOnly: !prev.nonVegOnly,
        vegOnly: false // Ensure they're mutually exclusive
      }));
    }
  };

  const handleCapacityChange = (e) => {
    setFilters(prev => ({
      ...prev,
      guestCapacity: e.target.value || null
    }));
  };

  const resetFilters = () => {
    setFilters({
      cities: [],
      vegOnly: false,
      nonVegOnly: false,
      guestCapacity: null,
    });
    navigate("/wedding-venues");
  };

  const handleVenueClick = (id) => {
    if (id) {
      navigate(`/wedding-venue/${id}`);
      window.scrollTo(0, 0);
    }
  };

  // Get currently selected cities for Select component
  const selectedCities = filters.cities.map(city => ({
    value: city,
    label: city
  }));

  if (loading) {
    return null; // Don't show loading, just return null
  }

  return (
    <>
      <VenueForm></VenueForm>
      
      {/* Venue Owner CTA Section */}
      

      {Array.isArray(displayedVenues) && displayedVenues.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏛️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No venues found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters.</p>
          <button
            onClick={resetFilters}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8 mx-8 mb-8">
          {Array.isArray(displayedVenues) && displayedVenues.map((venue) => (
            <div
              key={venue._id}
              onClick={() => handleVenueClick(venue._id)}
              className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100"
            >
              <div className="relative overflow-hidden">
                <img
                  src={venue.coverImgSrc || venue.CoverImage || "https://via.placeholder.com/400x300?text=Venue+Image"}
                  alt={venue.name}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Available";
                  }}
                />
                
                {/* Rating Badge */}
                <div className="absolute top-3 right-3 bg-white/95 px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <FaStar className="text-yellow-500 text-xs" />
                  <span className="text-xs font-semibold text-gray-800">
                    {reviews[venue._id]?.averageRating || "N/A"}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h5 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors line-clamp-1">
                  {venue.name}
                </h5>
                
                <div className="flex items-center gap-1.5 text-sm text-yellow-600 mb-3">
                  <FaStar className="text-yellow-500" />
                  <span className="font-medium">
                    {reviews[venue._id]?.averageRating || "N/A"} (
                    {reviews[venue._id]?.count || 0} reviews)
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 mb-3 text-sm">
                  <FaMapMarkerAlt className="text-pink-400 flex-shrink-0" />
                  <span className="line-clamp-1">{venue.location}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {venue.pax && (
                    <span className="bg-pink-50 text-pink-700 text-xs font-medium px-2 py-1 rounded-md">
                      {safeRender(venue.pax)}
                    </span>
                  )}
                  {venue.guests && (
                    <span className="bg-pink-50 text-pink-700 text-xs font-medium px-2 py-1 rounded-md">
                      {safeRender(venue.guests)} guests
                    </span>
                  )}
                  {venue.capacity && (
                    <span className="bg-pink-50 text-pink-700 text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1">
                      <FaUsers className="text-xs" />
                      {safeRender(venue.capacity)}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {venue.price?.veg && venue.price.veg !== "NA" && (
                    <span className="bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded-md">
                      Veg: ₹{venue.price.veg}/plate
                    </span>
                  )}
                  {venue.price?.nonVeg && venue.price.nonVeg !== "NA" && (
                    <span className="bg-red-50 text-red-700 text-xs font-medium px-2 py-1 rounded-md">
                      Non Veg: ₹{venue.price.nonVeg}/plate
                    </span>
                  )}
                </div>
                
                {venue.rentPrice && (
                  <div className="bg-pink-50 text-pink-700 text-base font-semibold px-3 py-2 rounded-lg mb-3">
                    Rental: ₹{venue.rentPrice}
                  </div>
                )}
                
                <div className="pt-3 border-t border-gray-100">
                  <button className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2.5 px-4 rounded-lg font-medium transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Venue;