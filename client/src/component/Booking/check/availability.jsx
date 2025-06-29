import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectLoggedInUser } from "../../UserLogin/authSlice";
import { FiCalendar, FiPhone, FiUser, FiClock, FiCheckCircle, FiMapPin, FiMail, FiDollarSign } from "react-icons/fi";

const Availability = ({ vendorName, vendorId, venueId }) => {
  const navigate = useNavigate();
  const { vendorId: urlVendorId, venueId: urlVenueId, category: urlCategory } = useParams();
  const user = useSelector(selectLoggedInUser);

  // Use prop vendorId/venueId if provided, otherwise use URL param
  const finalVendorId = vendorId || urlVendorId || null;
  const finalVenueId = venueId || urlVenueId || null;

  const [formData, setFormData] = useState({
    customerName: user?.name || "",
    phone: user?.phoneNumber || "",
    email: user?.email || "",
    eventDate: "",
    eventType: "",
    guestCount: "",
    venue: "",
    additionalServices: "",
    budget: "",
    specialRequirements: ""
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [entityDetails, setEntityDetails] = useState(null);
  const [isVenue, setIsVenue] = useState(false);

  // Fetch vendor or venue details when component mounts
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        let response;
        if (finalVendorId) {
          // Fetch vendor details
          let vendorCategory = urlCategory;
          if (!vendorCategory) {
            // Try to fetch vendor by ID without category
            response = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/vendors/${finalVendorId}`
            );
          } else {
            response = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/vendors/${vendorCategory}/${finalVendorId}`
            );
          }
          setIsVenue(false);
        } else if (finalVenueId) {
          // Fetch venue details
          response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/venue/venueDetails/${finalVenueId}`
          );
          setIsVenue(true);
        }
        
        if (response && response.data) {
          setEntityDetails(response.data);
        }
      } catch (error) {
        console.error("Error fetching details:", error);
        toast.error("Failed to load vendor/venue details");
      }
    };
    
    if (finalVendorId || finalVenueId) {
      fetchDetails();
    }
  }, [finalVendorId, finalVenueId, urlCategory]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) {
      toast.error("Please enter your name");
      return false;
    }

    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number");
      return false;
    }

    // Validate phone number (Indian format)
    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number starting with 6-9");
      return false;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return false;
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (!formData.eventDate) {
      toast.error("Please select an event date");
      return false;
    }

    // Validate event date (should be in future)
    const selectedDate = new Date(formData.eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate <= today) {
      toast.error("Event date must be in the future");
      return false;
    }

    // Check if date is not too far in future (optional validation)
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 2); // 2 years from now
    
    if (selectedDate > maxDate) {
      toast.error("Event date cannot be more than 2 years in the future");
      return false;
    }

    if (!formData.eventType.trim()) {
      toast.error("Please select an event type");
      return false;
    }

    if (!formData.guestCount.trim()) {
      toast.error("Please enter expected guest count");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    if (!user) {
      toast.error("Please login to make a booking");
      navigate("/userlogin");
      return;
    }
    
    if (!finalVendorId && !finalVenueId) {
      toast.error("Vendor or Venue information is missing. Please try again.");
      return;
    }
    
    if (!entityDetails || !entityDetails._id) {
      toast.error("Vendor or Venue details could not be loaded. Please try again.");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setMessage("");
    
    const userId = user._id || user.id;
    if (!userId) {
      toast.error("User information is missing. Please login again.");
      setIsLoading(false);
      return;
    }

    // Prepare booking data
    const bookingData = {
      userId,
      customerName: formData.customerName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      eventDate: formData.eventDate,
      eventType: formData.eventType.trim(),
      guestCount: parseInt(formData.guestCount),
      venue: formData.venue.trim(),
      additionalServices: formData.additionalServices.trim(),
      budget: formData.budget.trim(),
      specialRequirements: formData.specialRequirements.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      // Set vendorId or venueId based on entity type
      ...(isVenue ? { venueId: entityDetails._id } : { vendorId: entityDetails._id })
    };

    console.log("Booking data being sent:", bookingData);
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/booking/create`,
        bookingData,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        toast.success("Booking request sent successfully! The vendor/venue will contact you soon.");
        setFormData({
          customerName: user?.name || "",
          phone: user?.phoneNumber || "",
          email: user?.email || "",
          eventDate: "",
          eventType: "",
          guestCount: "",
          venue: "",
          additionalServices: "",
          budget: "",
          specialRequirements: ""
        });
        setMessage("Your booking request has been sent. They will contact you within 24-48 hours.");
        
        // Redirect to user dashboard after 3 seconds
        setTimeout(() => {
          navigate("/user-dashboard");
        }, 3000);
      } else {
        setMessage(response.data.message || "Failed to create booking.");
        toast.error(response.data.message || "Failed to create booking.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      console.error("Error response data:", error.response?.data);
      const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const eventTypes = [
    "Wedding",
    "Engagement",
    "Birthday",
    "Corporate Event",
    "Anniversary",
    "Baby Shower",
    "Graduation",
    "Other"
  ];

  return (
    <div className="flex flex-col justify-center w-full p-8 pt-0 md:w-10/12 md:mx-auto lg:w-full lg:px-0 xl:px-0">
      <div className="text-2xl py-4 px-6 bg-red-700 text-white text-center font-bold uppercase">
        <FiCalendar className="inline mr-2" />
        Check Availability & Book {vendorName || (isVenue ? 'Venue' : 'Vendor')}
      </div>

      {/* Vendor/Venue Details Card */}
      {entityDetails && (
        <div className="bg-gray-50 p-4 mb-4 rounded-lg border">
          <h3 className="font-semibold text-gray-800 mb-2">
            {isVenue ? 'Venue' : 'Vendor'} Details:
          </h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Name:</strong> {entityDetails.name || entityDetails.businessName}</p>
            <p><strong>Type:</strong> {entityDetails.type || entityDetails.category}</p>
            <p><strong>Location:</strong> {entityDetails.location}</p>
            {entityDetails.pricing && (
              <p><strong>Starting Price:</strong> ₹{entityDetails.pricing.price || entityDetails.pricing}</p>
            )}
            {entityDetails.capacity && (
              <p><strong>Capacity:</strong> {entityDetails.capacity} guests</p>
            )}
          </div>
        </div>
      )}

      <form className="py-4 px-6 bg-white rounded-lg shadow-sm" onSubmit={handleSubmit}>
        {/* Customer Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Customer Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2 flex items-center" htmlFor="customerName">
                <FiUser className="mr-2" />
                Your Name *
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-red-500"
                id="customerName"
                name="customerName"
                type="text"
                placeholder="Enter your full name"
                value={formData.customerName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2 flex items-center" htmlFor="phone">
                <FiPhone className="mr-2" />
                Phone Number *
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-red-500"
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your 10-digit phone number"
                value={formData.phone}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                maxLength="10"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2 flex items-center" htmlFor="email">
                <FiMail className="mr-2" />
                Email Address *
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-red-500"
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Event Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2 flex items-center" htmlFor="eventDate">
                <FiCalendar className="mr-2" />
                Event Date *
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-red-500"
                id="eventDate"
                name="eventDate"
                type="date"
                value={formData.eventDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                max={new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              />
              {formData.eventDate && (
                <p className="text-sm text-gray-600 mt-1">
                  Selected: {formatDate(formData.eventDate)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2 flex items-center" htmlFor="eventType">
                <FiCalendar className="mr-2" />
                Event Type *
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-red-500"
                id="eventType"
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                required
              >
                <option value="">Select event type</option>
                {eventTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2 flex items-center" htmlFor="guestCount">
                <FiUser className="mr-2" />
                Expected Guest Count *
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-red-500"
                id="guestCount"
                name="guestCount"
                type="number"
                placeholder="e.g., 100"
                value={formData.guestCount}
                onChange={handleChange}
                required
                min="1"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2 flex items-center" htmlFor="budget">
                <FiDollarSign className="mr-2" />
                Budget Range
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-red-500"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
              >
                <option value="">Select budget range</option>
                <option value="Under ₹50,000">Under ₹50,000</option>
                <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                <option value="₹1,00,000 - ₹2,00,000">₹1,00,000 - ₹2,00,000</option>
                <option value="₹2,00,000 - ₹5,00,000">₹2,00,000 - ₹5,00,000</option>
                <option value="Above ₹5,00,000">Above ₹5,00,000</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 font-bold mb-2 flex items-center" htmlFor="venue">
              <FiMapPin className="mr-2" />
              Venue Location (if known)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-red-500"
              id="venue"
              name="venue"
              type="text"
              placeholder="Enter venue location or leave blank if not decided"
              value={formData.venue}
              onChange={handleChange}
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="additionalServices">
              Additional Services Required
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-red-500"
              id="additionalServices"
              name="additionalServices"
              rows="3"
              placeholder="e.g., Photography, Catering, Decoration, etc."
              value={formData.additionalServices}
              onChange={handleChange}
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="specialRequirements">
              Special Requirements
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-red-500"
              id="specialRequirements"
              name="specialRequirements"
              rows="3"
              placeholder="Any special requirements or preferences"
              value={formData.specialRequirements}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <FiCheckCircle className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">What happens next?</p>
              <ul className="space-y-1">
                <li>• Your booking request will be sent directly to {vendorName || (isVenue ? 'the venue' : 'the vendor')}</li>
                <li>• They will contact you within 24-48 hours</li>
                <li>• They will confirm availability and discuss details</li>
                <li>• You can track your booking status in your dashboard</li>
                <li>• Payment and final confirmation will be handled directly</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center mb-4">
          <button
            className={`bg-red-700 text-white py-3 px-8 rounded-lg hover:bg-red-600 focus:outline-none focus:shadow-outline transition-all duration-200 flex items-center ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
            }`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FiClock className="mr-2 animate-spin" />
                Sending Request...
              </>
            ) : (
              <>
                <FiCheckCircle className="mr-2" />
                Send Booking Request
              </>
            )}
          </button>
        </div>

        {message && (
          <div className={`text-center mt-4 p-3 rounded-lg ${
            message.includes('successfully') 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default Availability;
