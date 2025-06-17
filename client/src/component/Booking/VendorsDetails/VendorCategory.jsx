import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, NavLink } from "react-router-dom";

const VendorCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/vendors/${category}`
        );
        setVendors(response.data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    fetchVendors();
  }, [category]);

  const handleNavigation = (id) => {
    navigate(`/vendors/${category}/${id}`);
  };

  return (
    <div className="mx-8 md:mx-16 my-8">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6" aria-label="Breadcrumb">
        <ol className="flex space-x-2 text-gray-600 text-sm">
          <li>
            <NavLink to="/" className="hover:text-blue-600">
              Home
            </NavLink>
          </li>
          <li>/</li>
          <li>
            <NavLink to="/vendors" className="hover:text-blue-600">
              Vendors
            </NavLink>
          </li>
          <li>/</li>
          <li className="text-gray-800">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </li>
        </ol>
      </nav>

      {/* Page Title */}
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Top {category.charAt(0).toUpperCase() + category.slice(1)} in Your Area
      </h1>
      <p className="text-gray-500 text-lg mb-8">
        Explore curated professionals to make your event unforgettable.
      </p>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {vendors.map((vendor, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => handleNavigation(vendor._id)}
          >
            {/* Image Section */}
            <div className="relative">
              <img
                className="w-full h-56 object-cover transform hover:scale-105 transition-transform duration-500"
                src={vendor.CoverImage}
                alt={vendor.name}
              />
              {/* Rating Badge */}
              <span className="absolute top-4 right-4 bg-green-600 text-white px-2 py-1 text-sm font-semibold rounded-full shadow-sm">
                {vendor.rating} ★
              </span>
            </div>

            {/* Details Section */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 hover:text-pink-500 transition">
                {vendor.name}
              </h2>
              <p className="text-gray-600 mt-2">
                Starting Price:{" "}
                <span className="text-pink-600 font-bold">
                  &#x20b9; {vendor.pricing.price}
                </span>
              </p>
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <span>{vendor.rating} ★</span>
                <span className="mx-2">•</span>
                <span>{vendor.reviews} Reviews</span>
              </div>
              <p className="text-sm text-gray-600 italic mt-4">
                {vendor.description}
              </p>
            </div>

            {/* CTA Section */}
            <div className="p-4 bg-gray-50 border-t text-center">
              <button
                className="w-full py-2 text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg hover:opacity-90 transition"
                onClick={() => handleNavigation(vendor._id)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorCategory;
