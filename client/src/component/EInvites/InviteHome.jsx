import React, { useState } from "react";
import { Outlet, useLocation, NavLink, useNavigate } from "react-router-dom";
import Select from "react-select";
import WeddingCards from "./WeddingCards";
import VideoCards from "./VideoCards";
import SaveDateCards from "./SaveDateCards";
import FeaturedVendors from "./FeaturedVendors";

const InviteHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/wedding-invitations";
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: "",
    culture: [],
    theme: [],
  });

  const sortByOptions = [
    { value: "trending", label: "Trending" },
    { value: "newest", label: "Newest" },
  ];

  const cultureOptions = [
    { value: "hindu", label: "Hindu" },
    { value: "southIndian", label: "South Indian" },
    { value: "muslim", label: "Muslim" },
    { value: "christian", label: "Christian" },
    { value: "marathi", label: "Marathi" },
  ];

  const themeOptions = [
    { value: "traditional", label: "Traditional" },
    { value: "elegant", label: "Elegant" },
    { value: "caricature", label: "Caricature" },
    { value: "royal", label: "Royal" },
    { value: "luxury", label: "Luxury" },
  ];

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const resetFilters = () => {
    setFilters({
      sortBy: "",
      culture: [],
      theme: [],
    });
  };

  const faqs = [
    {
      question: "How to create digital wedding invitations using DreamWedz?",
      answer:
        "Creating digital invitations on DreamWedz is simple. Log in to the website, choose your favorite wedding card design, and click customize to get started!",
    },
    {
      question: "How long does it take to create a digital invitation?",
      answer:
        "With our user-friendly interface, you can create a beautiful digital invitation in just 15-20 minutes!",
    },
    {
      question: "Can I customize the colors and text?",
      answer:
        "Yes! Our platform offers complete customization of colors, fonts, text, and layout to match your wedding theme.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 py-2">
        {/* Navigation with Filter Toggle */}
        <nav className="max-w-7xl mx-auto px-4 relative border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex space-x-8">
              <NavLink
                to="/wedding-invitations/wedding-cards"
                className={({ isActive }) =>
                  `py-4 px-1 border-b-2 font-medium text-base md:text-lg transition-all duration-200 ${
                    isActive
                      ? "border-pink-500 text-pink-600"
                      : "border-transparent text-gray-500 hover:text-pink-600 hover:border-pink-500"
                  }`
                }
              >
                Wedding Cards
              </NavLink>
              <NavLink
                to="/wedding-invitations/video-cards"
                className={({ isActive }) =>
                  `py-4 px-1 border-b-2 font-medium text-base md:text-lg transition-all duration-200 ${
                    isActive
                      ? "border-pink-500 text-pink-600"
                      : "border-transparent text-gray-500 hover:text-pink-600 hover:border-pink-500"
                  }`
                }
              >
                Video Cards
              </NavLink>
              <NavLink
                to="/wedding-invitations/save-date-cards"
                className={({ isActive }) =>
                  `py-4 px-1 border-b-2 font-medium text-base md:text-lg transition-all duration-200 ${
                    isActive
                      ? "border-pink-500 text-pink-600"
                      : "border-transparent text-gray-500 hover:text-pink-600 hover:border-pink-500"
                  }`
                }
              >
                Save the date cards
              </NavLink>
            </div>
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"
              aria-label="Toggle filters"
            >
              <span className="text-sm text-gray-500">Filters</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 text-gray-500 hover:text-pink-600 transition-transform duration-200 ease-in-out ${
                  showFilters ? "transform -rotate-180 text-pink-600" : ""
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </nav>{" "}
        {/* Collapsible Filter Section */}{" "}
        <div
          className={`relative z-10 transition-all duration-200 ease-in-out ${
            showFilters
              ? "opacity-100 h-auto visible my-4"
              : "opacity-0 h-0 invisible overflow-hidden"
          }`}
        >
          <div
            className={`bg-white rounded-lg shadow-md p-6 transform transition-transform duration-200 ease-in-out ${
              showFilters ? "translate-y-0" : "-translate-y-4"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Sort By Section */}
              <div>
                <h3 className="text-lg font-medium text-pink-600 mb-4">
                  Sort By
                </h3>
                <div className="space-y-2">
                  {sortByOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="radio"
                        name="sortBy"
                        value={option.value}
                        checked={filters.sortBy === option.value}
                        onChange={(e) =>
                          handleFilterChange("sortBy", e.target.value)
                        }
                        className="w-4 h-4 form-radio text-pink-500 border-gray-300 focus:ring-pink-500 focus:ring-2 cursor-pointer checked:bg-pink-500"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Culture Section */}
              <div>
                <h3 className="text-lg font-medium text-pink-600 mb-4">
                  Culture
                </h3>
                <div className="space-y-2">
                  {cultureOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2"
                    >
                      {" "}
                      <input
                        type="checkbox"
                        value={option.value}
                        checked={filters.culture.includes(option.value)}
                        onChange={(e) => {
                          const value = e.target.value;
                          handleFilterChange(
                            "culture",
                            filters.culture.includes(value)
                              ? filters.culture.filter((v) => v !== value)
                              : [...filters.culture, value]
                          );
                        }}
                        className="w-4 h-4 form-checkbox text-pink-500 border-gray-300 rounded focus:ring-pink-500 focus:ring-2 cursor-pointer checked:bg-pink-500"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
                <button className="text-gray-600 mt-2">More</button>
              </div>

              {/* Theme Section */}
              <div>
                <h3 className="text-lg font-medium text-pink-600 mb-4">
                  Theme
                </h3>
                <div className="space-y-2">
                  {themeOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2"
                    >
                      {" "}
                      <input
                        type="checkbox"
                        value={option.value}
                        checked={filters.theme.includes(option.value)}
                        onChange={(e) => {
                          const value = e.target.value;
                          handleFilterChange(
                            "theme",
                            filters.theme.includes(value)
                              ? filters.theme.filter((v) => v !== value)
                              : [...filters.theme, value]
                          );
                        }}
                        className="w-4 h-4 form-checkbox text-pink-500 border-gray-300 rounded focus:ring-pink-500 focus:ring-2 cursor-pointer checked:bg-pink-500"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
                <button className="text-gray-600 mt-2">More</button>
              </div>
            </div>

            <div className="flex justify-between mt-6 pt-4 border-t">
              <button
                onClick={resetFilters}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
              >
                Reset
              </button>
              <button className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600">
                View Results
              </button>
            </div>
          </div>{" "}
        </div>{" "}
        {/* Main Content */}
        {isHomePage ? (
          <>
            <div className="mb-8">
              <FeaturedVendors />
            </div>
            <div className="grid grid-cols-1 gap-8 transition-all duration-200 ease-in-out">
              <WeddingCards showAll={false} filters={filters} />
              <VideoCards showAll={false} filters={filters} />
              <SaveDateCards showAll={false} filters={filters} />
            </div>
          </>
        ) : (
          <Outlet context={filters} />
        )}
        {/* Info and FAQ sections */}
        <section className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Create Digital Wedding Card Using DreamWedz
          </h2>
          <p className="text-gray-600 leading-relaxed">
            These days, wedding invitations have gotten a lot trendier than
            ever. The new trend turns out to be digital invitations for
            weddings. You can make cards online in the form of multiple or
            standalone cards and wedding invitation videos.
          </p>
        </section>
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default InviteHome;
