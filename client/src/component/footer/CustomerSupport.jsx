import React, { useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
  FaQuestionCircle,
} from "react-icons/fa";

const CustomerSupport = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add API call here to send form data to backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
  };

  return (
    <div className="bg-gray-50 p-5 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <FaQuestionCircle className="text-pink-500" /> Customer Support
      </h2>
      {submitted ? (
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700">Thank you!</h3>
          <p className="text-gray-600">
            Your message has been sent successfully.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Your name"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Your email"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="message"
              className="block text-gray-700 font-medium mb-1"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Your message"
              rows="4"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg font-semibold transition-colors"
          >
            Send Message
          </button>
        </form>
      )}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Contact Us Directly
        </h3>
        <ul className="space-y-2">
          <li className="flex items-center gap-3">
            <FaPhoneAlt className="text-pink-500" />
            <span>+91 9876543210</span>
          </li>
          <li className="flex items-center gap-3">
            <FaEnvelope className="text-pink-500" />
            <span>support@dreamwedz.com</span>
          </li>
          <li className="flex items-center gap-3">
            <FaWhatsapp className="text-pink-500" />
            <span>+91 9876543210</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CustomerSupport;
