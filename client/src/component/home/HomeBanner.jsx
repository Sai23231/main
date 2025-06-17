import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import {
  FaMicrophoneAlt, FaCamera, FaUtensils, FaPaintBrush, FaHeadphones,
  FaFileInvoice, FaBus, FaHotel, FaBoxOpen, FaStar
} from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// Categories
const categories = [
  { icon: <FaMicrophoneAlt className="text-2xl" />, label: "Stage & Sound" },
  { icon: <FaCamera className="text-2xl" />, label: "Photographer" },
  { icon: <FaUtensils className="text-2xl" />, label: "Catering" },
  { icon: <FaPaintBrush className="text-2xl" />, label: "Decoration" },
  { icon: <FaHeadphones className="text-2xl" />, label: "DJ & Music" },
  { icon: <FaFileInvoice className="text-2xl" />, label: "Invitations" },
  { icon: <FaBus className="text-2xl" />, label: "Transport" },
  { icon: <FaHotel className="text-2xl" />, label: "Accommodation" },
  { icon: <FaBoxOpen className="text-2xl" />, label: "Packages", isNew: true },
];

function VenueCard({ venue }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    if (venue._id) {
      navigate(`/wedding-venue/${venue._id}`);
      window.scrollTo(0, 0);
    } else {
      // Fallback for venues without _id (from CSV)
      navigate(`/venue-details`, { state: { venue } });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      <div className="h-48 w-full relative flex-shrink-0">
        {venue.coverImgSrc ? (
          <img
            src={venue.coverImgSrc}
            alt={venue.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-lg font-medium">{venue.name}</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-semibold shadow-sm">
          {venue.location}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg line-clamp-1">{venue.name}</h3>
          <div className="flex items-center bg-yellow-100 px-2 py-0.5 rounded">
            <FaStar className="text-yellow-500 mr-1" />
            <span className="text-sm">{venue.averageRating || "N/A"}</span>
          </div>
        </div>
        
        <div className="mt-2 flex flex-wrap gap-1">
          {venue["categories[0]"] && (
            <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full line-clamp-1">
              {venue["categories[0]"]}
            </span>
          )}
          {venue["categories[1]"] && (
            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full line-clamp-1">
              {venue["categories[1]"]}
            </span>
          )}
        </div>
        
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center">
            <span className="text-gray-500 mr-1">Capacity:</span>
            <span className="font-medium">{venue.capacity || "N/A"}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-500 mr-1">Rent:</span>
            <span className="font-medium">
              {venue.rentPrice ? `₹${venue.rentPrice.toLocaleString()}` : "On Request"}
            </span>
          </div>
          {venue.vegPrice && (
            <div className="flex items-center">
              <span className="text-gray-500 mr-1">Veg:</span>
              <span className="font-medium">₹{venue.vegPrice}/plate</span>
            </div>
          )}
          {venue.nonVegPrice && (
            <div className="flex items-center">
              <span className="text-gray-500 mr-1">Non-Veg:</span>
              <span className="font-medium">₹{venue.nonVegPrice}/plate</span>
            </div>
          )}
        </div>
        
        <button 
          onClick={handleViewDetails}
          className="mt-4 w-full bg-pink-600 hover:bg-pink-700 text-white text-sm px-4 py-2 rounded-lg"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export default function DreamventzHomepage() {
  const [venues, setVenues] = useState([]);
  const [venueRecommendations, setVenueRecommendations] = useState([]);
  const [location, setLocation] = useState("");
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load and parse CSV data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load venues data
        const venuesResponse = await fetch("/Dream_weds.venues.csv");
        const venuesCsvData = await venuesResponse.text();
        
        // Parse venues data
        Papa.parse(venuesCsvData, {
          header: true,
          complete: (results) => {
            if (!results.data || results.data.length === 0) {
              throw new Error("No venues data found in CSV");
            }

            const processedVenues = results.data.map(venue => ({
              ...venue,
              location: extractCity(venue.location),
              rentPrice: parsePrice(venue.rentPrice),
              capacity: venue["capacity.maxCapacity"] ? parseInt(venue["capacity.maxCapacity"]) : 0,
              vegPrice: venue.price?.veg ? parseInt(venue.price.veg) : null,
              nonVegPrice: venue.price?.nonVeg ? parseInt(venue.price.nonVeg) : null
            }));

            // Extract unique cities
            const uniqueCities = [...new Set(processedVenues.map(v => v.location))].filter(Boolean);

            setVenues(processedVenues);
            setVenueRecommendations(processedVenues.slice(0, 4)); // Only show 4 venues initially
            setCities(uniqueCities);
            setLoading(false);
          },
          error: (error) => {
            throw new Error(`Venues CSV parsing error: ${error.message}`);
          }
        });
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Failed to load data: " + error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to extract city from location
  const extractCity = (location) => {
    if (!location) return "";
    const parts = location.split(",");
    return parts[parts.length - 1].trim();
  };

  // Helper function to parse price
  const parsePrice = (price) => {
    if (price === "NA" || price === "On Request") return "0";
    if (typeof price === "string") {
      return price.replace(/\D/g, "") || "0";
    }
    return price;
  };

  // Filter venues based on selected location
  useEffect(() => {
    const filtered = venues.filter(
      (v) => (!location || v.location === location)
    );
    setVenueRecommendations(filtered.slice(0, 4)); // Only show 4 venues
  }, [location, venues]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-xl font-semibold">Loading data...</div>
    </div>
  );
  
  if (error) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-xl font-semibold text-red-600">Error: {error}</div>
    </div>
  );

  return (
    <div className="bg-pink-50 min-h-screen">
      {/* Location Selector - Mobile First */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="flex items-center gap-2 bg-white border border-pink-200 rounded-xl px-4 py-2 shadow-sm w-full sm:w-fit">
          <FiMapPin className="text-pink-500" />
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="text-sm focus:outline-none bg-transparent w-full sm:w-auto"
          >
            <option value="">All Locations</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid - Responsive Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
        {/* Left Panel */}
        <div className="order-2 lg:order-1">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 leading-snug">
            Event solutions at your fingertips
          </h1>
          <p className="text-base sm:text-lg text-pink-600 mb-6 sm:mb-8">
            From college fests to birthdays to farewells - plan effortlessly with verified vendors.
          </p>

          {/* Category Selector - Responsive Grid */}
          <div className="bg-white rounded-2xl shadow p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">What are you looking for?</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.label}
                  className="flex flex-col items-center justify-center bg-pink-50 p-3 sm:p-4 rounded-xl shadow hover:shadow-md hover:scale-105 transition relative"
                >
                  {cat.icon}
                  <span className="mt-2 text-xs sm:text-sm text-center font-medium line-clamp-2">
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Larger Image */}
        <div className="order-1 lg:w-[800px] flex items-center justify-center">
          <img
            src="/Homebanner.png"
            alt="Thinking about event"
            className="w-full h-auto max-h-[500px] object-contain rounded-xl "
          />
        </div>
      </main>

      {/* Venue Recommendations - Responsive Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Venues Near You</h2>
        {venueRecommendations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {venueRecommendations.map((venue, idx) => (
              <VenueCard key={idx} venue={venue} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow p-6 sm:p-8 text-center text-pink-600">
            No venues found. Try adjusting filters.
          </div>
        )}
      </section>
    </div>
  );
}