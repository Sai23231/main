import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaBuilding, FaEnvelope, FaPhone } from 'react-icons/fa';

const VenueRegistrationSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <FaCheckCircle className="text-green-600 text-4xl" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Registration Successful!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Thank you for registering your venue with Dream Ventz. We're excited to have you on board!
          </p>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">What's Next?</h2>
            <div className="space-y-3 text-left">
              <div className="flex items-start">
                <FaEnvelope className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Email Verification</p>
                  <p className="text-xs text-gray-600">Check your email for verification link</p>
                </div>
              </div>
              <div className="flex items-start">
                <FaBuilding className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Profile Setup</p>
                  <p className="text-xs text-gray-600">Complete your venue profile and add photos</p>
                </div>
              </div>
              <div className="flex items-start">
                <FaPhone className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Support Contact</p>
                  <p className="text-xs text-gray-600">Our team will contact you within 24 hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/venue-login')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              Go to Venue Login
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full bg-transparent border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              Back to Home
            </button>
          </div>

          {/* Contact Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Need help? Contact us:</p>
            <p className="text-sm text-blue-600 font-medium">support@dreamventz.com</p>
            <p className="text-sm text-blue-600 font-medium">+91 98765 43210</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueRegistrationSuccess; 