import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiX, FiSend, FiChevronRight, FiDollarSign, 
  FiUsers, FiBriefcase, FiCalendar, FiMapPin, FiUser,
  FiPlus, FiEdit, FiTrash2, FiEye, FiCheckCircle, FiXCircle, FiTarget,
  FiCreditCard
} from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { selectLoggedInUser } from '../UserLogin/authSlice';
import SponsorDashboard from './SponsorDashboard';
import SponsorPayment from './SponsorPayment.jsx';

const SponsorConnect = () => {
  const [sponsors, setSponsors] = useState([]);
  const [filter, setFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [userType, setUserType] = useState(null); // null means user hasn't selected yet
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    organizerName: '',
    eventName: '',
    eventType: '',
    description: '',
    coverImg: null,
    eventPdf: null
  });
  const [proposals, setProposals] = useState([]);
  const [showProposals, setShowProposals] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Use Redux auth state
  const user = useSelector(selectLoggedInUser);
  const isAuthenticated = !!user;

  // If user type is sponsor, render SponsorDashboard
  if (userType === 'sponsor') {
    return <SponsorDashboard />;
  }

  // Fetch data based on user type
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !userType) return;
      
      setIsLoading(true);
      try {
        if (userType === 'organizer') {
          // Fetch sponsors with filters - no authentication needed for public sponsor list
          let sponsorsUrl = `${import.meta.env.VITE_BACKEND_URL}/sponsor`;
          if (filter && filter !== 'all') {
            sponsorsUrl += `/industry/${filter}`;
          }
          
          const sponsorsRes = await axios.get(sponsorsUrl);
          setSponsors(sponsorsRes.data);
          
          // Fetch organizer's events
          const eventsRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/events/organizerEvents`, {
            withCredentials: true
          });
          setEvents(eventsRes.data);
        } else if (userType === 'sponsor') {
          // Fetch user's proposals if sponsor
          const proposalsRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/proposal/sponsorProposals`, {
            withCredentials: true
          });
          setProposals(proposalsRes.data);
        }
      } catch (err) {
        console.error('Error fetching data', err);
        if (err.response?.status === 401) {
          window.location.href = '/userlogin';
        }
      } finally {
        setIsLoading(false);
      }
    };
    
      const debounceTimer = setTimeout(() => {
        fetchData();
      }, 300);
      
      return () => clearTimeout(debounceTimer);
  }, [filter, searchQuery, isAuthenticated, userType]);

  const sendConnectionRequest = async () => {
    if (!selectedSponsor || !message || !selectedEvent) return;
    
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/proposal/create`, {
        eventId: selectedEvent._id,
        sponsorId: selectedSponsor._id,
        amount: 0,
        message
      }, {
        withCredentials: true
      });
      alert('Proposal created successfully!');
      setSelectedSponsor(null);
      setMessage('');
      setSelectedEvent(null);
    } catch (err) {
      console.error('Error sending proposal', err);
      alert('Failed to send proposal');
      if (err.response?.status === 401) {
        window.location.href = '/userlogin';
      }
    }
  };

  const createNewEvent = async () => {
    try {
      const formData = new FormData();
      formData.append('organizerName', newEvent.organizerName);
      formData.append('eventName', newEvent.eventName);
      formData.append('eventType', newEvent.eventType);
      formData.append('description', newEvent.description);
      
      if (newEvent.coverImg) {
        formData.append('CoverImage', newEvent.coverImg);
      }
      if (newEvent.eventPdf) {
        formData.append('EventPdf', newEvent.eventPdf);
      }

      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/events/create`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setEvents([...events, res.data.event]);
      setShowEventForm(false);
      setNewEvent({
        organizerName: '',
        eventName: '',
        eventType: '',
        description: '',
        coverImg: null,
        eventPdf: null
      });
    } catch (err) {
      console.error('Error creating event', err);
      alert('Failed to create event');
      if (err.response?.status === 401) {
        window.location.href = '/userlogin';
      }
    }
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    setNewEvent(prev => ({
      ...prev,
      [field]: file
    }));
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            Please log in to access the sponsor connection platform.
          </p>
          <button 
            onClick={() => window.location.href = '/userlogin'}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // User Type Selection Screen
  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to SponsorConnect</h1>
            <p className="text-xl text-gray-600">
              Choose your role to get started with the platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Organizer Card */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setUserType('organizer')}
              className="bg-white rounded-xl shadow-lg p-8 cursor-pointer border-2 border-transparent hover:border-purple-300 transition-all duration-300"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiCalendar className="text-purple-600 text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Event Organizer</h3>
                <p className="text-gray-600 mb-6">
                  Create events, find sponsors, and manage your event partnerships
                </p>
                <div className="space-y-3 text-sm text-gray-500">
                  <div className="flex items-center justify-center">
                    <FiCheckCircle className="text-green-500 mr-2" />
                    <span>Create and manage events</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <FiCheckCircle className="text-green-500 mr-2" />
                    <span>Find relevant sponsors</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <FiCheckCircle className="text-green-500 mr-2" />
                    <span>Send sponsorship proposals</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <FiCheckCircle className="text-green-500 mr-2" />
                    <span>Track proposal responses</span>
                  </div>
                </div>
                <button className="mt-6 w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                  Continue as Organizer
                </button>
              </div>
            </motion.div>

            {/* Sponsor Card */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setUserType('sponsor')}
              className="bg-white rounded-xl shadow-lg p-8 cursor-pointer border-2 border-transparent hover:border-blue-300 transition-all duration-300"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiDollarSign className="text-blue-600 text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Sponsor</h3>
                <p className="text-gray-600 mb-6">
                  Manage sponsorship opportunities and track your event partnerships
                </p>
                <div className="space-y-3 text-sm text-gray-500">
                  <div className="flex items-center justify-center">
                    <FiCheckCircle className="text-green-500 mr-2" />
                    <span>View sponsorship requests</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <FiCheckCircle className="text-green-500 mr-2" />
                    <span>Manage proposal status</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <FiCheckCircle className="text-green-500 mr-2" />
                    <span>Track partnership analytics</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <FiCheckCircle className="text-green-500 mr-2" />
                    <span>Communicate with organizers</span>
                  </div>
                </div>
                <button className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Continue as Sponsor
                </button>
              </div>
            </motion.div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              You can change your role anytime from the header menu
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handlePaymentSuccess = (paymentDetails) => {
    setPaymentSuccess(true);
    // Refresh proposals to show updated status
    fetchProposals();
    // Close payment modal after a delay
    setTimeout(() => {
      setShowPaymentModal(false);
      setSelectedProposal(null);
      setPaymentSuccess(false);
    }, 3000);
  };

  const handleProposalPayment = (proposal) => {
    setSelectedProposal(proposal);
    setShowPaymentModal(true);
  };

  const handleProposalResponse = async (proposalId, response) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/proposal/${proposalId}/respond`, {
        status: response
      }, {
        withCredentials: true
      });
      // Refresh proposals to show updated status
      fetchProposals();
    } catch (err) {
      console.error('Error responding to proposal', err);
      alert('Failed to respond to proposal');
      if (err.response?.status === 401) {
        window.location.href = '/userlogin';
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-purple-600">SponsorConnect</h1>
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
                  userType === 'sponsor' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Sponsor
              </button>
            </div>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <FiUser className="text-purple-600" />
                </div>
                <span className="text-sm font-medium">{user.name || user.email?.split('@')[0]}</span>
              </div>
              <button
                onClick={() => setUserType(null)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Change Role
              </button>
              </div>
            )}
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
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                >
                  <FiPlus className="mr-2" />
                  Create New Event
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
                      <h3 className="font-bold text-gray-900">{event.eventName}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <FiCalendar className="mr-1" />
                        <span>{new Date(event.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <FiBriefcase className="mr-1" />
                        <span>{event.eventType}</span>
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

                        {sponsor.companyDescription && (
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {sponsor.companyDescription}
                          </p>
                        )}

                        <div className="space-y-3 text-sm mb-4">
                          <div className="flex items-center">
                            <FiDollarSign className="text-gray-400 mr-2" />
                            <span className="font-medium">Budget Range:</span>
                            <span className="ml-1">{sponsor.budget || 'Flexible'}</span>
                          </div>
                          <div className="flex items-center">
                            <FiUsers className="text-gray-400 mr-2" />
                            <span className="font-medium">Industry:</span>
                            <span className="ml-1">{sponsor.industry}</span>
                          </div>
                          {sponsor.targetAudience && (
                          <div className="flex items-center">
                              <FiTarget className="text-gray-400 mr-2" />
                              <span className="font-medium">Target:</span>
                              <span className="ml-1 text-xs">{sponsor.targetAudience}</span>
                            </div>
                          )}
                        </div>

                        {/* Deliverables */}
                        {sponsor.deliverables && sponsor.deliverables.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Deliverables:</h4>
                            <div className="space-y-1">
                              {sponsor.deliverables.slice(0, 2).map((deliverable, index) => (
                                <div key={index} className="flex items-center text-xs">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium mr-2 ${
                                    deliverable.type === 'financial' ? 'bg-green-100 text-green-800' :
                                    deliverable.type === 'in-kind' ? 'bg-blue-100 text-blue-800' :
                                    deliverable.type === 'services' ? 'bg-purple-100 text-purple-800' :
                                    deliverable.type === 'products' ? 'bg-orange-100 text-orange-800' :
                                    deliverable.type === 'marketing' ? 'bg-pink-100 text-pink-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {deliverable.type}
                                  </span>
                                  <span className="text-gray-600">{deliverable.description}</span>
                                </div>
                              ))}
                              {sponsor.deliverables.length > 2 && (
                                <div className="text-xs text-gray-500">
                                  +{sponsor.deliverables.length - 2} more deliverables
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Sponsorship Levels */}
                        {sponsor.sponsorshipLevels && sponsor.sponsorshipLevels.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Sponsorship Levels:</h4>
                            <div className="space-y-1">
                              {sponsor.sponsorshipLevels.slice(0, 2).map((level, index) => (
                                <div key={index} className="flex justify-between items-center text-xs">
                                  <span className="font-medium">{level.name}</span>
                                  <span className="text-purple-600 font-semibold">₹{level.amount?.toLocaleString()}</span>
                                </div>
                              ))}
                              {sponsor.sponsorshipLevels.length > 2 && (
                                <div className="text-xs text-gray-500">
                                  +{sponsor.sponsorshipLevels.length - 2} more levels
                                </div>
                              )}
                            </div>
                          </div>
                        )}

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
          // Sponsor Dashboard
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Sponsor Dashboard</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Manage your sponsorship opportunities and track your proposals
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FiEye className="text-blue-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Proposals</p>
                    <p className="text-2xl font-bold text-gray-900">{proposals.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <FiCalendar className="text-yellow-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {proposals.filter(p => p.status === 'Pending').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full">
                    <FiDollarSign className="text-green-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {proposals.filter(p => p.status === 'Approved').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Proposals Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Your Proposals</h2>
              </div>
              
              {proposals.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FiSend className="text-gray-400 text-2xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No proposals yet</h3>
                  <p className="text-gray-500">
                    Start connecting with event organizers to see your proposals here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Event
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {proposals.map((proposal) => (
                        <tr key={proposal._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {proposal.eventId?.eventName || 'Unknown Event'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {proposal.eventId?.eventType || 'N/A'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${proposal.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              proposal.status === 'Approved' 
                                ? 'bg-green-100 text-green-800'
                                : proposal.status === 'Rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {proposal.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(proposal.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2 mt-4">
                              {proposal.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleProposalResponse(proposal._id, 'accepted')}
                                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleProposalResponse(proposal._id, 'rejected')}
                                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              {proposal.status === 'accepted' && (
                                <button
                                  onClick={() => handleProposalPayment(proposal)}
                                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                                >
                                  <FiCreditCard className="w-4 h-4" />
                                  Pay ₹{proposal.amount?.toLocaleString()}
              </button>
                              )}
                              {proposal.status === 'paid' && (
                                <div className="w-full bg-green-100 text-green-800 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                                  <FiCheckCircle className="w-4 h-4" />
                                  Payment Completed
                                </div>
                              )}
                              {proposal.status === 'rejected' && (
                                <div className="w-full bg-red-100 text-red-800 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                                  <FiXCircle className="w-4 h-4" />
                                  Rejected
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
                      <p className="text-sm font-medium">For Event: {selectedEvent.eventName}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(selectedEvent.createdAt).toLocaleDateString()} • {selectedEvent.eventType}
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
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organizer Name</label>
                  <input
                    type="text"
                    value={newEvent.organizerName}
                    onChange={(e) => setNewEvent({...newEvent, organizerName: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Your Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                  <input
                    type="text"
                    value={newEvent.eventName}
                    onChange={(e) => setNewEvent({...newEvent, eventName: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Annual Tech Conference"
                  />
                </div>

                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                  <select
                    value={newEvent.eventType}
                    onChange={(e) => setNewEvent({...newEvent, eventType: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select Event Type</option>
                    <option value="Conference">Conference</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Exhibition">Exhibition</option>
                    <option value="Concert">Concert</option>
                    <option value="Sports">Sports</option>
                    <option value="Other">Other</option>
                  </select>
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

                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                    <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'coverImg')}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event PDF</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e, 'eventPdf')}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  disabled={!newEvent.organizerName || !newEvent.eventName || !newEvent.eventType || !newEvent.description}
                >
                  Create Event
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      {showPaymentModal && selectedProposal && (
        <SponsorPayment
          proposal={selectedProposal}
          onPaymentSuccess={handlePaymentSuccess}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedProposal(null);
          }}
        />
      )}
  </div>
);
};

export default SponsorConnect;