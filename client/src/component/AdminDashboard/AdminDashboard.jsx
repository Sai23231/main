import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearAdminUser } from '../UserLogin/authSlice';
import { toast } from 'react-hot-toast';
import { 
  FiUsers, FiDollarSign, FiFileText, FiCheckCircle, FiXCircle, 
  FiPlus, FiEdit, FiTrash2, FiEye, FiTrendingUp, FiBarChart2,
  FiCalendar, FiMapPin, FiMail, FiPhone, FiGlobe, FiTarget, FiLogOut,
  FiClock, FiStar, FiAward, FiSettings, FiMessageSquare, FiAlertCircle
} from 'react-icons/fi';
import SponsorManagement from "./SponsorManagement";
import VendorManagement from "./VendorManagement";
import { FaUsers, FaHandshake, FaCog, FaChartBar, FaBuilding, FaClipboardList } from "react-icons/fa";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("vendors");
  const [sponsors, setSponsors] = useState([]);
  const [payments, setPayments] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSponsors: 0,
    totalPayments: 0,
    totalCommission: 0,
    pendingProposals: 0,
    totalVendors: 0,
    totalVenues: 0,
    pendingApprovals: 0,
    totalBookings: 0
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch sponsors
      const sponsorsRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/sponsor/admin/all`, {
        withCredentials: true
      });
      setSponsors(sponsorsRes.data);

      // Fetch payments
      const paymentsRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/payment/admin/details`, {
        withCredentials: true
      });
      setPayments(paymentsRes.data.payments || []);

      // Fetch proposals
      const proposalsRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/proposal/status/Pending`, {
        withCredentials: true
      });
      setProposals(proposalsRes.data);

      // Fetch vendor and venue stats
      const vendorsRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/vendors/all`, {
        withCredentials: true
      });
      
      const venuesRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/venue`, {
        withCredentials: true
      });

      // Fetch pending approvals (vendors/venues awaiting approval)
      const pendingVendors = vendorsRes.data.filter(v => v.status === 'pending');
      const pendingVenues = venuesRes.data.venues?.filter(v => v.status === 'pending') || [];

      // Fetch total bookings
      const bookingsRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/booking/admin/all`, {
        withCredentials: true
      });

      setStats({
        totalSponsors: sponsorsRes.data.length,
        totalPayments: paymentsRes.data.summary?.totalPayments || 0,
        totalCommission: paymentsRes.data.summary?.totalCommission || 0,
        pendingProposals: proposalsRes.data.length,
        totalVendors: vendorsRes.data.length,
        totalVenues: venuesRes.data.venues?.length || 0,
        pendingApprovals: pendingVendors.length + pendingVenues.length,
        totalBookings: bookingsRes.data?.length || 0
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.status === 401) {
        window.location.href = '/admin/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSponsorAction = async (sponsorId, action) => {
    try {
      if (action === 'verify') {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/sponsor/${sponsorId}/verify`, {}, {
          withCredentials: true
        });
      } else if (action === 'delete') {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/sponsor/${sponsorId}`, {
          withCredentials: true
        });
      }
      fetchDashboardData();
    } catch (error) {
      console.error('Error performing sponsor action:', error);
      toast.error('Failed to perform action');
    }
  };

  const handleProposalAction = async (proposalId, action) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/proposal/${proposalId}`, {
        status: action === 'approve' ? 'Approved' : 'Rejected'
      }, {
        withCredentials: true
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Error performing proposal action:', error);
      toast.error('Failed to perform action');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/logout`, {}, {
        withCredentials: true
      });
      dispatch(clearAdminUser());
      toast.success('Logged out successfully');
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if backend logout fails, clear local state
      dispatch(clearAdminUser());
      toast.success('Logged out successfully');
      navigate('/admin/login');
    }
  };

  const tabs = [
    {
      id: "vendors",
      name: "Vendor Management",
      icon: <FaUsers />,
      component: <VendorManagement />
    },
    {
      id: "venues",
      name: "Venue Management",
      icon: <FaBuilding />,
      component: <VenueManagement />
    },
    {
      id: "bookings",
      name: "Booking Management",
      icon: <FaClipboardList />,
      component: <BookingManagement />
    },
    {
      id: "sponsors",
      name: "Sponsor Management",
      icon: <FaHandshake />,
      component: <SponsorManagement />
    },
    {
      id: "analytics",
      name: "Analytics",
      icon: <FaChartBar />,
      component: <AnalyticsDashboard />
    },
    {
      id: "settings",
      name: "Settings",
      icon: <FaCog />,
      component: <AdminSettings />
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage vendors, venues, bookings, and platform settings</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Welcome, Admin</span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                <FiLogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaUsers className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Vendors</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalVendors}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaBuilding className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Venues</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalVenues}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FiClock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingApprovals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FaClipboardList className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {tabs.find(tab => tab.id === activeTab)?.component}
        </div>
      </div>
    </div>
  );
};

