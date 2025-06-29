import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { setLoggedInUser } from '../UserLogin/authSlice';
import { useDispatch } from 'react-redux';

const VenueLogin = () => {
  const [credentials, setCredentials] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    setError('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Make the login request
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/venue/login`,
        credentials, 
        { withCredentials: true }
      );

      const { data } = response;

      if (data.success) {
        // Store auth data with role information
        const venueWithRole = {
          ...data.venue,
          role: 'venue'
        };
        dispatch(setLoggedInUser(venueWithRole));
        
        // Show success message
        toast.success('Login successful!');
        
        // Navigate to the venue dashboard immediately
        navigate('/dashboard');
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      const errorMessage = 
      err.response?.data?.message || 
      err.message ||
      'An error occurred. Please check your connection and try again.';
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/path/to/your/background.jpg')] bg-cover bg-center flex items-center justify-center">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Dream Portal</h2>
        <h3 className="text-xl font-semibold text-center mb-6 text-gray-700">Venue Sign In</h3>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="text"
              name="identifier"
              value={credentials.identifier}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 border rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 transition-colors"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 border rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 transition-colors"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 ${
              isLoading 
                ? 'bg-blue-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-500'
            } text-white font-semibold rounded-md transition-colors text-lg`}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/venue-register" className="text-blue-600 hover:text-blue-500">
                Register here
              </a>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Are you an existing venue?{' '}
              <a href="/venue-claim" className="text-blue-600 hover:text-blue-500">
                Claim Your Business
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VenueLogin; 