import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Availability = ({ vendorName }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    eventDate: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/userlogin");
      return;
    }

    const data = {
      ...formData,
      vendorName,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/booking/create`,
        data,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (response.data.success) {
        toast.success("Booking created successfully!");
        navigate("/dashboard");
      } else {
        setMessage("Failed to create booking.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col justify-center w-full p-8 pt-0 md:w-10/12 md:mx-auto lg:w-full lg:px-0 xl:px-0">
      <div className="text-2xl py-4 px-6 bg-red-700 text-white text-center font-bold uppercase">
        Check Availability/Price
      </div>

      <form className="py-4 px-6" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="customerName"
          >
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="customerName"
            name="customerName"
            type="text"
            placeholder="Enter your name"
            value={formData.customerName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="phone">
            Phone Number
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="phone"
            name="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
            required
            pattern="[0-9]{10}"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="eventDate"
          >
            Event Date
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="eventDate"
            name="eventDate"
            type="date"
            value={formData.eventDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-center justify-center mb-4">
          <button
            className="bg-red-700 text-white py-2 px-4 rounded hover:bg-red-500 focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit
          </button>
        </div>

        {message && (
          <div className="text-center mt-4 text-red-700">{message}</div>
        )}
      </form>
    </div>
  );
};

export default Availability;
