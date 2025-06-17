import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { setLoggedInUser } from "../UserLogin/authSlice";

const VendorRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    password: "",
    confirmPassword: "",
    businessType: "",
  });

  const navigate = useNavigate(); // Initialize useNavigate for navigation
  const dispatch = useDispatch();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/vendor/register`,
        formData, { withCredentials: true }
      );
      const data = response.data;

      if (data.success) {
        toast.success(data.message);
        dispatch(setLoggedInUser(data.newVendor));
        // localStorage.setItem("token", data.token);
        // localStorage.setItem("email", data.newVendor.email);
        navigate("/admin/dashboard");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-6 mb-4">
      <div className="w-full max-w-md bg-white shadow-md mt-8 rounded-lg p-10">
        <div className="text-center">
          <img
            src="https://www.svgrepo.com/show/301692/login.svg"
            alt="Workflow"
            className="mx-auto h-12 w-12"
          />
          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            List Your Business on DreamWedz
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/vendorlogin" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              placeholder="+91 XXXXX XXXXX"
              value={formData.phone}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700"
            >
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              placeholder="Your City"
              value={formData.city}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label
              htmlFor="businessType"
              className="block text-sm font-medium text-gray-700"
            >
              Business Type
            </label>
            <select
              id="businessType"
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border rounded-md bg-gray-100 focus:border-blue-500 focus:ring focus:ring-blue-200"
            >
              <option value="">Select Business Type</option>
              <option>Venues</option>
              <option>Photographer</option>
              <option>Catering</option>
              <option>Decorators</option>
              <option>Makeup</option>
              <option>Mehndi</option>
              <option>Bands</option>
              <option>DJs</option>
              <option>Music/Dance Artist</option>
              <option>Fashion Wear</option>
              <option>Others</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 transition"
          >
            Register Business
          </button>
        </form>
      </div>
    </div>
  );
};

export default VendorRegistration;
