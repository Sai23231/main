import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VendorProfile from './VendorProfile';
import VendorServices from './VendorServices';
import VendorBookingManagement from './VendorBookingManagement';
import VendorProfileCompletion from './VendorProfileCompletion';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { selectLoggedInUser } from '../UserLogin/authSlice';
import { useSelector } from 'react-redux';
import { FaCheckCircle, FaExclamationTriangle, FaClock, FaEdit, FaEye, FaSpinner } from 'react-icons/fa';

// Mock data for dashboard summary
const mockUpcomingOrders = [
  { id: 1, client: 'Amit Sharma', date: '2025-05-10', service: 'Photography', status: 'Confirmed' },
  { id: 2, client: 'Priya Singh', date: '2025-05-15', service: 'Cinematography', status: 'Pending' },
];
const mockPlanner = [
  { id: 1, task: 'Call client for details', due: '2025-05-08', done: false },
  { id: 2, task: 'Prepare invoice for Amit', due: '2025-05-09', done: false },
];
const mockCalendar = [
  { date: '2025-05-10', label: 'Amit Sharma - Photography' },
  { date: '2025-05-15', label: 'Priya Singh - Cinematography' },
];
const mockProfileStats = {
  totalBookings: 24,
  avgRating: 4.7,
  totalRevenue: '₹2,40,000',
  recentReviews: [
    { user: 'Rahul', comment: 'Amazing work!', rating: 5 },
    { user: 'Sneha', comment: 'Very professional.', rating: 4 },
  ],
  responseRate: '98%'
};

