import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, completed, rejected

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/booking/vendor-bookings`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setOrders(response.data.bookings);
      } else {
        setError('Failed to fetch orders');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders');
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/booking/${orderId}/status`, 
        { status: newStatus },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        toast.success(`Booking ${newStatus} successfully!`);
        fetchOrders(); // Refresh the orders list
      } else {
        toast.error('Failed to update booking status');
      }
    } catch (err) {
      console.error('Error updating order:', err);
      toast.error('Failed to update booking status');
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusActions = (order) => {
    switch (order.status) {
      case 'pending':
        return (
          <>
            <button
              onClick={() => updateOrderStatus(order._id, 'confirmed')}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Confirm Booking
            </button>
            <button
              onClick={() => updateOrderStatus(order._id, 'rejected')}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Decline
            </button>
          </>
        );
      case 'confirmed':
        return (
          <button
            onClick={() => updateOrderStatus(order._id, 'completed')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Mark as Completed
          </button>
        );
      default:
        return null;
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-center text-red-600 p-8">
      <p>{error}</p>
      <button 
        onClick={fetchOrders}
        className="mt-2 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Booking Requests</h2>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="block rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
          >
            <option value="all">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredOrders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{order.customerName}</h3>
                <p className="text-gray-600">Phone: {order.phone}</p>
                <p className="text-sm text-gray-500">
                  Event Date: {new Date(order.eventDate).toLocaleDateString('en-IN')}
                </p>
                <p className="text-sm text-gray-500">
                  Requested on: {new Date(order.createdAt).toLocaleDateString('en-IN')}
                </p>
                {order.userDetails && (
                  <p className="text-sm text-gray-500">
                    Email: {order.userDetails.email}
                  </p>
                )}
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            <div className="mt-4 border-t pt-4">
              <div className="flex flex-wrap gap-2">
                {getStatusActions(order)}
              </div>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              {filter === 'all' ? 'No booking requests found' : `No ${filter} bookings found`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorOrders;

