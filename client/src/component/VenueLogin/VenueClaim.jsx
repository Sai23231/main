import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaBuilding, FaInfoCircle } from 'react-icons/fa';

const VenueClaim = () => {
  const [venueId, setVenueId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/venue/claim`, {
        venueId,
        email,
        password
      });
      if (response.data.success) {
        toast.success('Venue claimed! You can now log in.');
        navigate('/venue-login');
      } else {
        toast.error(response.data.message || 'Failed to claim venue');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to claim venue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <FaBuilding className="text-blue-600 text-3xl" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Claim Your Venue</h2>
          <p className="text-gray-600 mt-2">Access your venue dashboard and manage your listings</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Venue ID</label>
            <input
              type="text"
              value={venueId}
              onChange={e => setVenueId(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              placeholder="Enter your Venue ID (ask admin if unsure)"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Business Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              placeholder="Enter your business email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Set Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              placeholder="Set a password for your account"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Claiming...' : 'Claim Venue'}
          </button>
        </form>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start">
            <FaInfoCircle className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900">Need help?</h4>
              <p className="text-sm text-blue-700 mt-1">
                Contact admin for your Venue ID if you're unsure. This process is for venues already listed on our platform.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have a venue listed?{' '}
            <a href="/venue-registration" className="text-blue-600 hover:text-blue-500">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VenueClaim; 