import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";
import VenueForm from "../Banner/Filter";

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
        setAllVenues(response.data);
        setDisplayedVenues(response.data); // Initially show all venues
        
        // Fetch reviews for all venues
        response.data.forEach(venue => {
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
    return <div className="text-center py-8">Loading venues...</div>;
  }

  return (
    <>
    <VenueForm></VenueForm>
      

      {displayedVenues.length === 0 ? (
        <div className="text-center py-8">
          No venues match your filters. Try adjusting your search criteria.
        </div>
      ) : (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8 mx-8 mb-8">
          {displayedVenues.map((venue) => (
            <div
              key={venue._id}
              onClick={() => handleVenueClick(venue._id)}
              className="relative flex flex-col w-full max-w-[26rem] rounded-xl bg-white border
                shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            >
              <div className="relative group">
                <img
                  src={venue.coverImgSrc}
                  alt={venue.name}
                  className="w-full h-[300px] object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t" />
              </div>

              <div className="p-6">
                <h5 className="text-2xl font-bold text-blue-gray-900 mb-2">
                  {venue.name}
                </h5>
                <p className="flex items-center gap-1.5 text-base text-yellow-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-semibold">
                    {reviews[venue._id]?.averageRating || "N/A"} (
                    {reviews[venue._id]?.count || 0} reviews)
                  </span>
                </p>

                <p className="text-lg text-gray-600 mb-1">{venue.location}</p>

                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    {venue.pax}
                  </span>
                  <span className="bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    {venue.guests}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="bg-green-400 text-green-100 text-sm font-medium px-2.5 py-0.5 rounded">
                    Veg: {venue.price?.veg || "NA"} /- plate
                  </span>
                  <span className="bg-red-400 text-gray-100 text-sm font-medium px-2.5 py-0.5 rounded">
                    Non Veg: {venue.price?.nonVeg || "NA"} /- plate
                  </span>
                </div>
                <span className="bg-gray-100 text-gray-800 text-lg font-medium px-2.5 py-0.5 rounded">
                  Rental price: {venue.rentPrice}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Venue;