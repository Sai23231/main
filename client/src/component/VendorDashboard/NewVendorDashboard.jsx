import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VendorProfile from './VendorProfile';
import VendorServices from './VendorServices';

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-pink-50">
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
              onClick={() => setActiveTab('profile')}
              className={`${
                activeTab === 'profile'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`${
                activeTab === 'services'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              My Services
            </button>
          </nav>
        </div>

        {/* Content Section */}
        <div className="py-6">
          {activeTab === 'profile' && <VendorProfile />}
          {activeTab === 'services' && <VendorServices />}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard; 