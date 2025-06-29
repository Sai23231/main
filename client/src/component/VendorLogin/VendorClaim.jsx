import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const VendorClaim = () => {
  const [vendorId, setVendorId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/vendor/claim`, {
        vendorId,
        email,
        password
      });
      if (response.data.success) {
        toast.success('Business claimed! You can now log in.');
        navigate('/vendorlogin');
      } else {
        toast.error(response.data.message || 'Failed to claim business');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to claim business');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Claim Your Business</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Vendor ID</label>
            <input
              type="text"
              value={vendorId}
              onChange={e => setVendorId(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              placeholder="Enter your Vendor ID (ask admin if unsure)"
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
            {isLoading ? 'Claiming...' : 'Claim Business'}
          </button>
        </form>
        <p className="text-sm text-center text-gray-500 mt-4">
          Need help? Contact admin for your Vendor ID.
        </p>
      </div>
    </div>
  );
};

export default VendorClaim; 