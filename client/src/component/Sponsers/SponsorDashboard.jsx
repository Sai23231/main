import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, FiEdit, FiSave, FiX, FiPlus, FiTrash2, FiEye, 
  FiCheckCircle, FiXCircle, FiDollarSign, FiBriefcase, 
  FiCalendar, FiMapPin, FiMail, FiPhone, FiGlobe,
  FiPackage, FiTarget, FiTrendingUp, FiMessageSquare
} from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { selectLoggedInUser } from '../UserLogin/authSlice';

const SponsorDashboard = () => {
  const [sponsorProfile, setSponsorProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [proposals, setProposals] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [showAddDeliverable, setShowAddDeliverable] = useState(false);
  const [showAddLevel, setShowAddLevel] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    budget: '',
    companyDescription: '',
    website: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    targetAudience: '',
    preferredEventTypes: [],
    deliverables: [],
    sponsorshipLevels: [],
    isActive: true
  });

  const [newDeliverable, setNewDeliverable] = useState({
    type: 'financial',
    description: '',
    value: ''
  });

  const [newLevel, setNewLevel] = useState({
    name: '',
    amount: '',
    benefits: ['']
  });

  // Use Redux auth state
  const user = useSelector(selectLoggedInUser);
  const isAuthenticated = !!user;

  const eventTypes = [
    'wedding', 'corporate', 'birthday', 'anniversary', 'graduation', 'other'
  ];

  const deliverableTypes = [
    { value: 'financial', label: 'Financial Support' },
    { value: 'in-kind', label: 'In-Kind Services' },
    { value: 'services', label: 'Professional Services' },
    { value: 'products', label: 'Products' },
    { value: 'marketing', label: 'Marketing Support' },
    { value: 'other', label: 'Other' }
  ];

  // Fetch sponsor profile and proposals
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return;
      
      setIsLoading(true);
      try {
        // Fetch sponsor profile
        const profileRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/sponsor/sponsorInfo`, {
          withCredentials: true
        });
        
        if (profileRes.data) {
          setSponsorProfile(profileRes.data);
          setFormData({
            name: profileRes.data.name || '',
            industry: profileRes.data.industry || '',
            budget: profileRes.data.budget || '',
            companyDescription: profileRes.data.companyDescription || '',
            website: profileRes.data.website || '',
            contactEmail: profileRes.data.contactEmail || '',
            contactPhone: profileRes.data.contactPhone || '',
            address: profileRes.data.address || '',
            targetAudience: profileRes.data.targetAudience || '',
            preferredEventTypes: profileRes.data.preferredEventTypes || [],
            deliverables: profileRes.data.deliverables || [],
            sponsorshipLevels: profileRes.data.sponsorshipLevels || [],
            isActive: profileRes.data.isActive !== undefined ? profileRes.data.isActive : true
          });
        }

        // Fetch proposals
        const proposalsRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/proposal/sponsorProposals`, {
          withCredentials: true
        });
        setProposals(proposalsRes.data || []);
      } catch (err) {
        console.error('Error fetching data', err);
        if (err.response?.status === 401) {
          window.location.href = '/userlogin';
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [isAuthenticated]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEventTypeChange = (eventType) => {
    setFormData(prev => ({
      ...prev,
      preferredEventTypes: prev.preferredEventTypes.includes(eventType)
        ? prev.preferredEventTypes.filter(type => type !== eventType)
        : [...prev.preferredEventTypes, eventType]
    }));
  };

  const saveProfile = async () => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/sponsor/sponsorInfo`, formData, {
        withCredentials: true
      });
      setSponsorProfile(res.data);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile', err);
      alert('Failed to update profile');
    }
  };

  const createProfile = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/sponsor/create`, formData, {
        withCredentials: true
      });
      setSponsorProfile(res.data);
      setIsEditing(false);
      alert('Profile created successfully!');
    } catch (err) {
      console.error('Error creating profile', err);
      alert('Failed to create profile');
    }
  };

  const addDeliverable = () => {
    if (!newDeliverable.description) {
      alert('Please provide a description for the deliverable');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      deliverables: [...prev.deliverables, { ...newDeliverable }]
    }));
    setNewDeliverable({ type: 'financial', description: '', value: '' });
    setShowAddDeliverable(false);
  };

  const removeDeliverable = (index) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.filter((_, i) => i !== index)
    }));
  };

  const addSponsorshipLevel = () => {
    if (!newLevel.name || !newLevel.amount) {
      alert('Please provide name and amount for the sponsorship level');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      sponsorshipLevels: [...prev.sponsorshipLevels, { ...newLevel }]
    }));
    setNewLevel({ name: '', amount: '', benefits: [''] });
    setShowAddLevel(false);
  };

  const removeSponsorshipLevel = (index) => {
    setFormData(prev => ({
      ...prev,
      sponsorshipLevels: prev.sponsorshipLevels.filter((_, i) => i !== index)
    }));
  };

  const addBenefit = (levelIndex) => {
    setNewLevel(prev => ({
      ...prev,
      benefits: [...prev.benefits, '']
    }));
  };

  const updateBenefit = (levelIndex, benefitIndex, value) => {
    setNewLevel(prev => ({
      ...prev,
      benefits: prev.benefits.map((benefit, i) => i === benefitIndex ? value : benefit)
    }));
  };

  const removeBenefit = (levelIndex, benefitIndex) => {
    setNewLevel(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== benefitIndex)
    }));
  };

  const respondToProposal = async (proposalId, status) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/proposal/${proposalId}/respond`, {
        status
      }, {
        withCredentials: true
      });
      
      // Update local state
      setProposals(prev => prev.map(proposal => 
        proposal._id === proposalId 
          ? { ...proposal, status }
          : proposal
      ));
      
      alert(`Proposal ${status === 'accepted' ? 'accepted' : 'rejected'} successfully!`);
    } catch (err) {
      console.error('Error responding to proposal', err);
      alert('Failed to respond to proposal');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            Please log in to access your sponsor dashboard.
          </p>
          <button 
            onClick={() => window.location.href = '/userlogin'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-blue-600">Sponsor Dashboard</h1>
              {sponsorProfile && (
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${sponsorProfile.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm text-gray-600">
                    {sponsorProfile.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              )}
            </div>
            
            {user && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <FiUser className="text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">{user.name || user.email?.split('@')[0]}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'profile' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FiUser className="inline mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('proposals')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'proposals' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FiMessageSquare className="inline mr-2" />
              Proposals ({proposals.length})
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Profile Section */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Company Profile</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <FiEdit className="mr-2" />
                      {sponsorProfile ? 'Edit Profile' : 'Create Profile'}
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={sponsorProfile ? saveProfile : createProfile}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                      >
                        <FiSave className="mr-2" />
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                      >
                        <FiX className="mr-2" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter company name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
                        <input
                          type="text"
                          name="industry"
                          value={formData.industry}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Technology, Fashion, Food"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range *</label>
                        <input
                          type="text"
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., $5,000 - $10,000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://yourcompany.com"
                        />
                      </div>
                    </div>

                    {/* Company Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
                      <textarea
                        name="companyDescription"
                        value={formData.companyDescription}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tell us about your company and what makes you unique..."
                      />
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                        <input
                          type="email"
                          name="contactEmail"
                          value={formData.contactEmail}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="contact@company.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                        <input
                          type="tel"
                          name="contactPhone"
                          value={formData.contactPhone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your business address"
                      />
                    </div>

                    {/* Target Audience */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                      <input
                        type="text"
                        name="targetAudience"
                        value={formData.targetAudience}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Young professionals, Families, Students"
                      />
                    </div>

                    {/* Preferred Event Types */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Event Types</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {eventTypes.map((type) => (
                          <label key={type} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.preferredEventTypes.includes(type)}
                              onChange={() => handleEventTypeChange(type)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 capitalize">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Deliverables Section */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <label className="block text-sm font-medium text-gray-700">Deliverables</label>
                        <button
                          onClick={() => setShowAddDeliverable(true)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
                        >
                          <FiPlus className="mr-1" />
                          Add Deliverable
                        </button>
                      </div>
                      
                      {formData.deliverables.length > 0 && (
                        <div className="space-y-3">
                          {formData.deliverables.map((deliverable, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                                    {deliverable.type}
                                  </span>
                                  <span className="font-medium">{deliverable.description}</span>
                                  {deliverable.value && (
                                    <span className="text-gray-600">({deliverable.value})</span>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => removeDeliverable(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Sponsorship Levels */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <label className="block text-sm font-medium text-gray-700">Sponsorship Levels</label>
                        <button
                          onClick={() => setShowAddLevel(true)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
                        >
                          <FiPlus className="mr-1" />
                          Add Level
                        </button>
                      </div>
                      
                      {formData.sponsorshipLevels.length > 0 && (
                        <div className="space-y-4">
                          {formData.sponsorshipLevels.map((level, index) => (
                            <div key={index} className="p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">{level.name}</span>
                                  <span className="text-blue-600 font-semibold">{level.amount}</span>
                                </div>
                                <button
                                  onClick={() => removeSponsorshipLevel(index)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <FiTrash2 />
                                </button>
                              </div>
                              {level.benefits && level.benefits.length > 0 && (
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {level.benefits.map((benefit, benefitIndex) => (
                                    <li key={benefitIndex} className="flex items-center">
                                      <FiCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                                      {benefit}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Active Status */}
                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleInputChange}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Active Profile</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        When active, event organizers can see your profile and send proposals
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {sponsorProfile ? (
                      <>
                        {/* Profile Display */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{sponsorProfile.name}</h3>
                            <p className="text-gray-600 mb-4">{sponsorProfile.industry}</p>
                            {sponsorProfile.companyDescription && (
                              <p className="text-gray-700 mb-4">{sponsorProfile.companyDescription}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            {sponsorProfile.website && (
                              <div className="flex items-center text-sm">
                                <FiGlobe className="mr-2 text-gray-400" />
                                <a href={sponsorProfile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                  {sponsorProfile.website}
                                </a>
                              </div>
                            )}
                            {sponsorProfile.contactEmail && (
                              <div className="flex items-center text-sm">
                                <FiMail className="mr-2 text-gray-400" />
                                <span>{sponsorProfile.contactEmail}</span>
                              </div>
                            )}
                            {sponsorProfile.contactPhone && (
                              <div className="flex items-center text-sm">
                                <FiPhone className="mr-2 text-gray-400" />
                                <span>{sponsorProfile.contactPhone}</span>
                              </div>
                            )}
                            {sponsorProfile.address && (
                              <div className="flex items-center text-sm">
                                <FiMapPin className="mr-2 text-gray-400" />
                                <span>{sponsorProfile.address}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Deliverables Display */}
                        {sponsorProfile.deliverables && sponsorProfile.deliverables.length > 0 && (
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Deliverables</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {sponsorProfile.deliverables.map((deliverable, index) => (
                                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                                      {deliverable.type}
                                    </span>
                                  </div>
                                  <p className="font-medium">{deliverable.description}</p>
                                  {deliverable.value && (
                                    <p className="text-sm text-gray-600">{deliverable.value}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Sponsorship Levels Display */}
                        {sponsorProfile.sponsorshipLevels && sponsorProfile.sponsorshipLevels.length > 0 && (
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Sponsorship Levels</h4>
                            <div className="space-y-3">
                              {sponsorProfile.sponsorshipLevels.map((level, index) => (
                                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">{level.name}</span>
                                    <span className="text-blue-600 font-semibold">{level.amount}</span>
                                  </div>
                                  {level.benefits && level.benefits.length > 0 && (
                                    <ul className="text-sm text-gray-600 space-y-1">
                                      {level.benefits.map((benefit, benefitIndex) => (
                                        <li key={benefitIndex} className="flex items-center">
                                          <FiCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                                          {benefit}
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <FiBriefcase className="text-4xl text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Profile Created</h3>
                        <p className="text-gray-600 mb-4">
                          Create your sponsor profile to start receiving proposals from event organizers.
                        </p>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Create Profile
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'proposals' && (
            <motion.div
              key="proposals"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Proposals</h2>
                
                {proposals.length > 0 ? (
                  <div className="space-y-4">
                    {proposals.map((proposal) => (
                      <div key={proposal._id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{proposal.event?.eventName}</h3>
                            <p className="text-gray-600">From: {proposal.event?.organizerName}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              proposal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              proposal.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Event Type</p>
                            <p className="font-medium">{proposal.event?.eventType}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Proposed Amount</p>
                            <p className="font-medium">${proposal.amount}</p>
                          </div>
                        </div>
                        
                        {proposal.message && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-1">Message</p>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{proposal.message}</p>
                          </div>
                        )}
                        
                        {proposal.status === 'pending' && (
                          <div className="flex space-x-3">
                            <button
                              onClick={() => respondToProposal(proposal._id, 'accepted')}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                            >
                              <FiCheckCircle className="mr-2" />
                              Accept
                            </button>
                            <button
                              onClick={() => respondToProposal(proposal._id, 'rejected')}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                            >
                              <FiXCircle className="mr-2" />
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FiMessageSquare className="text-4xl text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Proposals Yet</h3>
                    <p className="text-gray-600">
                      When event organizers send you proposals, they will appear here.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Deliverable Modal */}
      {showAddDeliverable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Deliverable</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={newDeliverable.type}
                  onChange={(e) => setNewDeliverable(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {deliverableTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={newDeliverable.description}
                  onChange={(e) => setNewDeliverable(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe what you can deliver..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Value (Optional)</label>
                <input
                  type="text"
                  value={newDeliverable.value}
                  onChange={(e) => setNewDeliverable(prev => ({ ...prev, value: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., $5000, 100 units, etc."
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={addDeliverable}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddDeliverable(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Sponsorship Level Modal */}
      {showAddLevel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Sponsorship Level</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level Name *</label>
                <input
                  type="text"
                  value={newLevel.name}
                  onChange={(e) => setNewLevel(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Gold Sponsor, Platinum Partner"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
                <input
                  type="text"
                  value={newLevel.amount}
                  onChange={(e) => setNewLevel(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., $10,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
                {newLevel.benefits.map((benefit, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => updateBenefit(0, index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter benefit..."
                    />
                    {newLevel.benefits.length > 1 && (
                      <button
                        onClick={() => removeBenefit(0, index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800"
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addBenefit(0)}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <FiPlus className="mr-1" />
                  Add Benefit
                </button>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={addSponsorshipLevel}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddLevel(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SponsorDashboard;
