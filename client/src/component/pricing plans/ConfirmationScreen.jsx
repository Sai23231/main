import React from 'react';
import { FiCheck, FiChevronRight, FiPhone, FiMail } from 'react-icons/fi';

export default function ConfirmationScreen({ form, setStep, setConfirmed, user, setForm, getEventTypeColor }) {
  const eventType = form.CONFIG.eventTypes.find(e => e.id === form.eventType)?.name;
  return (
    <div className="max-w-md mx-auto p-0 md:p-0">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-pink-100 text-center">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
          <FiCheck className="text-white text-4xl md:text-5xl" />
        </div>
        <h2 className="text-3xl font-extrabold mb-4 text-pink-600">Request Submitted!</h2>
        <p className="text-gray-600 text-base mb-6">
          Our team is creating a customized package for your <span className="font-semibold text-pink-600">{eventType}</span> event in <span className="font-semibold text-pink-600">{form.location}</span>.<br/>
          We'll contact you within <span className="font-semibold">24 hours</span> with options!
        </p>
        <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-4 md:p-6 rounded-lg md:rounded-xl mb-4 md:mb-6 border border-pink-100">
          <h3 className="font-semibold text-gray-700 mb-2 text-base">What's Next?</h3>
          <ul className="text-left text-sm text-gray-600 space-y-2">
            <li className="flex items-center"><FiChevronRight className="mr-2 text-pink-500" /> Personalized vendor options</li>
            <li className="flex items-center"><FiChevronRight className="mr-2 text-pink-500" /> Detailed pricing breakdown</li>
            <li className="flex items-center"><FiChevronRight className="mr-2 text-pink-500" /> 3-5 complete package options</li>
            <li className="flex items-center"><FiChevronRight className="mr-2 text-pink-500" /> 24-hour response time guaranteed</li>
          </ul>
        </div>
        <div className="bg-pink-50 p-4 md:p-6 rounded-lg md:rounded-xl mb-6 border border-pink-100">
          <h3 className="font-semibold text-gray-700 mb-2 text-base">Need immediate assistance?</h3>
          <div className="flex flex-col space-y-1 text-base">
            <a href="tel:+919876543210" className="flex items-center justify-center text-pink-600 font-semibold">
              <FiPhone className="mr-2" /> +91 98765 43210
            </a>
            <a href="mailto:events@example.com" className="flex items-center justify-center text-pink-600 font-semibold">
              <FiMail className="mr-2" /> events@example.com
            </a>
          </div>
        </div>
        <button 
          onClick={() => {
            setStep(1);
            setConfirmed(false);
            setForm({
              eventType: '',
              date: '',
              startTime: '',
              endTime: '',
              location: '',
              guests: 50,
              needsVenue: false,
              contactInfo: {
                name: user?.name || '',
                email: user?.email || '',
                phone: user?.phone || ''
              },
              venueDetails: {
                type: '',
                amenities: []
              },
              selectedServices: {
                catering: { type: '', package: '' },
                decor: { theme: '' },
                photography: { package: '' },
                entertainment: [],
                other: []
              },
              notes: '',
              termsAccepted: false,
              CONFIG: form.CONFIG
            });
          }}
          className="px-8 py-3 bg-gradient-to-br from-pink-500 to-pink-400 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
        >
          Plan Another Event
        </button>
      </div>
      {/* Anchor for programmatic scroll */}
      <div id="confirmation-anchor"></div>
    </div>
  );
} 