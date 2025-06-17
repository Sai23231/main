import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = `${import.meta.env.VITE_BACKEND_URL}`;
const SPONSORS_API = `${API_BASE}/sponsor`;
const PROPOSALS_API = `${API_BASE}/proposal`;

// Icon Components
const EventIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
  </svg>
);

const BusinessIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
  </svg>
);

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);

const MoneyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
  </svg>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
  </div>
);

const EmptyState = ({ icon, message }) => (
  <div className="text-center py-12">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-lg font-medium text-gray-700">{message}</h3>
  </div>
);

const StatusBadge = ({ status }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
};

const mockEvents = [
  {
    _id: '1',
    name: 'Tech Conference 2023',
    description: 'Annual technology conference for developers and innovators',
    date: '2023-11-15',
    location: 'San Francisco, CA',
    audienceSize: '1000',
    sponsorshipNeeds: ['cash', 'branding']
  }
];

const mockSponsors = [
  {
    _id: '1',
    name: 'TechCorp',
    industry: 'Technology',
    budget: '$5,000 - $15,000',
    preferredEvents: ['Tech Conferences', 'Hackathons'],
    contactPerson: 'John Smith',
    email: 'john@techcorp.com',
    logo: 'https://via.placeholder.com/150'
  }
];

const DreamSponsorApp = () => {
  const [activeTab, setActiveTab] = useState('organizer');
  const [events, setEvents] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [newEvent, setNewEvent] = useState({ 
    name: '', 
    description: '', 
    date: '', 
    location: '',
    audienceSize: '',
    sponsorshipNeeds: []
  });
  const [newProposal, setNewProposal] = useState({
    eventId: '',
    sponsorId: '',
    offerDetails: '',
    amount: '',
    benefits: []
  });
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [filters, setFilters] = useState({
    industry: '',
    budget: '',
    status: ''
  });
  const [isLoading, setIsLoading] = useState({
    events: false,
    sponsors: false,
    proposals: false,
    addEvent: false,
    addProposal: false
  });

  const sponsorshipOptions = [
    { id: 'cash', label: 'Cash Sponsorship' },
    { id: 'products', label: 'Product Donations' },
    { id: 'services', label: 'Services' },
    { id: 'coupons', label: 'Gift Coupons' },
    { id: 'branding', label: 'Branding Items' }
  ];

  const benefitOptions = [
    { id: 'logo', label: 'Logo Placement' },
    { id: 'booth', label: 'Exhibition Booth' },
    { id: 'speaking', label: 'Speaking Opportunity' },
    { id: 'social', label: 'Social Media Mentions' },
    { id: 'tickets', label: 'Free Tickets' }
  ];

  const fetchData = async (type, setData, mockData, endpoint) => {
    setIsLoading(prev => ({ ...prev, [type]: true }));
    try {
      const res = await axios.get(`${API_BASE}/${endpoint}`, {
        withCredentials: true,
      });
      setData(res.data);
    } catch (err) {
      console.error(`Error fetching ${type}`, err);
      setData(mockData);
    } finally {
      setIsLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const fetchSponsors = async (endpoint = '') => {
    setIsLoading(prev => ({ ...prev, sponsors: true }));
    try {
      const res = await axios.get(`${SPONSORS_API}/${endpoint}`, {
        withCredentials: true,
      });
      setSponsors(res.data);
    } catch (err) {
      console.error('Error fetching sponsors', err);
      setSponsors(mockSponsors);
    } finally {
      setIsLoading(prev => ({ ...prev, sponsors: false }));
    }
  };

  const fetchSponsorById = async (id) => {
    try {
      const res = await axios.get(`${SPONSORS_API}/${id}`, {
        withCredentials: true,
      });
      setSelectedSponsor(res.data);
    } catch (err) {
      console.error('Error fetching sponsor details', err);
    }
  };

  const fetchProposals = async (endpoint = '') => {
    setIsLoading(prev => ({ ...prev, proposals: true }));
    try {
      const res = await axios.get(`${PROPOSALS_API}/${endpoint}`, {
        withCredentials: true,
      });
      setProposals(res.data);
    } catch (err) {
      console.error('Error fetching proposals', err);
    } finally {
      setIsLoading(prev => ({ ...prev, proposals: false }));
    }
  };

  const createProposal = async () => {
    if (!newProposal.eventId || !newProposal.sponsorId) return;
    setIsLoading(prev => ({ ...prev, addProposal: true }));
    try {
      await axios.post(`${PROPOSALS_API}/create`, newProposal, {
        withCredentials: true,
      });
      setNewProposal({
        eventId: '',
        sponsorId: '',
        offerDetails: '',
        amount: '',
        benefits: []
      });
      fetchProposals();
    } catch (err) {
      console.error('Error creating proposal', err);
    } finally {
      setIsLoading(prev => ({ ...prev, addProposal: false }));
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    if (filterType === 'industry' && value) {
      fetchSponsors(`industry/${value}`);
    } else if (filterType === 'budget' && value) {
      fetchSponsors(`budget/${value}`);
    } else if (filterType === 'status' && value) {
      fetchProposals(`status/${value}`);
    } else {
      if (activeTab === 'sponsor') fetchSponsors();
      if (activeTab === 'proposals') fetchProposals();
    }
  };

  const handleAddEvent = async () => {
    if (!newEvent.name || !newEvent.date) return;
    setIsLoading(prev => ({ ...prev, addEvent: true }));
    try {
      await axios.post(`${API_BASE}/events/create`, newEvent, {
        withCredentials: true,
      });
      setNewEvent({ 
        name: '', 
        description: '', 
        date: '', 
        location: '',
        audienceSize: '',
        sponsorshipNeeds: []
      });
      fetchData('events', setEvents, mockEvents, 'events');
    } catch (err) {
      console.error('Error adding event', err);
    } finally {
      setIsLoading(prev => ({ ...prev, addEvent: false }));
    }
  };

  const handleSponsorshipNeedChange = (needId) => {
    setNewEvent(prev => ({
      ...prev,
      sponsorshipNeeds: prev.sponsorshipNeeds.includes(needId)
        ? prev.sponsorshipNeeds.filter(id => id !== needId)
        : [...prev.sponsorshipNeeds, needId]
    }));
  };

  useEffect(() => {
    if (activeTab === 'organizer') {
      fetchData('events', setEvents, mockEvents, 'events');
    } else if (activeTab === 'sponsor') {
      fetchSponsors();
    } else if (activeTab === 'proposals') {
      fetchProposals();
    }
  }, [activeTab]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100"
    >
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BusinessIcon />
              DreamSponsor
            </h1>
          </div>
        </div>
      </div>

      <div className="flex border-b border-gray-200">
        {['organizer', 'sponsor', 'proposals'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 md:py-4 px-4 md:px-6 text-center font-medium text-base md:text-lg flex items-center justify-center gap-2 ${
              activeTab === tab
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'organizer' ? (
              <>
                <EventIcon />
                <span className="hidden sm:inline">Event Organizer</span>
                <span className="sm:hidden">Events</span>
              </>
            ) : tab === 'sponsor' ? (
              <>
                <BusinessIcon />
                <span className="hidden sm:inline">Find Sponsors</span>
                <span className="sm:hidden">Sponsors</span>
              </>
            ) : (
              <>
                <EmailIcon />
                <span className="hidden sm:inline">Proposals</span>
                <span className="sm:hidden">Proposals</span>
              </>
            )}
          </button>
        ))}
      </div>

      <div className="p-4 sm:p-6 md:p-8">
        {activeTab === 'organizer' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 flex items-center gap-2">
              <EventIcon />
              Your Events
            </h2>

            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Add New Event</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Name *</label>
                  <input
                    type="text"
                    value={newEvent.name}
                    onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Tech Conference 2023"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Audience Size</label>
                  <input
                    type="text"
                    value={newEvent.audienceSize}
                    onChange={(e) => setNewEvent({ ...newEvent, audienceSize: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows={3}
                    placeholder="Describe your event..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sponsorship Needs</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {sponsorshipOptions.map((option) => (
                      <div key={option.id} className="flex items-center">
                        <input
                          id={`sponsorship-${option.id}`}
                          type="checkbox"
                          checked={newEvent.sponsorshipNeeds.includes(option.id)}
                          onChange={() => handleSponsorshipNeedChange(option.id)}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`sponsorship-${option.id}`} className="ml-2 text-sm text-gray-700">
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={handleAddEvent}
                disabled={isLoading.addEvent}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-70"
              >
                {isLoading.addEvent ? 'Adding...' : 'Add Event'}
              </button>
            </div>

            {isLoading.events ? (
              <LoadingSpinner />
            ) : events.length === 0 ? (
              <EmptyState 
                icon="📅" 
                message="You haven't created any events yet." 
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <AnimatePresence>
                  {events.map((event) => (
                    <motion.div
                      key={event._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="p-4 md:p-6">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-bold text-gray-800">{event.name}</h3>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{event.date} • {event.location}</p>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{event.description}</p>
                        <div className="mt-3">
                          <p className="text-xs font-medium text-gray-700">Audience: {event.audienceSize || 'Not specified'}</p>
                          {event.sponsorshipNeeds?.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-medium text-gray-700">Sponsorship Needs:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {event.sponsorshipNeeds.map(need => (
                                  <span key={need} className="bg-gray-100 px-2 py-1 rounded text-xs">
                                    {sponsorshipOptions.find(o => o.id === need)?.label || need}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        ) : activeTab === 'sponsor' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6 flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Industry</label>
                <select
                  value={filters.industry}
                  onChange={(e) => handleFilterChange('industry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">All Industries</option>
                  <option value="Technology">Technology</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Budget</label>
                <select
                  value={filters.budget}
                  onChange={(e) => handleFilterChange('budget', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">All Budgets</option>
                  <option value="1000-5000">$1,000 - $5,000</option>
                  <option value="5000-15000">$5,000 - $15,000</option>
                  <option value="15000+">$15,000+</option>
                </select>
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 flex items-center gap-2">
              <BusinessIcon />
              Potential Sponsors
            </h2>

            {isLoading.sponsors ? (
              <LoadingSpinner />
            ) : sponsors.length === 0 ? (
              <EmptyState 
                icon="🏢" 
                message="No sponsors available at the moment. Check back later!" 
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <AnimatePresence>
                  {sponsors.map((sponsor) => (
                    <motion.div
                      key={sponsor._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md overflow-hidden border border-gray-200 hover:shadow-md md:hover:shadow-lg transition-shadow duration-200"
                    >
                      <div className="p-4 md:p-6">
                        <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                          <img 
                            src={sponsor.logo} 
                            alt={sponsor.name}
                            className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-contain border border-gray-200 p-1"
                          />
                          <div>
                            <h3 className="text-lg md:text-xl font-bold text-gray-800">{sponsor.name}</h3>
                            <p className="text-xs md:text-sm text-gray-500">{sponsor.industry}</p>
                          </div>
                        </div>

                        <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                          <div className="flex items-start text-xs md:text-sm">
                            <span className="mr-2">💰</span>
                            <span className="text-gray-700">
                              <strong>Budget:</strong> {sponsor.budget}
                            </span>
                          </div>
                          <div className="flex items-start text-xs md:text-sm">
                            <span className="mr-2">📌</span>
                            <span className="text-gray-700">
                              <strong>Prefers:</strong> {sponsor.preferredEvents?.join(', ') || 'Various'}
                            </span>
                          </div>
                          <div className="flex items-start text-xs md:text-sm">
                            <span className="mr-2">👤</span>
                            <span className="text-gray-700 line-clamp-1">
                              <strong>Contact:</strong> {sponsor.contactPerson || 'Not specified'}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 md:mt-4 flex flex-col gap-2 md:gap-3">
                          <a 
                            href={`mailto:${sponsor.email}`}
                            className="w-full px-3 py-1 md:px-4 md:py-2 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors"
                          >
                            <EmailIcon />
                            Contact Sponsor
                          </a>
                          <button
                            onClick={() => {
                              setSelectedSponsor(sponsor);
                              setNewProposal(prev => ({
                                ...prev,
                                sponsorId: sponsor._id
                              }));
                            }}
                            className="w-full px-3 py-1 md:px-4 md:py-2 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-100 transition-colors"
                          >
                            <MoneyIcon />
                            Send Proposal
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6 flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 flex items-center gap-2">
              <EmailIcon />
              Your Proposals
            </h2>

            {isLoading.proposals ? (
              <LoadingSpinner />
            ) : proposals.length === 0 ? (
              <EmptyState 
                icon="📨" 
                message="You haven't sent any proposals yet." 
              />
            ) : (
              <div className="space-y-4">
                {proposals.map((proposal) => (
                  <motion.div
                    key={proposal._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">
                          Proposal for {proposal.event?.name || 'Event'}
                        </h3>
                        <p className="text-gray-600">To: {proposal.sponsor?.name || 'Sponsor'}</p>
                      </div>
                      <StatusBadge status={proposal.status} />
                    </div>
                    <div className="mt-3">
                      <p className="text-gray-700">{proposal.offerDetails}</p>
                      <p className="font-semibold mt-2">Amount: {proposal.amount}</p>
                      {proposal.benefits?.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">Benefits Offered:</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {proposal.benefits.map(benefit => (
                              <span key={benefit} className="bg-gray-100 px-2 py-1 rounded text-sm">
                                {benefitOptions.find(o => o.id === benefit)?.label || benefit}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {selectedSponsor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Create Proposal for {selectedSponsor.name}</h2>
              <button 
                onClick={() => setSelectedSponsor(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Event *</label>
                <select
                  value={newProposal.eventId}
                  onChange={(e) => setNewProposal({ ...newProposal, eventId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select an event</option>
                  {events.map(event => (
                    <option key={event._id} value={event._id}>{event.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Offer Details *</label>
                <textarea
                  value={newProposal.offerDetails}
                  onChange={(e) => setNewProposal({ ...newProposal, offerDetails: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={4}
                  placeholder="Describe your proposal details..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="text"
                  value={newProposal.amount}
                  onChange={(e) => setNewProposal({ ...newProposal, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g. $5,000 or Product Donation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Benefits Offered</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {benefitOptions.map((option) => (
                    <div key={option.id} className="flex items-center">
                      <input
                        id={`benefit-${option.id}`}
                        type="checkbox"
                        checked={newProposal.benefits.includes(option.id)}
                        onChange={() => {
                          setNewProposal(prev => ({
                            ...prev,
                            benefits: prev.benefits.includes(option.id)
                              ? prev.benefits.filter(id => id !== option.id)
                              : [...prev.benefits, option.id]
                          }));
                        }}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`benefit-${option.id}`} className="ml-2 text-sm text-gray-700">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setSelectedSponsor(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={createProposal}
                  disabled={isLoading.addProposal}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-70"
                >
                  {isLoading.addProposal ? 'Sending...' : 'Send Proposal'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default DreamSponsorApp;