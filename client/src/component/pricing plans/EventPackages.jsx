import { useState, useEffect } from 'react';
import { 
  FiChevronRight, FiChevronLeft, FiCheck, FiCalendar,
  FiUsers, FiMapPin, FiStar, FiHome, FiGift, 
  FiBriefcase, FiInfo, FiCoffee, FiCamera, FiMusic,
  FiSearch, FiPlus, FiMinus, FiNavigation, FiDollarSign,
  FiFilm, FiMic, FiScissors, FiTruck, FiZap, FiShoppingBag,
  FiEdit3
} from 'react-icons/fi';

const CONFIG = {
  zones: [
    { id: 'south', name: 'South Mumbai', popular: true, image: '/mumbai-south.jpg', 
      coordinates: [19.0760, 72.8777], deliveryFee: 0 },
    { id: 'central', name: 'Central Mumbai', popular: true, image: '/mumbai-central.jpg',
      coordinates: [19.0762, 72.8785], deliveryFee: 500 },
    { id: 'western', name: 'Western Suburbs', image: '/mumbai-western.jpg',
      coordinates: [19.1077, 72.8373], deliveryFee: 1000 },
    { id: 'navi', name: 'Navi Mumbai', image: '/navi-mumbai.jpg',
      coordinates: [19.0330, 73.0297], deliveryFee: 1500 }
  ],
  
  eventTypes: [
    { id: 'birthday', name: 'Birthday', icon: <FiGift />, color: 'bg-pink-100 text-pink-600', gradient: 'from-pink-100 to-pink-50' },
    { id: 'wedding', name: 'Wedding', icon: <FiGift />, color: 'bg-red-100 text-red-600', gradient: 'from-red-100 to-red-50' },
    { id: 'corporate', name: 'Corporate', icon: <FiBriefcase />, color: 'bg-purple-100 text-purple-600', gradient: 'from-purple-100 to-purple-50' },
    { id: 'social', name: 'Social', icon: <FiUsers />, color: 'bg-green-100 text-green-600', gradient: 'from-green-100 to-green-50' },
    { id: 'concert', name: 'Concert', icon: <FiMusic />, color: 'bg-yellow-100 text-yellow-600', gradient: 'from-yellow-100 to-yellow-50' },
    { id: 'custom', name: 'Custom Event', icon: <FiEdit3 />, color: 'bg-blue-100 text-blue-600', gradient: 'from-blue-100 to-blue-50' },
  ],
  
  vendors: [
    { id: 'venue', name: 'Venue', icon: <FiMapPin />, description: 'Beautiful locations for your event' },
    { id: 'catering', name: 'Catering', icon: <FiCoffee />, description: 'Delicious food and beverage options' },
    { id: 'photography', name: 'Photography', icon: <FiCamera />, description: 'Professional photographers' },
    { id: 'videography', name: 'Videography', icon: <FiFilm />, description: 'High-quality video coverage' },
    { id: 'entertainment', name: 'Entertainment', icon: <FiMusic />, description: 'DJs, bands, and performers' },
    { id: 'decor', name: 'Decor', icon: <FiHome />, description: 'Theme-based decorations' },
    { id: 'mc', name: 'MC/Host', icon: <FiMic />, description: 'Professional event hosts' },
    { id: 'beauty', name: 'Beauty Services', icon: <FiScissors />, description: 'Makeup, hair styling' },
    { id: 'transport', name: 'Transport', icon: <FiTruck />, description: 'Guest transportation' },
    { id: 'lighting', name: 'Lighting', icon: <FiZap />, description: 'Stage and ambient lighting' },
    { id: 'invites', name: 'Invitations', icon: <FiShoppingBag />, description: 'Custom invites and gifts' },
  ],
  
  guestRanges: [
    { label: 'Intimate', min: 10, max: 30 },
    { label: 'Medium', min: 31, max: 75 },
    { label: 'Large', min: 76, max: 150 },
    { label: 'Grand', min: 151, max: 300 }
  ],
  
  budgetRanges: [
    { label: 'Basic', min: 10000, max: 50000, color: 'bg-blue-100 text-blue-600' },
    { label: 'Standard', min: 50001, max: 150000, color: 'bg-green-100 text-green-600' },
    { label: 'Premium', min: 150001, max: 300000, color: 'bg-purple-100 text-purple-600' },
    { label: 'Luxury', min: 300001, max: 1000000, color: 'bg-yellow-100 text-yellow-600' }
  ]
};

