import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();
  const [isEventMode, setIsEventMode] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative overflow-hidden">
      {/* Alert Message */}
      {showAlert && (
        <div className="fixed top-0 left-0 w-full bg-yellow-500 text-white text-center p-3 z-50">
          ⚠️ Dreamventz is evolving — features may be under construction!
          <button
            onClick={() => setShowAlert(false)}
            className="ml-4 bg-white text-yellow-700 px-3 py-1 rounded-full text-sm"
          >
            Got it
          </button>
        </div>
      )}

      {/* Hero Section */}
      <div
        className="w-full h-[90vh] relative"
        style={{
          backgroundImage: `url(${
            isEventMode
              ? "https://cdn.pixabay.com/photo/2020/01/15/17/38/fireworks-4768501_1280.jpg"
              : "https://img.freepik.com/free-vector/party-crowd-silhouettes-dancing-nightclub_1048-11557.jpg?uid=R186408456&ga=GA1.1.1454009339.1722876500&semt=ais_hybrid&w=740"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10">
         <h2 className="text-yellow-400 text-xl md:text-3xl font-semibold mb-3 drop-shadow">
  One Platform. Every Occasion.
</h2>

<h3 className="text-pink-300 text-lg md:text-2xl font-medium mb-4">
  One-Stop Event Hub — Plan, Book & Celebrate Instantly.
</h3>

<h1 className="text-white text-4xl md:text-6xl font-extrabold leading-snug">
  DreamVentz
  <br />
  <span className="text-pink-400">Make Everyday Moments Memorable</span>
</h1>

          <button
            onClick={() =>
              handleNavigate(
                isEventMode
                  ? "/best-event-planning-services"
                  : "/best-event-planner"
              )
            }
            className="mt-6 px-6 py-3 text-white bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full shadow-lg hover:scale-105 transition duration-300"
          >
            {isEventMode ? "Discover Event Services" : "Start Planning Now"}
          </button>
        </div>
      </div>

      {/* Ambassador Popup */}
      {showPopup && (
        <div className="fixed bottom-8 right-8 bg-white shadow-xl rounded-lg overflow-hidden z-50 max-w-sm">
          <img
            src="refferal1.png"
            alt="Student Ambassador"
            className="w-full h-42 object-cover"
          />
          <div className="p-4 text-center">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-800 font-semibold">
                🎓 Join the Dream Team!
              </h3>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-500 hover:text-gray-700 text-lg"
              >
                &times;
              </button>
            </div>
            <p className="text-gray-600 text-sm mt-2">
              Become a Dreamventz Ambassador. Refer events, earn up to ₹3,000, and grow your network!
            </p>
            <button
              onClick={() => handleNavigate("/studentambassador")}
              className="mt-3 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-full text-sm font-semibold transition duration-300"
            >
              Apply Now 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banner;
