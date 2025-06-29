import React from 'react';
import { FiCheck, FiGift, FiHome, FiStar, FiCreditCard } from 'react-icons/fi';

export default function ProgressBar({ step }) {
  const steps = [
    { id: 1, name: 'Event Basics', icon: <FiGift />, description: 'Event details' },
    { id: 2, name: 'Venue Choice', icon: <FiHome />, description: 'Venue preference' },
    { id: 3, name: 'Venue/Services', icon: <FiStar />, description: 'Selection' },
    { id: 4, name: 'Services/Review', icon: <FiStar />, description: 'Add-ons & review' },
    { id: 5, name: 'Payment', icon: <FiCreditCard />, description: 'Payment & confirm' }
  ];

  const currentStepIndex = step - 1;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        {steps.map((stepItem, index) => (
          <div key={stepItem.id} className="flex items-center">
            {/* Step Column: fixed width, center everything */}
            <div className="flex flex-col items-center min-w-[80px] max-w-[90px] h-[80px] justify-between">
              <div
                className={`w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  index < currentStepIndex
                    ? 'bg-green-500 text-white shadow-lg'
                    : index === currentStepIndex
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg scale-110'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index < currentStepIndex ? (
                  <FiCheck className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                ) : (
                  <div className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 flex items-center justify-center">
                    {stepItem.icon}
                  </div>
                )}
              </div>
              {/* Step Label: no wrap, fixed height */}
              <div className="mt-1 md:mt-2 text-center flex flex-col justify-center h-[40px]">
                <p className={`text-xs font-medium whitespace-nowrap ${
                  index <= currentStepIndex ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {stepItem.name}
                </p>
                <p className={`text-xs whitespace-nowrap ${
                  index <= currentStepIndex ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {stepItem.description}
                </p>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-1 md:mx-2 lg:mx-4">
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ease-out ${
                      index < currentStepIndex
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                    }`}
                    style={{
                      width: index < currentStepIndex ? '100%' : '0%'
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress Percentage */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Step {step} of {steps.length}</span>
        <span>{Math.round((step / steps.length) * 100)}% Complete</span>
      </div>
    </div>
  );
} 