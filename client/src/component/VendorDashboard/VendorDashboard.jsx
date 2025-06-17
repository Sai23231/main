import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VendorProfile from './VendorProfile';
import VendorServices from './VendorServices';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { selectLoggedInUser } from '../UserLogin/authSlice';
import { useSelector } from 'react-redux';

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
  const navigate = useNavigate();
  const userSignedIn = useSelector(selectLoggedInUser);
  // useEffect(() => {
  //   if (!userSignedIn) {
  //     navigate("/userlogin");
  //   }
  // },[userSignedIn]);

  useEffect(() => {
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
  }, []);

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

  return (
    <div className="min-h-screen bg-pink-50 animated-scrollbar">
      {/* Header Section */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome back, Vendor!</h1>
        <p className="text-gray-600 mt-2">Manage your profile, view bookings, and plan your services</p>
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
              className={`$${activeTab === 'profile' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`$${activeTab === 'services' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              My Services
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`$${activeTab === 'bookings' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Bookings
            </button>
          </nav>
        </div>

        {/* Content Section */}
        <div className="py-6">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Combined Next Booking + Calendar & Availability */}
              <div className="md:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                  {/* Next Booking */}
                  <h3 className="text-lg font-semibold mb-2"><b>Next Booking</b></h3>
                  {calendar.length ? (
                    <div>
                      <p className="text-pink-600 font-bold"><b>{calendar[0].date}</b></p>
                      <p><b>{calendar[0].label}</b></p>
                    </div>
                  ) : (
                    <p><b>No upcoming bookings.</b></p>
                  )}
                  {/* Calendar Section for Bookings & Unavailability */}
                  <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-2"><b>Calendar & Availability</b></h2>
                    <Calendar
                      value={selectedCalendarDate}
                      onChange={setSelectedCalendarDate}
                      tileClassName={tileClassName}
                      onClickDay={onCalendarClick}
                    />
                    <div className="mt-4 flex flex-col gap-2">
                      <button
                        onClick={handleMarkUnavailable}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 font-bold transition-transform duration-200 active:scale-95"
                      >
                        Mark {selectedCalendarDate.toISOString().split('T')[0]} as Unavailable
                      </button>
                      <div className="text-xs text-gray-500 mt-2">
                        <span className="inline-block w-3 h-3 bg-green-200 rounded-full mr-1 animate-pulse"></span> Booking &nbsp;
                        <span className="inline-block w-3 h-3 bg-red-200 rounded-full mr-1 animate-bounce"></span> Unavailable (Click to remove)
                      </div>
                      <div className="text-xs text-gray-400 mt-2">(Bookings and unavailable dates are shown. Backend integration needed for real data.)</div>
                    </div>
                  </div>
                </div>
                {/* Modal for confirmation */}
                {showModal && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                      <h3 className="text-lg font-bold mb-4 text-center text-pink-700">
                        {modalAction === 'add' ? 'Mark as Unavailable?' : 'Remove Unavailable Date?'}
                      </h3>
                      <p className="text-center mb-6">
                        {modalAction === 'add'
                          ? `Are you sure you want to mark ${modalDate.toISOString().split('T')[0]} as unavailable?`
                          : `Are you sure you want to remove ${modalDate.toISOString().split('T')[0]} from unavailable dates?`}
                      </p>
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={confirmModalAction}
                          className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 font-bold transition-transform duration-200 active:scale-95"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setShowModal(false)}
                          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 font-bold transition-transform duration-200 active:scale-95"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* Profile Snapshot & Stats */}
              <div className="md:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                  <h2 className="text-xl font-semibold mb-2"><b>Profile Snapshot</b></h2>
                  <p><b>Total Bookings:</b> <b>{profileStats.totalBookings}</b></p>
                  <p><b>Average Rating:</b> <b>{profileStats.avgRating}</b> ⭐</p>
                  <p><b>Total Revenue:</b> <b>{profileStats.totalRevenue}</b></p>
                  <p><b>Response Rate:</b> <b>{profileStats.responseRate}</b></p>
                  <div className="mt-2">
                    <b>Recent Reviews:</b>
                    <ul className="list-disc ml-5">
                      {profileStats.recentReviews.map((r, i) => (
                        <li key={i}><b>{r.user}</b>: "{r.comment}" (<b>{r.rating}⭐</b>)</li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* Planner */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                  <h2 className="text-xl font-semibold mb-2"><b>Planner / To-Do</b></h2>
                  {/* Add Task Input */}
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      placeholder="Add a new task..."
                      value={newTaskText}
                      onChange={e => setNewTaskText(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                    <input
                      type="text"
                      placeholder="Note (optional)"
                      value={newTaskNote}
                      onChange={e => setNewTaskNote(e.target.value)}
                      className="w-40 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-200"
                    />
                    <button
                      onClick={handleAddPlannerTask}
                      className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 font-bold transition"
                    >
                      Add
                    </button>
                  </div>
                  {/* Planner List with Scrollbar */}
                  <ul style={{ maxHeight: '180px', overflowY: 'auto' }} className="pr-2 custom-scrollbar">
                    {planner.map(task => (
                      <li key={task.id} className="mb-2 flex items-center group relative">
                        <input
                          type="checkbox"
                          checked={task.done}
                          onChange={() => handleTogglePlannerTask(task.id)}
                          className="mr-2 animated-checkbox"
                        />
                        <span
                          className={task.done ? 'line-through text-gray-400' : ''}
                          title={task.note || undefined}
                          style={{ cursor: task.note ? 'help' : 'default' }}
                        >
                          <b>{task.task}</b>
                          {task.due && <span className="ml-2 text-xs text-gray-500">(Due: <b>{task.due}</b>)</span>}
                        </span>
                        <button
                          onClick={() => handleDeletePlannerTask(task.id)}
                          className="ml-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm font-bold px-2 py-1 rounded hover:bg-red-100"
                          title="Delete task"
                        >
                          ×
                        </button>
                        {/* Tooltip for note (for custom tooltip, uncomment below)
                        {task.note && (
                          <span className="absolute left-8 top-8 z-10 bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            {task.note}
                          </span>
                        )}
                        */}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Quick Links */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-2"><b>Quick Links</b></h2>
                  <div className="flex flex-wrap gap-4">
                    <button onClick={() => setActiveTab('profile')} className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 font-bold">Edit Profile</button>
                    <button onClick={() => setActiveTab('services')} className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 font-bold">Manage Services</button>
                    <button onClick={() => setActiveTab('bookings')} className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 font-bold">View Bookings</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'profile' && <VendorProfile />}
          {activeTab === 'services' && <VendorServices />}
          {activeTab === 'bookings' && (
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4"><b>My Bookings</b></h2>
              <ul>
                {upcomingOrders.map(order => (
                  <li key={order.id} className="mb-2 border-b pb-2">
                    <b>{order.client}</b> - <b>{order.service}</b> on <b>{order.date}</b> <span className={`ml-2 px-2 py-1 rounded text-xs ${order.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}><b>{order.status}</b></span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard; 