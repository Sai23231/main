import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiX, FiSend, FiChevronRight, FiDollarSign, 
  FiUsers, FiBriefcase, FiCalendar, FiMapPin, FiUser 
} from 'react-icons/fi';

const SponsorConnect = () => {
  const [sponsors, setSponsors] = useState([]);
  const [filter, setFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [userType, setUserType] = useState('organizer');
  const [organizerProfile, setOrganizerProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    date: '',
    location: '',
    description: '',
    expectedAttendees: '',
    budgetNeeded: ''
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // You might want to verify the token with your backend here
    }
  }, []);

  // Fetch sponsors, organizer profile, and events
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch sponsors with filters
        const sponsorsRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/sponsors`, {
          params: {
            industry: filter === 'all' ? '' : filter,
            search: searchQuery
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setSponsors(sponsorsRes.data);

        // Fetch organizer profile if logged in as organizer
        if (userType === 'organizer') {
          const profileRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          setOrganizerProfile(profileRes.data);
          
          // Fetch organizer's events
          const eventsRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/events`, {
            params: { organizerId: profileRes.data._id },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          setEvents(eventsRes.data);
        }
      } catch (err) {
        console.error('Error fetching data', err);
        if (err.response?.status === 401) {
          // Handle unauthorized
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAuthenticated) {
      const debounceTimer = setTimeout(() => {
        fetchData();
      }, 300);
      
      return () => clearTimeout(debounceTimer);
    }
  }, [filter, searchQuery, userType, isAuthenticated]);

  const sendConnectionRequest = async () => {
    if (!selectedSponsor || !message || !selectedEvent) return;
    
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/proposals/create`, {
        eventId: selectedEvent._id,
        sponsorId: selectedSponsor._id,
        amount: 0, // You might want to add amount input in your form
        message,
        status: 'Pending'
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('Proposal created successfully!');
      setSelectedSponsor(null);
      setMessage('');
      setSelectedEvent(null);
    } catch (err) {
      console.error('Error sending proposal', err);
      alert('Failed to send proposal');
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    }
  };

  const createNewEvent = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/events/create`, {
        ...newEvent,
        organizerId: organizerProfile._id
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setEvents([...events, res.data]);
      setShowEventForm(false);
      setNewEvent({
        name: '',
        date: '',
        location: '',
        description: '',
        expectedAttendees: '',
        budgetNeeded: ''
      });
    } catch (err) {
      console.error('Error creating event', err);
      alert('Failed to create event');
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, credentials);
      localStorage.setItem('token', res.data.token);
      setIsAuthenticated(true);
      // You might want to set user type based on response
    } catch (err) {
      console.error('Login failed', err);
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setOrganizerProfile(null);
    setEvents([]);
    setSponsors([]);
  };

  const industries = [
    { id: 'all', name: 'All Sponsors', icon: <FiUsers className="mr-2" /> },
    { id: 'technology', name: 'Technology', icon: <FiBriefcase className="mr-2" /> },
    { id: 'fashion', name: 'Fashion', icon: <FiBriefcase className="mr-2" /> },
    { id: 'food', name: 'Food & Beverage', icon: <FiBriefcase className="mr-2" /> },
    { id: 'finance', name: 'Finance', icon: <FiDollarSign className="mr-2" /> },
    { id: 'sports', name: 'Sports', icon: <FiBriefcase className="mr-2" /> },
    { id: 'health', name: 'Health & Wellness', icon: <FiBriefcase className="mr-2" /> },
  ];

 

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with user type toggle */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">SponsorConnect</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setUserType('organizer')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  userType === 'organizer' ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Event Organizer
              </button>
              <button
                onClick={() => setUserType('sponsor')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  userType === 'sponsor' ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Sponsor
              </button>
            </div>
            {organizerProfile && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <FiUser className="text-purple-600" />
                </div>
                <span className="text-sm font-medium">{organizerProfile.name}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {userType === 'organizer' ? (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Sponsors for Your Event</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Connect with brands that align with your event vision and audience
              </p>
            </div>

            {/* Event Selection */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Your Events</h2>
                <button
                  onClick={() => setShowEventForm(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  + Create New Event
                </button>
              </div>

              {events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {events.map((event) => (
                    <div
                      key={event._id}
                      onClick={() => setSelectedEvent(event)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedEvent?._id === event._id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <h3 className="font-bold text-gray-900">{event.name}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <FiCalendar className="mr-1" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <FiMapPin className="mr-1" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No events created yet. Create your first event to start finding sponsors.
                </div>
              )}
            </div>

            {/* Filter and Search Section */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Industry Tabs */}
                <div className="flex-1">
                  <div className="flex overflow-x-auto pb-2 -mx-2">
                    {industries.map((industry) => (
                      <button
                        key={industry.id}
                        onClick={() => {
                          setActiveTab(industry.id);
                          setFilter(industry.id === 'all' ? '' : industry.id);
                        }}
                        className={`flex items-center px-4 py-2 rounded-full mx-2 whitespace-nowrap transition-colors ${
                          activeTab === industry.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {industry.icon}
                        {industry.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Bar */}
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search sponsors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <FiX />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sponsors Grid */}
            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : sponsors.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-md">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FiUsers className="text-gray-400 text-3xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No sponsors found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Try adjusting your search or filters to find matching sponsors
                </p>
              </div>
            ) : (
              <>
                {!selectedEvent && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          Please select an event above to connect with sponsors.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sponsors.map((sponsor) => (
                    <motion.div
                      key={sponsor._id}
                      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300"
                    >
                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-white shadow">
                            {sponsor.logo ? (
                              <img src={sponsor.logo} alt={sponsor.name} className="w-full h-full object-contain" />
                            ) : (
                              <span className="text-2xl text-purple-600">🏢</span>
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">{sponsor.name}</h3>
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                              {sponsor.industry}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3 text-sm mb-6">
                          <div className="flex items-center">
                            <FiDollarSign className="text-gray-400 mr-2" />
                            <span className="font-medium">Budget Range:</span>
                            <span className="ml-1">{sponsor.budgetRange || 'Flexible'}</span>
                          </div>
                          <div className="flex items-center">
                            <FiUsers className="text-gray-400 mr-2" />
                            <span className="font-medium">Target Audience:</span>
                            <span className="ml-1">{sponsor.targetAudience || 'Various'}</span>
                          </div>
                          <div className="flex items-center">
                            <FiBriefcase className="text-gray-400 mr-2" />
                            <span className="font-medium">Past Sponsorships:</span>
                            <span className="ml-1">{sponsor.pastEvents?.length || '0'} events</span>
                          </div>
                          {sponsor.preferredEventTypes && (
                            <div className="flex items-start">
                              <FiCalendar className="text-gray-400 mr-2 mt-1" />
                              <div>
                                <span className="font-medium">Prefers:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {sponsor.preferredEventTypes.map(type => (
                                    <span key={type} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                      {type}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => setSelectedSponsor(sponsor)}
                          disabled={!selectedEvent}
                          className={`w-full flex items-center justify-center py-2.5 rounded-lg transition-all ${
                            selectedEvent
                              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          Connect with Sponsor
                          <FiChevronRight className="ml-2" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sponsor Dashboard</h2>
              <p className="text-gray-600 mb-6">
                As a sponsor, you can view connection requests and manage your sponsorship opportunities.
              </p>
              <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Go to Sponsor Dashboard
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Connection Modal */}
      <AnimatePresence>
        {selectedSponsor && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Connect with {selectedSponsor.name}</h2>
                  <p className="text-sm text-gray-500">{selectedSponsor.industry}</p>
                  {selectedEvent && (
                    <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">For Event: {selectedEvent.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(selectedEvent.date).toLocaleDateString()} • {selectedEvent.location}
                      </p>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => setSelectedSponsor(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={5}
                    placeholder={`Tell ${selectedSponsor.name} about your event and why they'd be a great fit...`}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedSponsor(null)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendConnectionRequest}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center"
                    disabled={!message || !selectedEvent}
                  >
                    <FiSend className="mr-2" />
                    Send Request
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Event Form Modal */}
      <AnimatePresence>
        {showEventForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">Create New Event</h2>
                <button 
                  onClick={() => setShowEventForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                  <input
                    type="text"
                    value={newEvent.name}
                    onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Annual Tech Conference"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="New York, NY"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describe your event and its purpose..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected Attendees</label>
                    <input
                      type="number"
                      value={newEvent.expectedAttendees}
                      onChange={(e) => setNewEvent({...newEvent, expectedAttendees: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Budget Needed ($)</label>
                  <input
                    type="number"
                    value={newEvent.budgetNeeded}
                    onChange={(e) => setNewEvent({...newEvent, budgetNeeded: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="10000"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowEventForm(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createNewEvent}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  disabled={!newEvent.name || !newEvent.date || !newEvent.location}
                >
                  Create Event
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
};

export default SponsorConnect;