// Venue Management Component
const VenueManagement = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/venue`, {
        withCredentials: true
      });
      setVenues(response.data.venues || []);
    } catch (error) {
      console.error('Error fetching venues:', error);
      toast.error('Failed to fetch venues');
    } finally {
      setLoading(false);
    }
  };

  const handleVenueAction = async (venueId, action) => {
    try {
      if (action === 'approve') {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/venue/${venueId}/approve`, {}, {
          withCredentials: true
        });
      } else if (action === 'reject') {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/venue/${venueId}/reject`, {}, {
          withCredentials: true
        });
      }
      fetchVenues();
      toast.success(`Venue ${action}d successfully`);
    } catch (error) {
      console.error('Error performing venue action:', error);
      toast.error('Failed to perform action');
    }
  };

  const handleEditVenue = (venue) => {
    setSelectedVenue(venue);
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading venues...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Venue Management</h2>
        <div className="text-sm text-gray-600">
          Total Venues: {venues.length}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Venue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {venues.map((venue) => (
              <tr key={venue._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={venue.CoverImage || 'https://via.placeholder.com/40x40?text=V'}
                        alt={venue.name}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{venue.name}</div>
                      <div className="text-sm text-gray-500">{venue.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {venue.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    venue.status === 'approved' ? 'bg-green-100 text-green-800' :
                    venue.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {venue.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <FiStar className="w-4 h-4 text-yellow-400 mr-1" />
                    {venue.averageRating || '0.0'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditVenue(venue)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    {venue.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleVenueAction(venue._id, 'approve')}
                          className="text-green-600 hover:text-green-900"
                        >
                          <FiCheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleVenueAction(venue._id, 'reject')}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiXCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Venue Modal */}
      {showEditModal && selectedVenue && (
        <EditVenueModal
          venue={selectedVenue}
          onClose={() => setShowEditModal(false)}
          onUpdate={fetchVenues}
        />
      )}
    </div>
  );
};

// Booking Management Component
const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/booking/admin/all`, {
        withCredentials: true
      });
      setBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Booking Management</h2>
        <div className="text-sm text-gray-600">
          Total Bookings: {bookings.length}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vendor/Venue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                    <div className="text-sm text-gray-500">{booking.phone}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {booking.vendorId ? 'Vendor' : 'Venue'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(booking.eventDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900">
                    <FiEye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Analytics Dashboard Component
const AnalyticsDashboard = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
          <div className="text-3xl font-bold text-blue-600">₹2,45,000</div>
          <p className="text-sm text-gray-600 mt-2">+12% from last month</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Bookings</h3>
          <div className="text-3xl font-bold text-green-600">156</div>
          <p className="text-sm text-gray-600 mt-2">+8% from last week</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Satisfaction</h3>
          <div className="text-3xl font-bold text-yellow-600">4.8/5</div>
          <p className="text-sm text-gray-600 mt-2">Based on 1,234 reviews</p>
        </div>
      </div>
    </div>
  );
};

// Admin Settings Component
const AdminSettings = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Settings</h2>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Commission Rate (%)</label>
              <input
                type="number"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                defaultValue="15"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Auto-approval Threshold</label>
              <input
                type="number"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                defaultValue="4.5"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Support Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Support Email</label>
              <input
                type="email"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                defaultValue="support@dreamventz.in"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Support Phone</label>
              <input
                type="tel"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                defaultValue="+91-XXXXXXXXXX"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Edit Venue Modal Component
const EditVenueModal = ({ venue, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: venue.name || '',
    description: venue.description || '',
    location: venue.location || '',
    pricing: venue.pricing || {},
    contact: venue.contact || {},
    status: venue.status || 'pending'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/venue/${venue._id}/admin-update`, formData, {
        withCredentials: true
      });
      toast.success('Venue updated successfully');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating venue:', error);
      toast.error('Failed to update venue');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Venue</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 