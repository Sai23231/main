import React, { useState } from 'react';
import { FiStar, FiCheck, FiUsers, FiCalendar, FiMapPin, FiArrowRight, FiHeart, FiGift } from 'react-icons/fi';
import { useSelector } from "react-redux";
import { selectLoggedInUser } from "../UserLogin/authSlice";
import { useNavigate } from "react-router-dom";

const Packages = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [guestSize, setGuestSize] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [expandedPackage, setExpandedPackage] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    location: '',
    notes: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const user = useSelector(selectLoggedInUser);
  const navigate = useNavigate();

  // Package data with image URLs
  const packages = {
    micro: [
      {
        id: 1,
        name: 'Campus Starter',
        emoji: '🎓',
        price: 9999,
        discountedPrice: 7999,
        type: 'college',
        for: 'College fests, workshops, seminars',
        includes: [
          'Basic stage platform with backdrop',
          '2-speaker sound system with mic',
          '3 sponsorship leads with contact',
          'Instagram & WhatsApp promotions',
          '1 dedicated event coordinator'
        ],
        guests: '0-50',
        popular: true,
        saving: 2000,
        fee: 999,
        details: [
          '2-hour setup time',
          'Basic sound check',
          '3 sponsorship proposals',
          '5 social media posts',
          '1 event coordinator'
        ],
        testimonials: [{ quote: "Perfect for our college tech fest!", author: "Rahul, IIT Bombay" }],
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        id: 2,
        name: 'Birthday Bliss',
        emoji: '🎂',
        price: 5999,
        type: 'birthday',
        for: 'Home birthdays, terrace parties',
        includes: [
          'Birthday banner & balloon decor',
          'Table and seating setup (up to 3 tables)',
          'Cake delivery from local vendor',
          '1-hour professional photography',
          'Custom-designed e-invitation'
        ],
        guests: '0-50',
        fee: 599,
        details: [
          '1.5-hour decor setup',
          'Up to 3 tables',
          'Cake delivery options',
          '1 hour photography',
          'Digital invitations'
        ],
        testimonials: [{ quote: "Super smooth birthday on our terrace!", author: "Priya, Borivali" }],
        image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        id: 3,
        name: 'Ghar Ki Party',
        emoji: '🏠',
        price: 4999,
        discountedPrice: 4499,
        type: 'family',
        for: 'Housewarming, small poojas',
        includes: [
          'Floral rangoli or toran decor',
          'Mandap or puja table setup',
          'Live puja streaming link setup',
          'Mini snacks counter arrangement',
          '2 custom invitation cards (digital)'
        ],
        guests: '0-40',
        fee: 499,
        details: [
          'Mandap decor (home-friendly)',
          'Live stream link setup',
          'Snack table setup',
          '2 digital invites'
        ],
        testimonials: [{ quote: "Ideal for our griha pravesh", author: "Kiran, Thane" }],
        image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      }
    ],
    mid: [
      {
        id: 4,
        name: 'Campus Pro',
        emoji: '🏫',
        price: 24999,
        discountedPrice: 21999,
        type: 'college',
        for: 'College fests, competitions',
        includes: [
          '6x8 ft stage with backdrop branding',
          '4-speaker sound + 2 wireless mics',
          '5+ active sponsor leads',
          '2 photographers for full event coverage',
          'Reels + campus branding online'
        ],
        guests: '50-150',
        popular: true,
        saving: 3000,
        fee: 1999,
        details: [
          '4-hour setup',
          'Professional sound system',
          '5+ sponsors',
          '2 photographers',
          '10 social media posts'
        ],
        testimonials: [
          { quote: "Our annual fest was a huge success!", author: "Ananya, SRM University" },
          { quote: "Got 7 sponsors through their network", author: "Vikram, BITS Pilani" }
        ],
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        id: 5,
        name: 'Wedding Memories',
        emoji: '💍',
        price: 34999,
        discountedPrice: 29999,
        type: 'wedding',
        for: 'Mandap weddings, engagement functions',
        includes: [
          'Thematic venue decor (floral + lights)',
          'Bridal makeup session by certified MUA',
          '1 full-day photography team',
          'Catering vendor coordination for 100 guests',
          'Pre-event call with planner for execution'
        ],
        guests: '50-150',
        saving: 5000,
        fee: 2499,
        details: [
          'Full-day coverage',
          'Professional photographer',
          'Catering for 100 guests',
          'Bridal makeup session',
          'Event timeline planning'
        ],
        testimonials: [{ quote: "Beautiful decor and flawless execution", author: "Neha & Rohan, Kandivali" }],
        image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        id: 6,
        name: 'Festival Fusion',
        emoji: '🪔',
        price: 14999,
        discountedPrice: 12999,
        type: 'family',
        for: 'Festive events like Ganpati visarjan, Diwali parties',
        includes: [
          'Ganpati or Diwali themed floral decor',
          '1-hour DJ or traditional music setup',
          'Refreshments/snacks table setup',
          '1 dedicated event photographer',
          'Lighting decor: LED & ambient lights'
        ],
        guests: '50-100',
        saving: 2000,
        fee: 1199,
        details: [
          'Ganpati/Diwali decor',
          '1-hour music setup',
          '1 photographer',
          'Lights and ambiance setting'
        ],
        testimonials: [{ quote: "Managed our Ganpati Visarjan perfectly", author: "Sneha, Dadar" }],
        image: 'https://images.unsplash.com/photo-1600188769045-bc602a3528f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      }
    ],
    premium: [
      {
        id: 7,
        name: 'Campus Premium',
        emoji: '🎉',
        price: 59999,
        discountedPrice: 54999,
        type: 'college',
        for: 'Large college fests, tech conferences',
        includes: [
          '12x16 ft stage with LED backdrop',
          '8-speaker sound + 4 wireless mics',
          '10+ active sponsor leads with contracts',
          '3 photographers + 1 videographer',
          'Live streaming setup + social media management'
        ],
        guests: '150-500',
        popular: true,
        saving: 5000,
        fee: 3999,
        details: [
          '6-hour setup',
          'Professional LED stage',
          '10+ sponsors',
          '3 photographers + 1 videographer',
          'Live streaming + social media'
        ],
        testimonials: [
          { quote: "Our tech fest went viral!", author: "Arjun, VIT Vellore" },
          { quote: "Got 12 sponsors and 50k+ views", author: "Meera, Manipal University" }
        ],
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        id: 8,
        name: 'Royal Wedding',
        emoji: '👑',
        price: 99999,
        discountedPrice: 89999,
        type: 'wedding',
        for: 'Destination weddings, grand celebrations',
        includes: [
          'Luxury venue decor with premium flowers',
          'Bridal & groom styling by celebrity MUA',
          '2 photography teams + 1 cinematography team',
          '5-star catering coordination for 200+ guests',
          'Wedding planner for 3 months + day coordination'
        ],
        guests: '150-500',
        saving: 10000,
        fee: 5999,
        details: [
          '3-month planning',
          'Luxury decor',
          '2 photography teams',
          '5-star catering',
          'Wedding planner'
        ],
        testimonials: [
          { quote: "Our destination wedding was magical!", author: "Aisha & Sameer, Goa" },
          { quote: "Every detail was perfect", author: "Zara & Arjun, Udaipur" }
        ],
        image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        id: 9,
        name: 'Corporate Excellence',
        emoji: '🏢',
        price: 79999,
        discountedPrice: 69999,
        type: 'corporate',
        for: 'Corporate events, product launches',
        includes: [
          'Professional stage with LED wall',
          'High-end sound system with multiple mics',
          'Corporate branding & marketing materials',
          'Professional photography & videography',
          'Event management team for full day'
        ],
        guests: '100-300',
        saving: 10000,
        fee: 4999,
        details: [
          'Professional stage',
          'LED wall setup',
          'Corporate branding',
          'Professional media team',
          'Full-day management'
        ],
        testimonials: [
          { quote: "Our product launch was a huge success!", author: "Rajesh, TechCorp CEO" },
          { quote: "Professional execution from start to finish", author: "Priya, Marketing Director" }
        ],
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      }
    ]
  };

  const addOns = [
    { id: 1, name: 'Live Streaming', price: 2999, description: 'Professional live streaming setup' },
    { id: 2, name: 'Drone Photography', price: 3999, description: 'Aerial photography and videography' },
    { id: 3, name: 'DJ Services', price: 4999, description: 'Professional DJ with equipment' },
    { id: 4, name: 'Catering', price: 5999, description: 'Premium catering services' },
    { id: 5, name: 'Transportation', price: 3999, description: 'Guest transportation services' },
    { id: 6, name: 'Security', price: 2999, description: 'Professional security personnel' }
  ];

  const tabs = [
    { id: 'all', name: 'All Packages', icon: <FiGift /> },
    { id: 'micro', name: 'Micro Events', icon: <FiUsers /> },
    { id: 'mid', name: 'Mid-Scale', icon: <FiStar /> },
    { id: 'premium', name: 'Premium', icon: <FiHeart /> }
  ];

  const filteredPackages = activeTab === 'all' 
    ? [...packages.micro, ...packages.mid, ...packages.premium]
    : packages[activeTab] || [];

  const filteredAddOns = (pkgType) => addOns.filter(addOn => 
    !selectedAddOns.some(selected => selected.id === addOn.id)
  );

  const formatCurrency = (amount) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  const calculateTotal = () => {
    const packagePrice = selectedPackage?.discountedPrice || selectedPackage?.price || 0;
    const addOnsPrice = selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0);
    return packagePrice + addOnsPrice;
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    // Build booking data
    const bookingData = {
      user: user?._id,
      name: form.name,
      email: form.email,
      phone: form.phone,
      eventDate: form.eventDate,
      location: form.location,
      notes: form.notes,
      packageName: selectedPackage?.name,
      packageId: selectedPackage?.id,
      addOns: selectedAddOns,
      total: calculateTotal()
    };
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/booking-inquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData)
      });
      const data = await res.json();
      if (data.success) {
        setShowBookingModal(false);
        setFormSubmitted(false);
        setSelectedPackage(null);
        setSelectedAddOns([]);
        setForm({ name: '', email: '', phone: '', eventDate: '', location: '', notes: '' });
        alert("Booking successful! We will contact you soon.");
        navigate("/user-dashboard"); // Redirect to user dashboard
      } else {
        alert("Failed to submit booking: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      alert("Error submitting booking: " + err.message);
    }
  };

  const toggleExpand = (packageId) => {
    setExpandedPackage(expandedPackage === packageId ? null : packageId);
  };

  const toggleAddOn = (addOn) => {
    setSelectedAddOns(prev => 
      prev.some(item => item.id === addOn.id)
        ? prev.filter(item => item.id !== addOn.id)
        : [...prev, addOn]
    );
  };

  const resetBooking = () => {
    setSelectedPackage(null);
    setSelectedAddOns([]);
    setShowBookingModal(false);
    setForm({ name: '', email: '', phone: '', eventDate: '', location: '', notes: '' });
  };

  return (
    <div className="space-y-8">
      {/* Package Categories */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPackages.map((pkg) => (
          <div
            key={pkg.id}
            className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 card-hover ${
              selectedPackage?.id === pkg.id ? 'ring-2 ring-pink-500 scale-105' : ''
            }`}
          >
            {/* Package Header */}
            <div className="relative">
              <div className="h-48 bg-gradient-to-br from-pink-100 to-purple-100 relative overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                {/* Popular Badge */}
                {pkg.popular && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                    <FiStar className="inline w-3 h-3 mr-1" />
                    Popular
                  </div>
                )}

                {/* Package Info */}
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-3xl mb-2">{pkg.emoji}</div>
                  <h3 className="text-xl font-bold">{pkg.name}</h3>
                  <p className="text-sm opacity-90">{pkg.for}</p>
                </div>
              </div>
            </div>

            {/* Package Content */}
            <div className="p-6">
              {/* Pricing */}
              <div className="mb-4">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatCurrency(pkg.discountedPrice || pkg.price)}
                  </span>
                  {pkg.discountedPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      {formatCurrency(pkg.price)}
                    </span>
                  )}
                </div>
                {pkg.saving && (
                  <div className="text-sm text-green-600 font-medium mt-1">
                    Save {formatCurrency(pkg.saving)}
                  </div>
                )}
              </div>

              {/* Guest Range */}
              <div className="flex items-center text-gray-600 mb-4">
                <FiUsers className="w-4 h-4 mr-2" />
                <span className="text-sm">{pkg.guests} guests</span>
              </div>

              {/* Features */}
              <div className="space-y-2 mb-6">
                {pkg.includes.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <FiCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
                {pkg.includes.length > 3 && (
                  <button
                    onClick={() => toggleExpand(pkg.id)}
                    className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                  >
                    {expandedPackage === pkg.id ? 'Show less' : `+${pkg.includes.length - 3} more features`}
                  </button>
                )}
              </div>

              {/* Expanded Features */}
              {expandedPackage === pkg.id && (
                <div className="space-y-2 mb-6 border-t pt-4">
                  {pkg.includes.slice(3).map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <FiCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Testimonials */}
              {pkg.testimonials && pkg.testimonials.length > 0 && (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <FiStar className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-900">Customer Review</span>
                  </div>
                  <p className="text-sm text-gray-600 italic">"{pkg.testimonials[0].quote}"</p>
                  <p className="text-xs text-gray-500 mt-1">- {pkg.testimonials[0].author}</p>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => {
                  setSelectedPackage(pkg);
                  setShowBookingModal(true);
                }}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Choose Package</span>
                <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedPackage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {!formSubmitted ? (
              <>
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6">
                  <h3 className="text-2xl font-bold">
                    Book {selectedPackage.name}
                  </h3>
                  <p className="text-pink-100 mt-2">
                    {formatCurrency(selectedPackage.discountedPrice || selectedPackage.price)} • {selectedPackage.guests} guests
                  </p>
                </div>

                <div className="p-6">
                  {/* Selected Package Summary */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{selectedPackage.emoji}</span>
                      <div>
                        <h4 className="font-bold text-gray-900">{selectedPackage.name}</h4>
                        <p className="text-sm text-gray-600">{selectedPackage.for}</p>
                      </div>
                      <div className="ml-auto text-right">
                        <div className="font-bold text-gray-900">
                          {formatCurrency(selectedPackage.discountedPrice || selectedPackage.price)}
                        </div>
                        <div className="text-sm text-gray-600">{selectedPackage.guests} guests</div>
                      </div>
                    </div>
                  </div>

                  {/* Add-ons Section */}
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-4">Add Extra Services</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {filteredAddOns().map((addOn) => (
                        <button
                          key={addOn.id}
                          onClick={() => toggleAddOn(addOn)}
                          className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                            selectedAddOns.some(item => item.id === addOn.id)
                              ? 'border-pink-500 bg-pink-50'
                              : 'border-gray-200 hover:border-pink-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900">{addOn.name}</div>
                              <div className="text-sm text-gray-600">{addOn.description}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-gray-900">{formatCurrency(addOn.price)}</div>
                              {selectedAddOns.some(item => item.id === addOn.id) && (
                                <FiCheck className="w-4 h-4 text-pink-500 ml-auto mt-1" />
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900">Total Amount</span>
                      <span className="text-2xl font-bold gradient-text">{formatCurrency(calculateTotal())}</span>
                    </div>
                  </div>

                  {/* Booking Form */}
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Your Name</label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Event Date</label>
                        <input
                          type="date"
                          name="eventDate"
                          value={form.eventDate}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Location</label>
                        <input
                          type="text"
                          name="location"
                          value={form.location}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200"
                          placeholder="City, State"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Additional Notes</label>
                      <textarea
                        name="notes"
                        value={form.notes}
                        onChange={handleFormChange}
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200"
                        placeholder="Tell us about your event requirements..."
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={resetBooking}
                        className="px-6 py-3 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-all duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-200"
                      >
                        Book Now
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="text-center p-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiCheck className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Booking Confirmed!
                </h3>
                <p className="text-gray-600 mb-6">
                  We've received your booking and will contact you within 24 hours to confirm details.
                </p>
                <button
                  onClick={resetBooking}
                  className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-200"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Packages;