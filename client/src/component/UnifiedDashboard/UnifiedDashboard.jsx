import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { setLoggedInUser } from '../UserLogin/authSlice';
import { 
  FaUser, FaEdit, FaCalendar, FaBookmark, FaSignOutAlt, 
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaStar, FaEye,
  FaCheck, FaTimes, FaClock, FaMoneyBillWave, FaSave,
  FaImage, FaGlobe, FaInstagram, FaFacebook, FaTwitter,
  FaSpinner, FaPlus, FaTrash, FaImages, FaBuilding,
  FaLock, FaUnlock, FaShieldAlt, FaCreditCard, FaCalendarAlt
} from 'react-icons/fa';

const UnifiedDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [pendingChanges, setPendingChanges] = useState(null);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loggedInUser = useSelector(state => state.auth.loggedInUser);

  // Function to ensure user data has all required fields
  const ensureUserData = (user) => {
    if (!user) return null;
    
    const isVenue = user.type === 'venue' || user.role === 'venue';
    
    return {
      id: user.id || user._id,
      name: user.name || (isVenue ? 'Venue Name' : 'Vendor Name'),
      email: user.email || '',
      type: user.type || user.role || 'vendor',
      location: user.location || 'Location not specified',
      status: user.status || 'pending',
      description: user.description || 'No description available',
      CoverImage: user.CoverImage || '',
      rating: user.rating || '0.0',
      reviews: user.reviews || 0,
      averageRating: user.averageRating || 0,
      capacity: user.capacity || 0,
      pricing: user.pricing || { package: 'Standard Package', price: 'Contact for pricing' },
      contact: user.contact || { phone: '', email: user.email || '', website: '' },
      photos: user.photos || [],
      services: user.services || [],
      amenities: user.amenities || [],
      businessDetails: user.businessDetails || {},
      businessHours: user.businessHours || {},
      socialMedia: user.socialMedia || {},
      bankInfo: user.bankInfo || {},
      availability: user.availability || {},
      performanceBadge: user.performanceBadge || null,
      submittedAt: user.submittedAt,
      approvedAt: user.approvedAt,
      role: user.role || (isVenue ? 'venue' : 'vendor')
    };
  };

  useEffect(() => {
    // Check if user is authenticated
    if (!loggedInUser || (loggedInUser.role !== 'vendor' && loggedInUser.role !== 'venue')) {
      navigate('/vendorlogin');
      return;
    }
    
    // If we have user data from login, use it initially
    if (loggedInUser) {
      const validatedUser = ensureUserData(loggedInUser);
      setUserData(validatedUser);
      setEditForm(validatedUser);
      setIsLoading(false);
    }
    
    // Then fetch fresh data from server
    fetchUserData();
    fetchBookings();
  }, [loggedInUser, navigate]);

  const fetchUserData = async () => {
    try {
      const endpoint = loggedInUser?.type === 'venue' || loggedInUser?.role === 'venue'
        ? '/venue/profile'
        : '/vendors/profile';
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}${endpoint}`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        const validatedUser = ensureUserData(response.data.vendor || response.data.venue);
        setUserData(validatedUser);
        setEditForm(validatedUser);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // If API fails but we have login data, use that
      if (loggedInUser) {
        const validatedUser = ensureUserData(loggedInUser);
        setUserData(validatedUser);
        setEditForm(validatedUser);
        toast.error('Using cached data. Some features may be limited.');
      } else {
        toast.error('Failed to load user data');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const endpoint = loggedInUser?.type === 'venue' || loggedInUser?.role === 'venue'
        ? '/booking/venue'
        : '/booking/vendor';
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}${endpoint}`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setBookings(response.data.data || response.data.bookings || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Don't show error toast as bookings might not exist yet
    }
  };

  const handleBookingAction = async (bookingId, status) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/booking/${bookingId}/status`,
        { status },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        toast.success(`Booking ${status} successfully`);
        fetchBookings(); // Refresh bookings list
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };

  const getBookingStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      rejected: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      weekday: 'short'
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Not specified';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handleLogout = async () => {
    try {
      const endpoint = loggedInUser?.type === 'venue' || loggedInUser?.role === 'venue'
        ? '/venue/logout'
        : '/vendor/logout';
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}${endpoint}`,
        {},
        { withCredentials: true }
      );
      
      dispatch(setLoggedInUser(null));
      navigate('/vendorlogin');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      dispatch(setLoggedInUser(null));
      navigate('/vendorlogin');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const endpoint = loggedInUser?.type === 'venue' || loggedInUser?.role === 'venue'
        ? '/venue/profile'
        : '/vendors/profile';
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}${endpoint}`,
        editForm,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setUserData(response.data.vendor || response.data.venue);
        setEditForm(response.data.vendor || response.data.venue);
        setIsEditing(false);
        toast.success('Profile updated successfully');
        
        // Update Redux state to reflect changes
        dispatch(setLoggedInUser(response.data.vendor || response.data.venue));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setEditForm(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const endpoint = loggedInUser?.type === 'venue' || loggedInUser?.role === 'venue'
        ? '/venue/upload-image'
        : '/vendors/upload-image';
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}${endpoint}`,
        formData,
        { 
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      if (response.data.success) {
        setEditForm(prev => ({
          ...prev,
          CoverImage: response.data.imageUrl
        }));
        setUserData(prev => ({
          ...prev,
          CoverImage: response.data.imageUrl
        }));
        toast.success('Image uploaded successfully (pending moderation)');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePortfolioUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingPortfolio(true);
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append('images', file);
    });

    try {
      const endpoint = loggedInUser?.type === 'venue' || loggedInUser?.role === 'venue'
        ? '/venue/upload-portfolio'
        : '/vendors/upload-portfolio';
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}${endpoint}`,
        formData,
        { 
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      if (response.data.success) {
        const updatedPhotos = [...(editForm.photos || []), ...response.data.imageUrls];
        setEditForm(prev => ({
          ...prev,
          photos: updatedPhotos
        }));
        setUserData(prev => ({
          ...prev,
          photos: updatedPhotos
        }));
        toast.success(`${files.length} image(s) uploaded (pending moderation)`);
      }
    } catch (error) {
      console.error('Error uploading portfolio images:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploadingPortfolio(false);
    }
  };

  const handleRemovePortfolioImage = async (imageUrl, index) => {
    try {
      const endpoint = loggedInUser?.type === 'venue' || loggedInUser?.role === 'venue'
        ? '/venue/remove-portfolio-image'
        : '/vendors/remove-portfolio-image';
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}${endpoint}`,
        {
          data: { imageUrl },
          withCredentials: true
        }
      );

      if (response.data.success) {
        const updatedPhotos = editForm.photos.filter((_, i) => i !== index);
        setEditForm(prev => ({
          ...prev,
          photos: updatedPhotos
        }));
        setUserData(prev => ({
          ...prev,
          photos: updatedPhotos
        }));
        toast.success('Image removed successfully');
      }
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove image');
    }
  };

  // Handle sensitive information updates with OTP
  const handleSensitiveInfoUpdate = (field, value) => {
    setPendingChanges({ field, value });
    setShowOTPModal(true);
  };

  const handleOTPSubmit = async () => {
    if (!otpCode || otpCode.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      // Verify OTP and update sensitive information
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/verify-otp`,
        {
          otp: otpCode,
          field: pendingChanges.field,
          value: pendingChanges.value
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setEditForm(prev => ({
          ...prev,
          [pendingChanges.field]: pendingChanges.value
        }));
        setShowOTPModal(false);
        setOtpCode('');
        setPendingChanges(null);
        toast.success('Information updated successfully');
      }
    } catch (error) {
      toast.error('Invalid OTP or update failed');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getPerformanceBadge = (badge) => {
    if (!badge) return null;
    
    const badges = {
      elite: { color: 'bg-purple-100 text-purple-800', icon: '👑' },
      premium: { color: 'bg-gold-100 text-gold-800', icon: '⭐' },
      verified: { color: 'bg-green-100 text-green-800', icon: '✓' }
    };
    
    const badgeInfo = badges[badge.toLowerCase()] || badges.verified;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badgeInfo.color}`}>
        <span className="mr-1">{badgeInfo.icon}</span>
        {badge}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-pink-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-6">Unable to load user data. Please try again.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  const isVenue = userData.type === 'venue' || userData.role === 'venue';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {isVenue ? 'Venue' : 'Vendor'} Dashboard
              </h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(userData.status)}`}>
                {userData.status}
              </span>
              {getPerformanceBadge(userData.performanceBadge)}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                  {userData.CoverImage ? (
                    <img 
                      src={userData.CoverImage} 
                      alt={userData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      {isVenue ? <FaBuilding className="text-3xl" /> : <FaUser className="text-3xl" />}
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900">{userData.name}</h2>
                <p className="text-gray-600">{isVenue ? 'Venue' : userData.type}</p>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'overview' 
                      ? 'bg-pink-100 text-pink-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaUser className="mr-3" />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'profile' 
                      ? 'bg-pink-100 text-pink-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaEdit className="mr-3" />
                  Edit Profile
                </button>
                <button
                  onClick={() => setActiveTab('portfolio')}
                  className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'portfolio' 
                      ? 'bg-pink-100 text-pink-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaImages className="mr-3" />
                  Portfolio ({userData?.photos?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('availability')}
                  className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'availability' 
                      ? 'bg-pink-100 text-pink-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaCalendarAlt className="mr-3" />
                  Availability
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'bookings' 
                      ? 'bg-pink-100 text-pink-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaCalendar className="mr-3" />
                  Bookings ({bookings.length})
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'reviews' 
                      ? 'bg-pink-100 text-pink-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaStar className="mr-3" />
                  Reviews ({userData.reviews})
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <FaCalendar className="text-blue-600 text-2xl mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Total Bookings</p>
                        <p className="text-2xl font-bold text-blue-900">{bookings.length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <FaStar className="text-green-600 text-2xl mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Average Rating</p>
                        <p className="text-2xl font-bold text-green-900">{userData.averageRating}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <FaEye className="text-purple-600 text-2xl mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Profile Views</p>
                        <p className="text-2xl font-bold text-purple-900">{userData.reviews}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map((booking, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Booking #{booking._id?.slice(-6)}</p>
                          <p className="text-sm text-gray-600">{booking.status}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      isEditing 
                        ? 'bg-gray-600 text-white hover:bg-gray-700' 
                        : 'bg-pink-600 text-white hover:bg-pink-700'
                    }`}
                  >
                    {isEditing ? <FaTimes className="mr-2" /> : <FaEdit className="mr-2" />}
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                {isEditing ? (
                  <form onSubmit={handleEditSubmit} className="space-y-6">
                    {/* Basic Information - Editable */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {isVenue ? 'Venue' : 'Business'} Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={editForm.name || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                          <input
                            type="text"
                            name="location"
                            value={editForm.location || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                            required
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                          <textarea
                            name="description"
                            value={editForm.description || ''}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contact Information - Editable with OTP */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                          <div className="flex">
                            <input
                              type="tel"
                              value={editForm.contact?.phone || ''}
                              onChange={(e) => handleNestedChange('contact', 'phone', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => handleSensitiveInfoUpdate('contact.phone', editForm.contact?.phone)}
                              className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                            >
                              <FaShieldAlt className="text-sm" />
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                          <input
                            type="url"
                            value={editForm.contact?.website || ''}
                            onChange={(e) => handleNestedChange('contact', 'website', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Services - Read Only (Admin Controlled) */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Services</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <FaLock className="text-gray-500 mr-2" />
                          <span className="text-sm text-gray-600">Admin-controlled services</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(userData.services || []).map((service, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Pricing - Read Only (System-based) */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <FaMoneyBillWave className="text-gray-500 mr-2" />
                          <span className="text-sm text-gray-600">System-based pricing</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Package</p>
                            <p className="font-medium">{userData.pricing?.package || 'Standard Package'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Price</p>
                            <p className="font-medium">{userData.pricing?.price || 'Contact for pricing'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bank Information - Editable with OTP */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Bank Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                          <div className="flex">
                            <input
                              type="text"
                              value={editForm.bankInfo?.accountNumber || ''}
                              onChange={(e) => handleNestedChange('bankInfo', 'accountNumber', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                            <button
                              type="button"
                              onClick={() => handleSensitiveInfoUpdate('bankInfo.accountNumber', editForm.bankInfo?.accountNumber)}
                              className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                            >
                              <FaShieldAlt className="text-sm" />
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
                          <div className="flex">
                            <input
                              type="text"
                              value={editForm.bankInfo?.ifscCode || ''}
                              onChange={(e) => handleNestedChange('bankInfo', 'ifscCode', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                            <button
                              type="button"
                              onClick={() => handleSensitiveInfoUpdate('bankInfo.ifscCode', editForm.bankInfo?.ifscCode)}
                              className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                            >
                              <FaShieldAlt className="text-sm" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50"
                      >
                        {isLoading ? <FaSpinner className="animate-spin" /> : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    {/* Display current profile information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">{isVenue ? 'Venue' : 'Business'} Name</p>
                          <p className="font-medium">{userData.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Location</p>
                          <p className="font-medium">{userData.location}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-600">Description</p>
                          <p className="font-medium">{userData.description}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium">{userData.contact?.phone || 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Website</p>
                          <p className="font-medium">{userData.contact?.website || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Portfolio Management</h2>
                
                {/* Cover Image */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Cover Image</h3>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-200">
                      {userData.CoverImage ? (
                        <img 
                          src={userData.CoverImage} 
                          alt="Cover"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <FaImage className="text-2xl" />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Cover Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                      />
                      {uploadingImage && (
                        <div className="flex items-center mt-2">
                          <FaSpinner className="animate-spin text-pink-600 mr-2" />
                          <span className="text-sm text-gray-600">Uploading...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Portfolio Images */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Portfolio Images</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Portfolio Images
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePortfolioUpload}
                      disabled={uploadingPortfolio}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                    />
                    {uploadingPortfolio && (
                      <div className="flex items-center mt-2">
                        <FaSpinner className="animate-spin text-pink-600 mr-2" />
                        <span className="text-sm text-gray-600">Uploading...</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {(userData.photos || []).map((photo, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={photo} 
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => handleRemovePortfolioImage(photo, index)}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Availability Tab */}
            {activeTab === 'availability' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Availability Calendar</h2>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-4">
                    <FaCalendarAlt className="text-blue-600 text-xl mr-3" />
                    <h3 className="text-lg font-medium text-blue-900">Manage Your Schedule</h3>
                  </div>
                  <p className="text-blue-800 mb-4">
                    Set your availability for bookings. This helps customers know when you're available.
                  </p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Configure Availability
                  </button>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Bookings Management</h2>
                  <div className="text-sm text-gray-600">
                    Total Bookings: {bookings.length}
                  </div>
                </div>

                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <FaCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Bookings Yet</h3>
                    <p className="text-gray-500">When customers book your services, they will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking, index) => (
                      <div key={booking._id || index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                Booking #{booking._id?.slice(-6) || `BK${index + 1}`}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBookingStatusColor(booking.status)}`}>
                                {booking.status}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600 font-medium">Customer</p>
                                <p className="text-gray-900">{booking.customerName}</p>
                                <p className="text-gray-500">{booking.phone}</p>
                                {booking.email && <p className="text-gray-500">{booking.email}</p>}
                              </div>
                              
                              <div>
                                <p className="text-gray-600 font-medium">Event Details</p>
                                <p className="text-gray-900">{booking.eventType}</p>
                                <p className="text-gray-500">{formatDate(booking.eventDate)}</p>
                                {booking.guestCount && <p className="text-gray-500">{booking.guestCount} guests</p>}
                              </div>
                              
                              <div>
                                <p className="text-gray-600 font-medium">Location & Budget</p>
                                <p className="text-gray-900">{booking.venue || 'Not specified'}</p>
                                {booking.budget && <p className="text-gray-500">{booking.budget}</p>}
                              </div>
                            </div>

                            {/* Additional Services */}
                            {booking.additionalServices && (
                              <div className="mt-3">
                                <p className="text-gray-600 font-medium text-sm">Additional Services:</p>
                                <p className="text-gray-700 text-sm">{booking.additionalServices}</p>
                              </div>
                            )}

                            {/* Special Requirements */}
                            {booking.specialRequirements && (
                              <div className="mt-3">
                                <p className="text-gray-600 font-medium text-sm">Special Requirements:</p>
                                <p className="text-gray-700 text-sm">{booking.specialRequirements}</p>
                              </div>
                            )}

                            {/* Booking Date */}
                            <div className="mt-3 text-xs text-gray-500">
                              Booked on: {formatDate(booking.createdAt)}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                          {booking.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleBookingAction(booking._id, 'confirmed')}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                              >
                                <FaCheck className="inline mr-1" />
                                Accept Booking
                              </button>
                              <button
                                onClick={() => handleBookingAction(booking._id, 'rejected')}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                              >
                                <FaTimes className="inline mr-1" />
                                Reject Booking
                              </button>
                            </>
                          )}
                          
                          {booking.status === 'confirmed' && (
                            <button
                              onClick={() => handleBookingAction(booking._id, 'completed')}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                              <FaCheck className="inline mr-1" />
                              Mark Completed
                            </button>
                          )}

                          {/* Contact Customer Button */}
                          <button
                            onClick={() => {
                              // You can implement a contact modal or redirect to messaging
                              toast.info('Contact feature coming soon!');
                            }}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                          >
                            <FaPhone className="inline mr-1" />
                            Contact Customer
                          </button>

                          {/* View Details Button */}
                          <button
                            onClick={() => {
                              // You can implement a detailed view modal
                              toast.info('Detailed view coming soon!');
                            }}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                          >
                            <FaEye className="inline mr-1" />
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Booking Statistics */}
                {bookings.length > 0 && (
                  <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Statistics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          {bookings.filter(b => b.status === 'pending').length}
                        </p>
                        <p className="text-sm text-gray-600">Pending</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          {bookings.filter(b => b.status === 'confirmed').length}
                        </p>
                        <p className="text-sm text-gray-600">Confirmed</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-600">
                          {bookings.filter(b => b.status === 'completed').length}
                        </p>
                        <p className="text-sm text-gray-600">Completed</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-red-600">
                          {bookings.filter(b => b.status === 'cancelled' || b.status === 'rejected').length}
                        </p>
                        <p className="text-sm text-gray-600">Cancelled/Rejected</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews & Ratings</h2>
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Average Rating</p>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-gray-900">{userData.averageRating}</span>
                        <FaStar className="text-yellow-400 ml-2" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Reviews</p>
                      <p className="text-2xl font-bold text-gray-900">{userData.reviews}</p>
                    </div>
                  </div>
                </div>
                <div className="text-center py-8">
                  <FaStar className="text-4xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Reviews will appear here once customers leave feedback</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Verify OTP</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please enter the 6-digit OTP sent to your registered email to update sensitive information.
            </p>
            <input
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="Enter 6-digit OTP"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4"
              maxLength={6}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowOTPModal(false);
                  setOtpCode('');
                  setPendingChanges(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleOTPSubmit}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
              >
                Verify & Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedDashboard; 