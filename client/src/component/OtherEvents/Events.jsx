import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AssociatedEvents = () => {
  const [step, setStep] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  // const navigate = useNavigate();

  //useEffect(() => {
  //const userSignedIn = localStorage.getItem("token");
  //if (!userSignedIn) {
  //navigate("/userlogin");
  //}
  // }, [navigate]);

  const events = [
    {
      id: 1,
      name: "Birthday Bash 🎂",
      description: "Celebrate another year with joy and laughter!",
      image:
        "https://img.freepik.com/free-photo/portrait-happy-multiethnic-family-celebrating-birthday-home_155003-21237.jpg",
      type: "personal",
    },
    {
      id: 2,
      name: "Anniversary Elegance 💍",
      description: "Cherish the love story that continues to shine.",
      image:
        "https://img.freepik.com/free-vector/watercolor-floral-wedding-anniversary-frame_1340-6603.jpg",
      type: "personal",
    },
    {
      id: 3,
      name: "Corporate Event 💼",
      description: "Professional, sophisticated, and seamless events.",
      image: "corporate.jpg",
      type: "corporate",
    },
    {
      id: 4,
      name: "Baby Shower Bliss 🍼",
      description: "A magical welcome for the little one!",
      image: "https://images.pexels.com/photos/235243/pexels-photo-235243.jpeg",
      type: "personal",
    },
    {
      id: 5,
      name: "Themed Party Night 🎭",
      description: "From Bollywood nights to Masquerades – Let's Party!",
      image:
        "https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg",
      type: "personal",
    },
    {
      id: 6,
      name: "Customized Event ✨",
      description: "A one-of-a-kind event designed just for you!",
      image: "",
      type: "custom",
    },
  ];

  const upcomingEvents = [
    {
      id: 8,
      name: "StartUp Grind",
      date: "April 15, 2025",
      description:
        "An exclusive high-class evening celebrating excellence and resilience.",
      image: "Startup1.png",
      link: "/startup-grind",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-red-50 to-pink-100 relative overflow-hidden">
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Header Section */}
      <div className="relative z-10 py-12 text-center bg-gradient-to-r from-pink-600 to-pink-300 text-white">
        <h1 className="text-5xl font-extrabold">Plan a Memorable Event 🎊</h1>
        <p className="mt-3 text-lg">Your perfect celebration starts here.</p>
      </div>

      {/* 🔹 Upcoming Events Section */}
      <section className="max-w-6xl mx-auto mt-12 px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          ✨ Upcoming Events ✨
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Don't miss out on these exciting experiences!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingEvents.map((event) => (
            <motion.div
              key={event.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-transform transform hover:scale-105 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-5">
                <h3 className="text-2xl font-bold text-gray-800">
                  {event.name}
                </h3>
                <p className="text-gray-600 mt-1">{event.date}</p>
                <p className="text-gray-700 mt-2">{event.description}</p>
                <a href={event.link}>
                  <button className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg">
                    Learn More
                  </button>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🔹 Event Selection Section */}
      <div className="max-w-6xl mx-auto mt-12 mb-6 text-center relative z-10">
        <h2 className="text-3xl font-semibold text-gray-700">
          Select an Event to Begin
        </h2>
        <p className="text-gray-500">We’ll guide you through each step!</p>

        <div className="flex justify-center gap-4 mt-4">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-2 border rounded-lg focus:ring focus:ring-red-200"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring focus:ring-red-200"
          >
            <option value="all">All</option>
            <option value="personal">Personal</option>
            <option value="corporate">Corporate</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {/* Event Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {events.map((event) => (
            <motion.div
              key={event.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-transform transform hover:scale-105 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="text-2xl font-bold text-gray-800">
                  {event.name}
                </h3>
                <p className="text-gray-600 mt-2">{event.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssociatedEvents;
