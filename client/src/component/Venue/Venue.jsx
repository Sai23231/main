import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";
const Venue = () => {
  const { city } = useParams();
  const [venues, setVenues] = useState([]);
  const [reviews, setReviews] = useState({});
  const [filters, setFilters] = useState({
    city: city
      ? [
          {
            value: city.charAt(0).toUpperCase() + city.slice(1),
            label: city.charAt(0).toUpperCase() + city.slice(1),
          },
        ]
      : [],
    vegOnly: false,
    nonVegOnly: false,
    guestCapacity: "",
  });

  useEffect(() => {
    if (city) {
      setFilters((prev) => ({
        ...prev,
        city: [
          {
            value: city.charAt(0).toUpperCase() + city.slice(1),
            label: city.charAt(0).toUpperCase() + city.slice(1),
          },
        ],
      }));
    }
  }, [city]);

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

  const fetchVenues = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/venue`
      );
      setVenues(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  };

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

      setReviews((prev) => ({
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

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      city: [],
      vegOnly: false,
      nonVegOnly: false,
      guestCapacity: "",
    });
    navigate("/wedding-venues"); // Reset the URL to show all venues
  };

  const filteredVenues = venues.filter((venue) => {
    const matchesCity =
      !filters.city.length ||
      filters.city.some((c) => venue.location.includes(c.value));
    const matchesVeg = !filters.vegOnly || venue.price.nonVeg === "NA";
    const matchesNonVeg = !filters.nonVegOnly || venue.price.nonVeg !== "NA";
    const matchesCapacity =
      !filters.guestCapacity || venue.guests.includes(filters.guestCapacity);

    return matchesCity && matchesVeg && matchesNonVeg && matchesCapacity;
  });

  useEffect(() => {
    const fetcher = async () => {
      const venuesArray = await fetchVenues();
      venuesArray.forEach((venue) => fetchReviews(venue._id));
    };
    fetcher();
  }, []);

  const handleVenueClick = (id) => {
    if (id) {
      navigate(`/wedding-venue/${id}`);
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <h1 className="font-serif text-4xl mt-4 mx-auto text-center mb-8 animate-bounce">
        💍 Find Your Perfect Wedding Venue 💒
      </h1>

      <p className="text-lg text-center text-pink-500 mb-6 italic">
        “A day to remember, a venue to cherish!”
      </p>

      <div className="flex flex-wrap justify-center gap-4 mb-6 p-4 md:gap-3 md:justify-center">
        <Select
          isMulti
          options={cityOptions}
          value={filters.city}
          onChange={(selected) => handleFilterChange("city", selected)}
          placeholder="Select Cities"
          className="w-full sm:w-60 md:w-72"
        />

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="vegOnly"
              checked={filters.vegOnly}
              onChange={(e) => handleFilterChange("vegOnly", e.target.checked)}
              className="form-checkbox text-pink-500"
            />
            Veg Only
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="nonVegOnly"
              checked={filters.nonVegOnly}
              onChange={(e) =>
                handleFilterChange("nonVegOnly", e.target.checked)
              }
              className="form-checkbox text-pink-500"
            />
            Non-Veg Only
          </label>
        </div>

        <select
          name="guestCapacity"
          value={filters.guestCapacity}
          onChange={(e) => handleFilterChange("guestCapacity", e.target.value)}
          className="w-full sm:w-auto border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-pink-200"
        >
          <option value="">Select Guest Capacity</option>
          <option value="300">300</option>
          <option value="500">500</option>
          <option value="700">700</option>
        </select>

        <button
          onClick={resetFilters}
          className="w-full sm:w-auto bg-gray-500 text-white px-4 py-2 rounded shadow hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300"
        >
          Reset Filters
        </button>
      </div>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8 mx-8 mb-8">
        {filteredVenues.map((venue, index) => (
          <div
            key={index}
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
                  Veg: {venue.price.veg} /- plate
                </span>
                <span className="bg-red-400 text-gray-100 text-sm font-medium px-2.5 py-0.5 rounded">
                  Non Veg: {venue.price.nonVeg} /- plate
                </span>
              </div>
              <span className="bg-gray-100 text-gray-800 text-lg font-medium px-2.5 py-0.5 rounded">
                Rental price: {venue.rentPrice}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Venue;
