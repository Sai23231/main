import React, { useState, useEffect } from "react";
import axios from "axios";

const BookingForm = ({ packageName, onBookingComplete }) => {
  useEffect(() => {
    console.log("Received package name:", packageName); // Debugging line
  }, [packageName]);

  const [formData, setFormData] = useState({
    date: "",
    guests: "",
    packageName: packageName || "",
    additionalRequests: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Retrieve the API URL from the environment variable
    const apiUrl = import.meta.env.VITE_BACKEND_URL;

    try {
      const response = await axios.post(`${apiUrl}/packages`, formData); // Use the new endpoint
      alert(`Booking for ${formData.packageName} is confirmed!`);
      onBookingComplete();
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("There was an error submitting your booking. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center text-pink-600 mb-8">
        Wedding Package Booking {packageName}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow-md rounded-lg max-w-lg mx-auto"
      >
        <div className="mb-4">
          <label htmlFor="date" className="block text-gray-700 font-bold mb-2">
            Wedding Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full border rounded py-2 px-3"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="guests"
            className="block text-gray-700 font-bold mb-2"
          >
            Number of Guests
          </label>
          <input
            type="number"
            id="guests"
            name="guests"
            value={formData.guests}
            onChange={handleInputChange}
            className="w-full border rounded py-2 px-3"
            placeholder="Enter number of guests"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="additionalRequests"
            className="block text-gray-700 font-bold mb-2"
          >
            Additional Requests
          </label>
          <textarea
            id="additionalRequests"
            name="additionalRequests"
            value={formData.additionalRequests}
            onChange={handleInputChange}
            className="w-full border rounded py-2 px-3"
            placeholder="Enter any special requests"
          />
        </div>
        <button
          type="submit"
          className="block bg-pink-600 text-white font-bold py-2 px-4 rounded-full text-center hover:bg-pink-700 transition duration-200 w-full sm:w-auto"
        >
          Submit Booking
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