function CalendarWidget({ events }) {
  // Simple calendar: just list next event for now
  const nextEvent = events.length ? events[0] : null;
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2"><b>Next Booking</b></h3>
      {nextEvent ? (
        <div>
          <p className="text-pink-600 font-bold"><b>{nextEvent.date}</b></p>
          <p><b>{nextEvent.label}</b></p>
        </div>
      ) : (
        <p><b>No upcoming bookings.</b></p>
      )}
    </div>
  );
}

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profileStats, setProfileStats] = useState(mockProfileStats);
  const [upcomingOrders, setUpcomingOrders] = useState(mockUpcomingOrders);
  const [planner, setPlanner] = useState(mockPlanner);
  const [calendar, setCalendar] = useState(mockCalendar);
  const [services, setServices] = useState([]);
  const [unavailableDates, setUnavailableDates] = useState(["2025-05-10"]); // Example unavailable date
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 'add' or 'remove'
  const [modalDate, setModalDate] = useState(null);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskNote, setNewTaskNote] = useState("");
  const [vendorData, setVendorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingStatus, setOnboardingStatus] = useState({
    isComplete: false,
    profileComplete: false,
    servicesComplete: false,
    portfolioComplete: false,
    approved: false
  });
  
  const navigate = useNavigate();
  const userSignedIn = useSelector(selectLoggedInUser);

  useEffect(() => {
    if (!userSignedIn || userSignedIn.role !== 'vendor') {
      navigate('/vendorlogin');
      return;
    }

    fetchVendorData();
    fetchDashboardData();
  }, [userSignedIn, navigate]);

  const fetchVendorData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/vendor/profile`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        const vendor = response.data.vendor;
        setVendorData(vendor);
        
        // Check onboarding status
        const status = {
          isComplete: vendor.status === 'approved' && vendor.profileComplete,
          profileComplete: !!(vendor.name && vendor.description && vendor.location),
          servicesComplete: !!(vendor.services && vendor.services.length > 0),
          portfolioComplete: !!(vendor.photos && vendor.photos.length > 0),
          approved: vendor.status === 'approved'
        };
        
        setOnboardingStatus(status);
        
        // If not approved, show appropriate message
        if (vendor.status === 'pending') {
          setActiveTab('onboarding');
        }
      }
    } catch (error) {
      console.error('Error fetching vendor data:', error);
      // Use login data as fallback
      if (userSignedIn) {
        setVendorData(userSignedIn);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    // Fetch vendor profile stats
    axios.get('/api/vendor/profile')
      .then(res => setProfileStats(res.data))
      .catch(() => setProfileStats(mockProfileStats));
    // Fetch vendor services
    axios.get('/api/vendor/services')
      .then(res => setServices(res.data))
      .catch(() => setServices([]));
    // Fetch vendor bookings/orders
    axios.get('/api/vendor/bookings')
      .then(res => setUpcomingOrders(res.data))
      .catch(() => setUpcomingOrders(mockUpcomingOrders));
    // Fetch planner/to-do
    axios.get('/api/vendor/planner')
      .then(res => setPlanner(res.data))
      .catch(() => setPlanner(mockPlanner));
    // Fetch calendar events
    axios.get('/api/vendor/calendar')
      .then(res => setCalendar(res.data))
      .catch(() => setCalendar(mockCalendar));
    // Fetch unavailable dates from backend
    axios.get('/api/vendor/unavailable-dates')
      .then(res => setUnavailableDates(res.data))
      .catch(() => setUnavailableDates(["2025-05-10"]));
  };

  const handleMarkUnavailable = () => {
    setModalDate(selectedCalendarDate);
    setModalAction('add');
    setShowModal(true);
  };

  const handleRemoveUnavailable = (date) => {
    setModalDate(date);
    setModalAction('remove');
    setShowModal(true);
  };

  const confirmModalAction = async () => {
    const dateStr = modalDate.toISOString().split('T')[0];
    if (modalAction === 'add') {
      if (!unavailableDates.includes(dateStr)) {
        setUnavailableDates([...unavailableDates, dateStr]);
        // Save to backend
        try {
          await axios.post('/api/vendor/unavailable-dates', { date: dateStr });
        } catch (err) { /* handle error, maybe revert UI */ }
      }
    } else if (modalAction === 'remove') {
      setUnavailableDates(unavailableDates.filter(d => d !== dateStr));
      // Remove from backend
      try {
        await axios.delete(`/api/vendor/unavailable-dates/${dateStr}`);
      } catch (err) { /* handle error, maybe revert UI */ }
    }
    setShowModal(false);
    setModalDate(null);
    setModalAction(null);
  };

  // Combine bookings and unavailable dates for calendar highlights
  const bookingDates = calendar.map(ev => ev.date);
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      if (unavailableDates.includes(dateStr)) return 'unavailable-date-calendar-tile';
      if (bookingDates.includes(dateStr)) return 'bg-green-200 text-green-800 rounded-full';
    }
    return null;
  };

  const onCalendarClick = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    if (unavailableDates.includes(dateStr)) {
      handleRemoveUnavailable(date);
    } else {
      setSelectedCalendarDate(date);
    }
  };

  // Add a handler to toggle planner task completion
  const handleTogglePlannerTask = (id) => {
    setPlanner(prev => prev.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    ));
    // TODO: Optionally, sync with backend
  };

  // Add a handler to add a new planner task
  const handleAddPlannerTask = () => {
    if (newTaskText.trim()) {
      setPlanner(prev => [
        ...prev,
        {
          id: Date.now(),
          task: newTaskText,
          done: false,
          due: "",
          note: newTaskNote
        }
      ]);
      setNewTaskText("");
      setNewTaskNote("");
    }
  };

  // Add a handler to delete a planner task
  const handleDeletePlannerTask = (id) => {
    setPlanner(prev => prev.filter(task => task.id !== id));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><FaCheckCircle className="mr-1" />Approved</span>;
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><FaClock className="mr-1" />Pending</span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><FaExclamationTriangle className="mr-1" />Rejected</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-pink-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show onboarding if vendor is not approved or profile is incomplete
  if (!onboardingStatus.approved || !onboardingStatus.isComplete) {
    return (
      <div className="min-h-screen bg-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-800">Welcome to Dream Ventz!</h1>
              {getStatusBadge(vendorData?.status || 'pending')}
            </div>
            
            {!onboardingStatus.approved ? (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <FaClock className="text-yellow-400 mt-1 mr-3" />
                  <div>
                    <p className="text-yellow-700">
                      <strong>Your registration is under review.</strong> Our team is currently reviewing your application. 
                      You'll receive an email notification once your account is approved.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <div className="flex">
                  <FaEdit className="text-blue-400 mt-1 mr-3" />
                  <div>
                    <p className="text-blue-700">
                      <strong>Complete your profile to get started!</strong> Add your services, portfolio, and business details 
                      to start receiving bookings from couples.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <VendorProfileCompletion 
              vendorData={vendorData}
              onProfileComplete={() => {
                setOnboardingStatus(prev => ({ ...prev, isComplete: true }));
                setActiveTab('dashboard');
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 animated-scrollbar">
      {/* Header Section */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome back, {vendorData?.name || 'Vendor'}!</h1>
        <p className="text-gray-600 mt-2">Manage your profile, view bookings, and plan your services</p>
        {getStatusBadge(vendorData?.status)}
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`${activeTab === 'dashboard' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`${activeTab === 'profile' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`${activeTab === 'services' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Services
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`${activeTab === 'bookings' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Bookings
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="py-8">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Dashboard Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Profile Stats */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Profile Overview</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-600">{profileStats.totalBookings}</div>
                      <div className="text-sm text-gray-600">Total Bookings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-600">{profileStats.avgRating}</div>
                      <div className="text-sm text-gray-600">Average Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-600">{profileStats.totalRevenue}</div>
                      <div className="text-sm text-gray-600">Total Revenue</div>
                      </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-600">{profileStats.responseRate}</div>
                      <div className="text-sm text-gray-600">Response Rate</div>
                    </div>
                  </div>
                </div>

                {/* Upcoming Orders */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Upcoming Orders</h2>
                  <div className="space-y-3">
                    {upcomingOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{order.client}</div>
                          <div className="text-sm text-gray-600">{order.service} - {order.date}</div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Planner */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Planner</h2>
                  <div className="space-y-3">
                    {planner.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={task.done}
                            onChange={() => handleTogglePlannerTask(task.id)}
                            className="mr-3"
                          />
                          <div>
                            <div className={`font-medium ${task.done ? 'line-through text-gray-500' : ''}`}>
                              {task.task}
                            </div>
                            <div className="text-sm text-gray-600">Due: {task.due}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeletePlannerTask(task.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <input
                      type="text"
                      value={newTaskText}
                      onChange={(e) => setNewTaskText(e.target.value)}
                      placeholder="Add new task"
                      className="flex-1 px-3 py-2 border rounded-md"
                    />
                    <button
                      onClick={handleAddPlannerTask}
                      className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <CalendarWidget events={calendar} />
                
                {/* Calendar */}
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-semibold mb-4">Calendar</h3>
                  <Calendar
                    onChange={onCalendarClick}
                    value={selectedCalendarDate}
                    tileClassName={tileClassName}
                    className="w-full"
                  />
                  <div className="mt-4">
                        <button
                      onClick={handleMarkUnavailable}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                      Mark as Unavailable
                        </button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={() => setActiveTab('services')}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Manage Services
                    </button>
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                      View Bookings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && <VendorProfile />}
          {activeTab === 'services' && <VendorServices />}
          {activeTab === 'bookings' && <VendorBookingManagement />}
        </div>
      </div>

      {/* Modal for confirming unavailable dates */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {modalAction === 'add' ? 'Mark as Unavailable' : 'Remove Unavailable'}
            </h3>
            <p className="mb-4">
              {modalAction === 'add' 
                ? `Are you sure you want to mark ${modalDate?.toLocaleDateString()} as unavailable?`
                : `Are you sure you want to make ${modalDate?.toLocaleDateString()} available again?`
              }
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmModalAction}
                className={`px-4 py-2 rounded-md ${
                  modalAction === 'add' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700'
                } text-white`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard; 