export default function EventBuilder() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    eventType: '',
    customEventName: '',
    date: '',
    guests: 30,
    budget: 50000,
    location: '',
    address: '',
    selectedVendors: [],
    notes: '',
    deliveryDetails: null
  });
  const [confirmed, setConfirmed] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [animation, setAnimation] = useState('');
  const [isGeolocating, setIsGeolocating] = useState(false);

  const nextStep = () => {
    setAnimation('slide-out');
    setTimeout(() => {
      setStep(s => s + 1);
      setAnimation('slide-in');
    }, 300);
  };
  
  const prevStep = () => {
    setAnimation('slide-out-back');
    setTimeout(() => {
      setStep(s => s - 1);
      setAnimation('slide-in-back');
    }, 300);
  };

  const toggleVendor = (vendor) => {
    setForm(f => ({
      ...f,
      selectedVendors: f.selectedVendors.includes(vendor) 
        ? f.selectedVendors.filter(v => v !== vendor)
        : [...f.selectedVendors, vendor]
    }));
  };

  const handleSubmit = () => {
    const selectedZone = CONFIG.zones.find(zone => zone.name === form.location);
    const deliveryDetails = selectedZone ? {
      zone: selectedZone.name,
      fee: selectedZone.deliveryFee,
      coordinates: selectedZone.coordinates,
      estimatedDeliveryTime: calculateDeliveryTime(selectedZone.coordinates),
      address: form.address
    } : null;

    setForm(f => ({ ...f, deliveryDetails }));
    setAnimation('fade-out');
    setTimeout(() => setConfirmed(true), 300);
  };

  const calculateDeliveryTime = (coordinates) => {
    const [lat, lng] = coordinates;
    const distance = Math.sqrt(Math.pow(lat - 19.0760, 2) + Math.pow(lng - 72.8777, 2));
    
    if (distance < 0.05) return '30-60 minutes';
    if (distance < 0.1) return '1-2 hours';
    if (distance < 0.2) return '2-3 hours';
    return '3-4 hours';
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setForm({...form, location: value});
    
    if (value.length > 1) {
      const filtered = CONFIG.zones.filter(zone => 
        zone.name.toLowerCase().includes(value.toLowerCase())
      );
      setLocationSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectLocation = (location) => {
    setForm({...form, location});
    setShowSuggestions(false);
  };

  const adjustGuests = (amount) => {
    const newValue = parseInt(form.guests) + amount;
    if (newValue >= 10 && newValue <= 300) {
      setForm({...form, guests: newValue});
    }
  };

  const adjustBudget = (amount) => {
    const newValue = parseInt(form.budget) + amount;
    if (newValue >= 10000 && newValue <= 1000000) {
      setForm({...form, budget: newValue});
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsGeolocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          let nearestZone = null;
          let minDistance = Infinity;
          
          CONFIG.zones.forEach(zone => {
            const [lat, lng] = zone.coordinates;
            const distance = Math.sqrt(Math.pow(lat - latitude, 2) + Math.pow(lng - longitude, 2));
            if (distance < minDistance) {
              minDistance = distance;
              nearestZone = zone;
            }
          });
          
          if (nearestZone) {
            setForm(f => ({
              ...f,
              location: nearestZone.name,
              address: `Near ${nearestZone.name} (auto-detected)`
            }));
          }
          setIsGeolocating(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsGeolocating(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getBudgetRange = () => {
    return CONFIG.budgetRanges.find(range => 
      form.budget >= range.min && form.budget <= range.max
    ) || CONFIG.budgetRanges[0];
  };

  const ProgressBar = () => (
    <div className="flex justify-center mb-8">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            step >= i ? 'bg-gradient-to-br from-blue-600 to-blue-400 text-white shadow-md' : 'bg-gray-100 text-gray-400'
          }`}>
            {i}
          </div>
          {i < 4 && (
            <div className={`h-1 w-12 mx-2 transition-all duration-300 ${
              step > i ? 'bg-gradient-to-r from-blue-400 to-blue-200' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const getEventColor = () => {
    const event = CONFIG.eventTypes.find(e => e.id === form.eventType);
    return event ? event.color : 'bg-blue-100 text-blue-600';
  };

  const getEventGradient = () => {
    const event = CONFIG.eventTypes.find(e => e.id === form.eventType);
    return event ? event.gradient : 'from-blue-100 to-blue-50';
  };

  const getEventName = () => {
    if (form.eventType === 'custom') {
      return form.customEventName || 'Custom Event';
    }
    return CONFIG.eventTypes.find(e => e.id === form.eventType)?.name || 'Event';
  };

  useEffect(() => {
    setAnimation('slide-in');
  }, []);

  if (confirmed) return (
    <div className={`max-w-md mx-auto p-8 text-center bg-white rounded-2xl shadow-xl transform transition-all duration-500 ${animation}`}>
      <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
        <FiCheck className="text-white text-4xl" />
      </div>
      <h2 className="text-3xl font-bold mb-4 text-gray-800">Request Submitted!</h2>
      <p className="text-gray-600 mb-6">
        Our team is creating a customized package for your {getEventName()} event. We'll contact you within 24 hours with exciting options!
      </p>
      
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl mb-6 border border-blue-100">
        <h3 className="font-semibold text-gray-700 mb-2">Event Summary</h3>
        <div className="text-left text-sm text-gray-600 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Event Type:</span>
            <span className="font-medium">{getEventName()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date:</span>
            <span className="font-medium">
              {form.date ? new Date(form.date).toLocaleDateString('en-US', { 
                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' 
              }) : 'Not specified'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Guests:</span>
            <span className="font-medium">{form.guests}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Budget:</span>
            <span className="font-medium">{formatCurrency(form.budget)}</span>
          </div>
        </div>
      </div>
      
      {form.deliveryDetails && (
        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl mb-6 border border-blue-100">
          <h3 className="font-semibold text-gray-700 mb-2">Delivery Details</h3>
          <div className="text-left text-sm text-gray-600 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Location:</span>
              <span className="font-medium">{form.deliveryDetails.zone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Delivery Fee:</span>
              <span className="font-medium">{formatCurrency(form.deliveryDetails.fee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Estimated Setup Time:</span>
              <span className="font-medium">{form.deliveryDetails.estimatedDeliveryTime}</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl mb-6 border border-green-100">
        <h3 className="font-semibold text-gray-700 mb-2">What's Next?</h3>
        <ul className="text-left text-sm text-gray-600 space-y-2">
          <li className="flex items-center"><FiChevronRight className="mr-2 text-green-500" /> Personalized venue options within your budget</li>
          <li className="flex items-center"><FiChevronRight className="mr-2 text-green-500" /> Catering menu suggestions for {form.guests} guests</li>
          <li className="flex items-center"><FiChevronRight className="mr-2 text-green-500" /> 3-5 complete package options</li>
        </ul>
      </div>
      
      <button 
        onClick={() => {
          setAnimation('fade-in');
          setStep(1);
          setConfirmed(false);
          setForm({
            eventType: '', customEventName: '', date: '', guests: 30, budget: 50000,
            location: '', address: '', selectedVendors: [], notes: '',
            deliveryDetails: null
          });
        }}
        className="px-8 py-3 bg-gradient-to-br from-blue-600 to-blue-400 text-white rounded-xl font-medium hover:shadow-md transition-all transform hover:scale-105"
      >
        Plan Another Event
      </button>
    </div>
  );

  return (
    <div className={`max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl transform transition-all duration-300 ${animation}`}>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          {step === 1 ? 'Plan Your Perfect Event' : 
           step === 2 ? 'Set Your Budget' : 
           step === 3 ? 'Customize Your Experience' : 
           'Review & Confirm'}
        </h1>
        <p className="text-gray-600">
          {step === 1 ? 'Start by telling us about your event' : 
           step === 2 ? 'Help us recommend the best options' : 
           step === 3 ? 'Select your preferred services' : 
           'Double-check your selections before submitting'}
        </p>
      </div>
      
      <ProgressBar />

      {/* Step 1: Event Basics */}
      {step === 1 && (
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
              <span className={`w-8 h-8 rounded-full ${getEventColor()} flex items-center justify-center mr-3`}>
                {CONFIG.eventTypes.find(e => e.id === form.eventType)?.icon || <FiGift />}
              </span>
              What type of event are you planning?
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {CONFIG.eventTypes.map(event => (
                <button
                  key={event.id}
                  onClick={() => setForm({...form, eventType: event.id, customEventName: ''})}
                  className={`p-4 border-2 rounded-xl flex flex-col items-center transition-all transform hover:scale-105 hover:shadow-md ${
                    form.eventType === event.id
                      ? `border-${event.color.split('-')[1]}-500 bg-gradient-to-br ${event.gradient} shadow-sm`
                      : 'border-gray-200 hover:border-blue-400'
                  }`}
                >
                  <span className={`mb-2 text-2xl ${event.color}`}>{event.icon}</span>
                  <span className="font-bold text-gray-800 text-sm">{event.name}</span>
                </button>
              ))}
            </div>
          </div>

          {form.eventType === 'custom' && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
                <FiEdit3 className="mr-3 text-blue-600" /> 
                What's the name of your custom event?
              </h3>
              <div className="relative">
                <input
                  type="text"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                  placeholder="Enter your event name (e.g., Anniversary, Graduation, etc.)"
                  value={form.customEventName}
                  onChange={(e) => setForm({...form, customEventName: e.target.value})}
                  maxLength={50}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {form.customEventName.length}/50 characters
                </div>
              </div>
            </div>
          )}

          {form.eventType && (
            <>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
                  <FiCalendar className="mr-3 text-blue-600" /> 
                  When is your event?
                </h3>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                    value={form.date}
                    onChange={(e) => setForm({...form, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                {form.date && (
                  <p className="mt-2 text-sm text-blue-600">
                    {new Date(form.date).toLocaleDateString('en-US', { 
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                    })}
                  </p>
                )}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
                  <FiUsers className="mr-3 text-blue-600" /> 
                  How many guests are you expecting?
                </h3>
                <div className="flex items-center space-x-4 mb-4">
                  <button 
                    onClick={() => adjustGuests(-5)}
                    disabled={form.guests <= 10}
                    className={`p-2 rounded-full ${form.guests <= 10 ? 'bg-gray-200 text-gray-400' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                  >
                    <FiMinus />
                  </button>
                  <div className="flex-1">
                    <input
                      type="range"
                      min="10"
                      max="300"
                      step="5"
                      className="w-full h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg appearance-none cursor-pointer"
                      value={form.guests}
                      onChange={(e) => setForm({...form, guests: e.target.value})}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      {CONFIG.guestRanges.map(range => (
                        <span key={range.label}>{range.label}</span>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={() => adjustGuests(5)}
                    disabled={form.guests >= 300}
                    className={`p-2 rounded-full ${form.guests >= 300 ? 'bg-gray-200 text-gray-400' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                  >
                    <FiPlus />
                  </button>
                </div>
                <div className="text-center">
                  <span className={`text-2xl font-bold ${getEventColor()} px-6 py-2 rounded-full`}>
                    {form.guests} guests
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Step 2: Budget */}
      {step === 2 && (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
              <FiDollarSign className="mr-3 text-blue-600" /> 
              What's your estimated budget?
            </h3>
            <div className="flex items-center space-x-4 mb-4">
              <button 
                onClick={() => adjustBudget(-10000)}
                disabled={form.budget <= 10000}
                className={`p-2 rounded-full ${form.budget <= 10000 ? 'bg-gray-200 text-gray-400' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
              >
                <FiMinus />
              </button>
              <div className="flex-1">
                <input
                  type="range"
                  min="10000"
                  max="1000000"
                  step="10000"
                  className="w-full h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg appearance-none cursor-pointer"
                  value={form.budget}
                  onChange={(e) => setForm({...form, budget: e.target.value})}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  {CONFIG.budgetRanges.map(range => (
                    <span key={range.label}>{range.label}</span>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => adjustBudget(10000)}
                disabled={form.budget >= 1000000}
                className={`p-2 rounded-full ${form.budget >= 1000000 ? 'bg-gray-200 text-gray-400' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
              >
                <FiPlus />
              </button>
            </div>
            <div className="text-center">
              <span className={`text-2xl font-bold ${getBudgetRange().color} px-6 py-2 rounded-full`}>
                {formatCurrency(form.budget)}
              </span>
              <p className="mt-2 text-sm text-gray-500">
                {getBudgetRange().label} range: {formatCurrency(getBudgetRange().min)} - {formatCurrency(getBudgetRange().max)}
              </p>
            </div>
          </div>

         
        </div>
      )}

      {/* Step 3: Location & Vendors */}
      {step === 3 && (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
              <FiMapPin className="mr-3 text-blue-600" /> 
              Where would you like to host your event?
            </h3>
            <div className="space-y-4">
              <div className="relative">
                <div className="relative">
                  <FiSearch className="absolute left-4 top-4 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                    placeholder="Search locations..."
                    value={form.location}
                    onChange={handleLocationChange}
                    onFocus={() => form.location.length > 1 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  />
                  <button 
                    onClick={getCurrentLocation}
                    disabled={isGeolocating}
                    className="absolute right-3 top-3 p-1 text-blue-600 hover:text-blue-800 transition-colors"
                    title="Use current location"
                  >
                    {isGeolocating ? (
                      <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <FiNavigation />
                    )}
                  </button>
                </div>
                {showSuggestions && locationSuggestions.length > 0 && (
                  <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto">
                    {locationSuggestions.map(zone => (
                      <li 
                        key={zone.id}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center transition-colors"
                        onMouseDown={() => selectLocation(zone.name)}
                      >
                        <div className="w-10 h-10 bg-gray-200 rounded-md mr-3 bg-cover bg-center" 
                             style={{ backgroundImage: `url(${zone.image})` }}></div>
                        <div className="flex-1">
                          <div className="font-medium">{zone.name}</div>
                          <div className="text-xs text-gray-500">Delivery fee: {formatCurrency(zone.deliveryFee)}</div>
                        </div>
                        {zone.popular && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
                            <FiStar className="inline mr-1" /> Popular
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="mt-2">
                <div className="flex items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 mr-3">Quick picks:</span>
                  <div className="flex space-x-2">
                    {CONFIG.zones.filter(z => z.popular).map(zone => (
                      <button
                        key={zone.id}
                        onClick={() => selectLocation(zone.name)}
                        className="text-xs bg-white border border-gray-200 px-3 py-1 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      >
                        {zone.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {form.location && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiHome className="inline mr-2" /> Specific Address (for accurate delivery)
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                    rows={2}
                    placeholder="Enter full address including landmark, floor number, etc."
                    value={form.address}
                    onChange={(e) => setForm({...form, address: e.target.value})}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Example: "3rd Floor, Sunshine Tower, Near Marine Drive, Churchgate"
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
              <FiBriefcase className="mr-3 text-blue-600" /> 
              What services do you need?
            </h3>
            <div className="flex space-x-2 mb-4 border-b border-gray-200 pb-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 text-sm rounded-lg ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                All Services
              </button>
              <button
                onClick={() => setActiveTab('selected')}
                className={`px-4 py-2 text-sm rounded-lg ${activeTab === 'selected' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Selected ({form.selectedVendors.length})
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {CONFIG.vendors
                .filter(vendor => activeTab === 'all' || form.selectedVendors.includes(vendor.id))
                .map(vendor => (
                  <div 
                    key={vendor.id}
                    className={`p-4 border-2 rounded-xl transition-all transform hover:scale-[1.02] cursor-pointer ${
                      form.selectedVendors.includes(vendor.id)
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm'
                        : 'border-gray-200 hover:border-blue-300 bg-white'
                    }`}
                    onClick={() => toggleVendor(vendor.id)}
                  >
                    <div className="flex items-center mb-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        form.selectedVendors.includes(vendor.id) ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {vendor.icon}
                      </div>
                      <h4 className="font-bold text-gray-800">{vendor.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{vendor.description}</p>
                    <div className="mt-3 flex justify-end">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        form.selectedVendors.includes(vendor.id) 
                          ? 'bg-blue-600 border-blue-600 text-white' 
                          : 'border-gray-300'
                      }`}>
                        {form.selectedVendors.includes(vendor.id) && <FiCheck size={12} />}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
              <FiInfo className="mr-3 text-blue-600" /> 
              Any special requests or details?
            </h3>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
              rows={4}
              placeholder="Tell us about themes, specific requirements, budget considerations, or anything else we should know..."
              value={form.notes}
              onChange={(e) => setForm({...form, notes: e.target.value})}
            />
            <div className="text-xs text-gray-500 mt-2">
              Examples: "We need a vegan menu", "Outdoor venue preferred", "Music must end by 11pm"
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <div className="space-y-6">
          <div className={`bg-gradient-to-br ${getEventGradient()} p-6 rounded-2xl border border-gray-200 shadow-sm`}>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Your Event Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600 flex items-center">
                  <FiGift className="mr-2" /> Event Type
                </span>
                <span className="font-medium text-gray-800">
                  {getEventName()}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600 flex items-center">
                  <FiCalendar className="mr-2" /> Date
                </span>
                <span className="font-medium text-gray-800">
                  {form.date ? new Date(form.date).toLocaleDateString('en-US', { 
                    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' 
                  }) : 'Not specified'}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600 flex items-center">
                  <FiUsers className="mr-2" /> Guests
                </span>
                <span className="font-medium text-gray-800">
                  {form.guests} ({CONFIG.guestRanges.find(r => form.guests >= r.min && form.guests <= r.max)?.label || 'Large'})
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600 flex items-center">
                  <FiDollarSign className="mr-2" /> Budget
                </span>
                <span className="font-medium text-gray-800">
                  {formatCurrency(form.budget)} ({getBudgetRange().label})
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600 flex items-center">
                  <FiMapPin className="mr-2" /> Location
                </span>
                <span className="font-medium text-gray-800">
                  {form.location || 'Not specified'}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-gray-600 flex items-center">
                  <FiHome className="mr-2" /> Address
                </span>
                <span className="font-medium text-gray-800 max-w-xs text-right">
                  {form.address || 'Not specified'}
                </span>
              </div>
            </div>
          </div>

          {form.selectedVendors.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Selected Services</h3>
              <div className="grid grid-cols-2 gap-4">
                {form.selectedVendors.map(vendorId => {
                  const vendor = CONFIG.vendors.find(v => v.id === vendorId);
                  return (
                    <div key={vendorId} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                        {vendor?.icon}
                      </div>
                      <span className="font-medium text-gray-800">{vendor?.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {form.notes && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Your Notes</h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-700 whitespace-pre-wrap">{form.notes}</p>
              </div>
            </div>
          )}

          {form.location && (
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Delivery Information</h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Zone:</span>
                  <span className="font-medium">{form.location}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Delivery Fee:</span>
                  <span className="font-medium">
                    {formatCurrency(CONFIG.zones.find(z => z.name === form.location)?.deliveryFee || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Setup Time:</span>
                  <span className="font-medium">
                    {form.location ? calculateDeliveryTime(CONFIG.zones.find(z => z.name === form.location)?.coordinates) : 'Not specified'}
                  </span>
                </div>
              </div>
            </div>
          )}
        
          <div className="bg-green-50 p-6 rounded-2xl border border-green-200">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Almost Done!</h3>
            <p className="text-gray-600 mb-4">
              Ready to submit your request? Our event specialists will create customized options based on your preferences and contact you within 24 hours.
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <FiInfo className="mr-2 text-green-500" />
              No obligation - we'll provide quotes before you commit
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-10 flex justify-between border-t pt-6">
        {step > 1 ? (
          <button
            onClick={prevStep}
            className="px-6 py-3 border border-gray-300 rounded-xl flex items-center hover:bg-gray-50 transition-all transform hover:-translate-x-1 text-gray-700 font-medium shadow-sm"
          >
            <FiChevronLeft className="mr-2" /> Back
          </button>
        ) : (
          <div></div>
        )}
        
        {step < 4 ? (
          <button
            onClick={nextStep}
            disabled={
              (step === 1 && !form.eventType) || 
              (step === 1 && form.eventType === 'custom' && !form.customEventName) ||
              (step === 3 && !form.location)
            }
            className={`px-8 py-3 rounded-xl flex items-center font-medium transition-all transform hover:scale-105 shadow-md ${
              (step === 1 && !form.eventType) || 
              (step === 1 && form.eventType === 'custom' && !form.customEventName) ||
              (step === 3 && !form.location)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-br from-blue-600 to-blue-400 text-white hover:shadow-lg'
            }`}
          >
            Continue <FiChevronRight className="ml-2" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl font-medium hover:shadow-lg transition-all transform hover:scale-105"
          >
            Submit Request
          </button>
        )}
      </div>
    </div>
  );
}