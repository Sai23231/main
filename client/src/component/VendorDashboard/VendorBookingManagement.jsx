import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { selectLoggedInUser } from '../UserLogin/authSlice';
import { 
  FaCalendar, FaPhone, FaUser, FaCheck, FaTimes, FaClock, 
  FaEye, FaCheckCircle, FaTimesCircle, FaSpinner 
} from 'react-icons/fa';

const VendorBookingManagement = () => {
  const user = useSelector(selectLoggedInUser);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [quotedPrice, setQuotedPrice] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/booking/vendor-bookings`,
        { withCredentials: true }
      );
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    if (!responseMessage.trim() && status === 'Rejected') {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      setActionLoading(true);
      const updateData = {
        status,
        message: responseMessage
      };

      if (status === 'Approved' && quotedPrice) {
        updateData.quotedPrice = parseFloat(quotedPrice);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/booking/${bookingId}/status`,
        updateData,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(`Booking ${status.toLowerCase()} successfully`);
        setShowModal(false);
        setSelectedBooking(null);
        setResponseMessage('');
        setQuotedPrice('');
        fetchBookings(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    } finally {
      setActionLoading(false);
    }
  };

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
    setResponseMessage('');
    setQuotedPrice('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Cancelled': return 'bg-gray-100 text-gray-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <FaSpinner className="animate-spin text-4xl text-pink-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Booking Management</h2>
        <div className="text-sm text-gray-600">
          Total Bookings: {bookings.length}
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <FaCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Bookings Yet</h3>
          <p className="text-gray-500">You haven't received any booking requests yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {booking.customerName}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <FaPhone className="mr-2" />
                    {booking.phone}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <FaCalendar className="mr-2" />
                  <span>Event Date: {formatDate(booking.eventDate)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FaClock className="mr-2" />
                  <span>Booked: {new Date(booking.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {booking.guestCount > 0 && (
                <div className="text-sm text-gray-600 mb-3">
                  <strong>Guest Count:</strong> {booking.guestCount} people
                </div>
              )}

              {booking.specialRequirements && (
                <div className="text-sm text-gray-600 mb-3">
                  <strong>Special Requirements:</strong> {booking.specialRequirements}
                </div>
              )}

              {booking.vendorResponse && booking.vendorResponse.message && (
                <div className="bg-gray-50 p-3 rounded-lg mb-3">
                  <div className="text-sm text-gray-600">
                    <strong>Your Response:</strong> {booking.vendorResponse.message}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Responded: {new Date(booking.vendorResponse.respondedAt).toLocaleString()}
                  </div>
                </div>
              )}

              {booking.status === 'Pending' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => openModal(booking)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaEye className="mr-2" />
                    Respond
                  </button>
                </div>
              )}

              {booking.status === 'Approved' && booking.quotedPrice > 0 && (
                <div className="text-sm text-green-600 font-medium">
                  Quoted Price: ₹{booking.quotedPrice.toLocaleString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Response Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Respond to Booking Request
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Customer:</strong> {selectedBooking.customerName}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Event Date:</strong> {formatDate(selectedBooking.eventDate)}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Phone:</strong> {selectedBooking.phone}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Response Message *
              </label>
              <textarea
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                rows="3"
                placeholder="Enter your response message..."
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quoted Price (₹)
              </label>
              <input
                type="number"
                value={quotedPrice}
                onChange={(e) => setQuotedPrice(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter price if approving..."
                min="0"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => handleStatusUpdate(selectedBooking._id, 'Approved')}
                disabled={actionLoading || !responseMessage.trim()}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {actionLoading ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <FaCheck className="mr-2" />
                )}
                Approve
              </button>
              
              <button
                onClick={() => handleStatusUpdate(selectedBooking._id, 'Rejected')}
                disabled={actionLoading || !responseMessage.trim()}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {actionLoading ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <FaTimes className="mr-2" />
                )}
                Reject
              </button>
            </div>

            <button
              onClick={() => {
                setShowModal(false);
                setSelectedBooking(null);
                setResponseMessage('');
                setQuotedPrice('');
              }}
              className="w-full mt-3 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorBookingManagement; 