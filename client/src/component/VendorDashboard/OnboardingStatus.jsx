import React from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaClock, FaEdit, FaUpload, FaInfoCircle } from 'react-icons/fa';

const OnboardingStatus = ({ 
  status, 
  profileComplete, 
  portfolioComplete, 
  onCompleteProfile, 
  onCompletePortfolio,
  type = 'vendor' // 'vendor' or 'venue'
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'approved':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'rejected':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'approved':
        return <FaCheckCircle className="text-green-500" />;
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'rejected':
        return <FaExclamationTriangle className="text-red-500" />;
      default:
        return <FaInfoCircle className="text-gray-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'approved':
        return 'Your account has been approved! You can now receive bookings.';
      case 'pending':
        return 'Your registration is under review. You\'ll receive an email notification once approved.';
      case 'rejected':
        return 'Your registration was not approved. Please contact support for more information.';
      default:
        return 'Your account status is being processed.';
    }
  };

  const getCompletionSteps = () => {
    const steps = [
      {
        id: 'profile',
        title: 'Complete Profile',
        description: 'Add your basic information and contact details',
        complete: profileComplete,
        action: onCompleteProfile
      },
      {
        id: 'portfolio',
        title: 'Upload Portfolio',
        description: `Add photos and showcase your ${type === 'vendor' ? 'work' : 'venue'}`,
        complete: portfolioComplete,
        action: onCompletePortfolio
      }
    ];

    if (status === 'approved') {
      steps.push({
        id: 'approved',
        title: 'Account Approved',
        description: 'You can now receive bookings and manage your business',
        complete: true,
        action: null
      });
    }

    return steps;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Status Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {type === 'vendor' ? 'Vendor' : 'Venue'} Onboarding Status
            </h2>
            <p className="text-gray-600">Complete your profile to start receiving bookings</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium bg-${getStatusColor()}-100 text-${getStatusColor()}-800`}>
          {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Processing'}
        </div>
      </div>

      {/* Status Message */}
      <div className={`bg-${getStatusColor()}-50 border-l-4 border-${getStatusColor()}-400 p-4 mb-6`}>
        <div className="flex">
          {getStatusIcon()}
          <div className="ml-3">
            <p className={`text-${getStatusColor()}-700`}>
              {getStatusMessage()}
            </p>
          </div>
        </div>
      </div>

      {/* Completion Steps */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-800">Completion Steps</h3>
        {getCompletionSteps().map((step, index) => (
          <div key={step.id} className="flex items-center space-x-4 p-4 border rounded-lg">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              step.complete 
                ? 'bg-green-100 text-green-600' 
                : 'bg-gray-100 text-gray-400'
            }`}>
              {step.complete ? (
                <FaCheckCircle className="w-5 h-5" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            <div className="flex-1">
              <h4 className={`font-medium ${
                step.complete ? 'text-green-800' : 'text-gray-800'
              }`}>
                {step.title}
              </h4>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
            {step.action && !step.complete && (
              <button
                onClick={step.action}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {step.id === 'profile' ? <FaEdit /> : <FaUpload />}
                <span>Complete</span>
              </button>
            )}
            {step.complete && (
              <div className="flex items-center text-green-600">
                <FaCheckCircle className="w-5 h-5" />
                <span className="ml-2 text-sm font-medium">Completed</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Profile Completion</span>
          <span>{Math.round(((profileComplete ? 1 : 0) + (portfolioComplete ? 1 : 0)) / 2 * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${((profileComplete ? 1 : 0) + (portfolioComplete ? 1 : 0)) / 2 * 100}%` 
            }}
          ></div>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start">
          <FaInfoCircle className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-900">Need Help?</h4>
            <p className="text-sm text-blue-700 mt-1">
              If you need assistance completing your profile or have questions about the approval process, 
              please contact our support team.
            </p>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingStatus; 