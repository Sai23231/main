import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaClock, FaEnvelope, FaUserTie, FaTachometerAlt } from 'react-icons/fa';

const VendorRegistrationSuccess = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-12 text-center">
            <div className="flex justify-center mb-4">
              <FaCheckCircle className="text-6xl text-green-200" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Registration Submitted!</h1>
            <p className="text-green-100 text-lg">
              Your vendor profile has been successfully submitted for review
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            <div className="space-y-6">
              {/* What happens next */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                  <FaClock className="mr-2" />
                  What Happens Next?
                </h2>
                <div className="space-y-3 text-blue-700">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p>Our admin team will review your registration within 24-48 hours</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p>You'll receive an email notification once your account is approved</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p>Once approved, you can log in and access your vendor dashboard</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p>You'll be able to manage bookings, update your profile, and respond to customer inquiries</p>
                  </div>
                </div>
              </div>

              {/* Dashboard features */}
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                  <FaTachometerAlt className="mr-2" />
                  Your Dashboard Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-green-700">
                  <div className="flex items-center">
                    <FaCheckCircle className="mr-2 text-green-600" />
                    <span>View and manage booking requests</span>
                  </div>
                  <div className="flex items-center">
                    <FaCheckCircle className="mr-2 text-green-600" />
                    <span>Update your profile and services</span>
                  </div>
                  <div className="flex items-center">
                    <FaCheckCircle className="mr-2 text-green-600" />
                    <span>Respond to customer inquiries</span>
                  </div>
                  <div className="flex items-center">
                    <FaCheckCircle className="mr-2 text-green-600" />
                    <span>Track your business performance</span>
                  </div>
                </div>
              </div>

              {/* Contact info */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FaEnvelope className="mr-2" />
                  Need Help?
                </h2>
                <p className="text-gray-600 mb-3">
                  If you have any questions about your registration or need assistance, please contact us:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Email:</strong> support@dreamventz.com</p>
                  <p><strong>Phone:</strong> +91 98765 43210</p>
                  <p><strong>Response Time:</strong> Within 24 hours</p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200 mt-8">
              <Link
                to="/"
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium text-center hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <FaUserTie className="mr-2" />
                Back to Home
              </Link>
              <Link
                to="/vendorlogin"
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium text-center hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <FaTachometerAlt className="mr-2" />
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorRegistrationSuccess; 