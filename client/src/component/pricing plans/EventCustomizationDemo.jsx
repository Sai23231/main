import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CustomPackage from './CustomPackage';
import { FiGift, FiStar, FiUsers, FiMapPin, FiCalendar, FiHeart, FiArrowRight } from 'react-icons/fi';

export default function EventCustomizationDemo() {
  const [showCustomizer, setShowCustomizer] = useState(false);

  const features = [
    {
      icon: <FiGift className="w-8 h-8" />,
      title: "Custom Event Packages",
      description: "Build your perfect event with our intuitive package builder"
    },
    {
      icon: <FiStar className="w-8 h-8" />,
      title: "Premium Services",
      description: "Choose from top-rated vendors and premium service options"
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: "Guest Management",
      description: "Easy guest count management and accommodation planning"
    },
    {
      icon: <FiMapPin className="w-8 h-8" />,
      title: "Venue Selection",
      description: "Find the perfect venue from our curated collection"
    },
    {
      icon: <FiCalendar className="w-8 h-8" />,
      title: "Flexible Scheduling",
      description: "Choose your preferred date and time with real-time availability"
    },
    {
      icon: <FiHeart className="w-8 h-8" />,
      title: "Personalized Experience",
      description: "Every event is unique - customize every detail to your preference"
    }
  ];

  const eventTypes = [
    { name: "Wedding", count: "500+", color: "from-pink-500 to-red-500" },
    { name: "Birthday", count: "300+", color: "from-purple-500 to-pink-500" },
    { name: "Corporate", count: "200+", color: "from-blue-500 to-indigo-500" },
    { name: "Social", count: "150+", color: "from-green-500 to-emerald-500" }
  ];

  if (showCustomizer) {
    return <CustomPackage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <FiGift className="text-white text-sm" />
                </div>
                <span className="text-xl font-bold text-gray-900">DreamVentz</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                Home
              </Link>
              <button
                onClick={() => setShowCustomizer(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
              >
                Start Planning
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Plan Your Perfect Event
            <span className="block gradient-text">Like Never Before</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Experience the future of event planning with our MakeMyTrip-style customization platform. 
            Build your dream event step by step with transparent pricing and premium services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowCustomizer(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <span>Start Building Your Event</span>
              <FiArrowRight className="w-5 h-5" />
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-bold text-lg hover:border-pink-300 hover:text-pink-600 transition-all duration-200">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Event Customizer?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built with modern design principles and user experience in mind
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 card-hover">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Types Section */}
      <section className="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Event Types
            </h2>
            <p className="text-xl text-gray-600">
              We've helped plan thousands of successful events
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {eventTypes.map((event, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 card-hover">
                <div className={`w-12 h-12 bg-gradient-to-r ${event.color} rounded-lg flex items-center justify-center text-white mb-4`}>
                  <FiGift className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{event.name}</h3>
                <p className="text-2xl font-bold gradient-text">{event.count}</p>
                <p className="text-sm text-gray-600">Events Planned</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Create Your Perfect Event?
          </h2>
          <p className="text-xl text-pink-100 mb-8">
            Join thousands of happy customers who've planned their dream events with us
          </p>
          <button
            onClick={() => setShowCustomizer(true)}
            className="bg-white text-pink-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center mx-auto space-x-2"
          >
            <span>Start Planning Now</span>
            <FiArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <FiGift className="text-white text-sm" />
                </div>
                <span className="text-xl font-bold">DreamVentz</span>
              </div>
              <p className="text-gray-400">
                Making your dream events a reality with modern technology and exceptional service.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Wedding Planning</li>
                <li>Corporate Events</li>
                <li>Birthday Celebrations</li>
                <li>Social Gatherings</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>FAQs</li>
                <li>Live Chat</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DreamVentz. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 