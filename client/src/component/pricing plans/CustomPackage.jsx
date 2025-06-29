import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectLoggedInUser } from '../UserLogin/authSlice';
import EventBasics from './EventBasics';
import VenueSelection from './VenueSelection';
import ServiceSelection from './ServiceSelection';
import ReviewAndPayment from './ReviewAndPayment';
import ConfirmationScreen from './ConfirmationScreen';
import ProgressBar from './ProgressBar';
import PriceSummary from './PriceSummary';
import {
  FiGift, FiBriefcase, FiUsers, FiMusic, FiHome, FiDroplet, FiSquare, FiWifi, FiFilm, FiZap, FiCoffee, FiCamera,
  FiCalendar, FiMapPin, FiClock, FiChevronRight, FiChevronLeft, FiCheck, FiStar, FiHeart, FiShare2, FiMenu, FiX
} from 'react-icons/fi';

const CONFIG = {
  locations: ['Mumbai', 'Navi Mumbai', 'Thane', 'Pune', 'Goa', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad'],
  eventTypes: [
    { 
      id: 'wedding', 
      name: 'Wedding', 
      icon: <FiGift />, 
      color: 'bg-gradient-to-br from-pink-100 to-red-100 text-pink-600', 
      serviceFeePercent: 5,
      description: 'Your special day deserves perfection',
      popular: true
    },
    { 
      id: 'birthday', 
      name: 'Birthday', 
      icon: <FiGift />, 
      color: 'bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600', 
      serviceFeePercent: 5,
      description: 'Celebrate in style'
    },
    { 
      id: 'corporate', 
      name: 'Corporate', 
      icon: <FiBriefcase />, 
      color: 'bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600', 
      serviceFeePercent: 5,
      description: 'Professional events with impact'
    },
    { 
      id: 'social', 
      name: 'Social', 
      icon: <FiUsers />, 
      color: 'bg-gradient-to-br from-green-100 to-emerald-100 text-green-600', 
      serviceFeePercent: 5,
      description: 'Gatherings that bring people together'
    },
    { 
      id: 'concert', 
      name: 'Concert', 
      icon: <FiMusic />, 
      color: 'bg-gradient-to-br from-yellow-100 to-orange-100 text-orange-600', 
      serviceFeePercent: 5,
      description: 'Unforgettable musical experiences'
    },
    { 
      id: 'engagement', 
      name: 'Engagement', 
      icon: <FiHeart />, 
      color: 'bg-gradient-to-br from-rose-100 to-pink-100 text-rose-600', 
      serviceFeePercent: 5,
      description: 'The beginning of forever'
    }
  ],
  venueTypes: [
    { 
      id: 'banquet', 
      name: 'Banquet Hall', 
      icon: <FiHome />, 
      basePrice: 50000,
      description: 'Elegant indoor venues',
      image: '/public/hall.png'
    },
    { 
      id: 'lawn', 
      name: 'Lawn/Garden', 
      icon: <FiHome />, 
      basePrice: 40000,
      description: 'Beautiful outdoor settings',
      image: '/public/hall2.jpg'
    },
    { 
      id: 'hotel', 
      name: 'Hotel Ballroom', 
      icon: <FiHome />, 
      basePrice: 60000,
      description: 'Luxury hotel venues',
      image: '/public/hall3.webp'
    },
    { 
      id: 'beach', 
      name: 'Beach Venue', 
      icon: <FiHome />, 
      basePrice: 70000,
      description: 'Scenic beachfront locations',
      image: '/public/beach.jpg'
    }
  ],
  venueAmenities: [
    { id: 'ac', name: 'Air Conditioning', icon: <FiDroplet />, description: 'Climate controlled comfort' },
    { id: 'parking', name: 'Parking', icon: <FiSquare />, description: 'Convenient parking space' },
    { id: 'wifi', name: 'WiFi', icon: <FiWifi />, description: 'High-speed internet access' },
    { id: 'stage', name: 'Stage', icon: <FiFilm />, description: 'Professional stage setup' },
    { id: 'lighting', name: 'Lighting', icon: <FiZap />, description: 'Professional lighting system' },
    { id: 'kitchen', name: 'Kitchen', icon: <FiCoffee />, description: 'Full-service kitchen facilities' }
  ],
  cateringOptions: [
    { 
      id: 'veg', 
      name: 'Vegetarian', 
      pricePerPlate: { basic: 300, standard: 600, premium: 1200 }, 
      description: 'Delicious vegetarian menu with seasonal ingredients',
      features: ['Fresh ingredients', 'Multiple courses', 'Dietary accommodations']
    },
    { 
      id: 'nonveg', 
      name: 'Non-Vegetarian', 
      pricePerPlate: { basic: 500, standard: 900, premium: 1500 }, 
      description: 'Premium non-vegetarian selection with multiple courses',
      features: ['Premium meats', 'Chef specialties', 'International cuisine']
    },
    { 
      id: 'continental', 
      name: 'Continental', 
      pricePerPlate: { basic: 800, standard: 1200, premium: 2000 }, 
      description: 'International cuisine with global flavors',
      features: ['International dishes', 'Fine dining experience', 'Wine pairing options']
    }
  ],
  decorThemes: [
    { 
      id: 'floral', 
      name: 'Floral Elegance', 
      basePrice: 15000, 
      description: 'Elegant floral arrangements with fresh flowers',
      features: ['Fresh flowers', 'Seasonal blooms', 'Professional arrangement']
    },
    { 
      id: 'traditional', 
      name: 'Traditional Indian', 
      basePrice: 20000, 
      description: 'Classic Indian decor with rich fabrics and colors',
      features: ['Traditional fabrics', 'Cultural elements', 'Rich color palette']
    },
    { 
      id: 'modern', 
      name: 'Modern Minimal', 
      basePrice: 18000, 
      description: 'Clean lines and contemporary design elements',
      features: ['Minimalist design', 'Contemporary style', 'Clean aesthetics']
    },
    { 
      id: 'luxury', 
      name: 'Luxury Premium', 
      basePrice: 35000, 
      description: 'Premium luxury decor with exclusive elements',
      features: ['Premium materials', 'Exclusive designs', 'Luxury finishes']
    }
  ],
  photographyPackages: [
    { 
      id: 'basic', 
      name: 'Basic Coverage', 
      price: 8000, 
      includes: ['4 hours coverage', '100 edited photos', 'Online gallery'], 
      description: 'Perfect for smaller events with basic photography needs',
      features: ['Professional photographer', 'Basic editing', 'Digital delivery']
    },
    { 
      id: 'premium', 
      name: 'Premium Coverage', 
      price: 25000, 
      includes: ['Full day coverage', '500+ edited photos', '2 photographers', 'Photo album'], 
      description: 'Comprehensive coverage for important events',
      features: ['Multiple photographers', 'Advanced editing', 'Physical album', 'Drone shots']
    },
    { 
      id: 'cinematic', 
      name: 'Cinematic Package', 
      price: 45000, 
      includes: ['Full day coverage', '1000+ photos', 'Cinematic video', '3 photographers'], 
      description: 'Ultimate coverage with cinematic video production',
      features: ['Cinematic video', 'Multiple angles', 'Professional editing', 'Music score']
    }
  ],
  entertainmentOptions: [
    { 
      id: 'dj', 
      name: 'Professional DJ', 
      price: 10000, 
      description: 'Professional DJ with equipment and music library',
      features: ['Professional equipment', 'Extensive music library', 'MC services']
    },
    { 
      id: 'liveband', 
      name: 'Live Band', 
      price: 25000, 
      description: '4-piece live band with extensive repertoire',
      features: ['Live music', 'Multiple genres', 'Professional musicians']
    },
    { 
      id: 'classical', 
      name: 'Classical Music', 
      price: 15000, 
      description: 'Traditional classical music ensemble',
      features: ['Traditional instruments', 'Cultural music', 'Elegant performance']
    }
  ],
  otherServices: [
    { 
      id: 'makeup', 
      name: 'Makeup Artist', 
      price: 8000, 
      description: 'Professional makeup for bride and family',
      features: ['Professional makeup', 'Hair styling', 'Touch-up services']
    },
    { 
      id: 'transport', 
      name: 'Guest Transport', 
      price: 15000, 
      description: 'Air-conditioned transport for up to 50 guests',
      features: ['AC vehicles', 'Professional drivers', 'Multiple pickups']
    },
    { 
      id: 'security', 
      name: 'Security Services', 
      price: 12000, 
      description: 'Professional security personnel for your event',
      features: ['Trained personnel', 'Crowd management', 'Safety protocols']
    }
  ]
};

// New VenueChoice component
function VenueChoice({ form, setForm, nextStep, prevStep, isMobile }) {
  const [venueChoice, setVenueChoice] = useState(form.needsVenue ? 'yes' : form.needsVenue === false ? 'no' : '');

  const handleNext = () => {
    setForm({
      ...form,
      needsVenue: venueChoice === 'yes'
    });
    nextStep();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Do you need a venue?
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Choose whether you need us to provide a venue or if you have your own
        </p>
      </div>

      {/* Venue Choice */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FiHome className="w-5 h-5 text-pink-500" />
            Venue Requirements
          </h2>
          <span className="text-sm text-gray-500">2 of 4</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Want Venue Option */}
          <button
            onClick={() => setVenueChoice('yes')}
            className={`relative p-6 md:p-8 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
              venueChoice === 'yes'
                ? 'bg-gradient-to-br from-pink-100 to-purple-100 border-pink-500 shadow-lg'
                : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                venueChoice === 'yes' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                <FiHome />
              </div>
              <div>
                <div className="font-bold text-lg text-gray-900">Yes, I need a venue</div>
                <div className="text-sm text-gray-600 mt-2">
                  We'll help you find the perfect venue from our curated selection
                </div>
              </div>
              {venueChoice === 'yes' && (
                <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                  <FiCheck className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </button>

          {/* Don't Want Venue Option */}
          <button
            onClick={() => setVenueChoice('no')}
            className={`relative p-6 md:p-8 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
              venueChoice === 'no'
                ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-green-500 shadow-lg'
                : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                venueChoice === 'no' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                <FiCheck />
              </div>
              <div>
                <div className="font-bold text-lg text-gray-900">No, I have my own venue</div>
                <div className="text-sm text-gray-600 mt-2">
                  Skip venue selection and go straight to services
                </div>
              </div>
              {venueChoice === 'no' && (
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <FiCheck className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button
          onClick={prevStep}
          className="flex-1 sm:flex-none py-4 px-6 rounded-xl font-semibold text-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <FiChevronLeft className="w-5 h-5" />
          Back
        </button>
        
        <button
          onClick={handleNext}
          disabled={!venueChoice}
          className={`flex-1 sm:flex-none py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
            venueChoice
              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg hover:scale-105'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
          <FiChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default function CustomPackage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    eventType: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    guests: 50,
    needsVenue: null, // null means not selected yet
    contactInfo: { name: '', email: '', phone: '' },
    venueDetails: { type: '', amenities: [] },
    selectedServices: {
      catering: { type: '', package: '', notes: '' },
      decor: { theme: '', notes: '' },
      photography: { package: '', notes: '' },
      entertainment: { ids: [], notes: '' },
      other: { ids: [], notes: '' }
    },
    notes: '',
    termsAccepted: false,
    CONFIG
  });
  const [confirmed, setConfirmed] = useState(false);
  const [animation, setAnimation] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [showPriceSummary, setShowPriceSummary] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const user = useSelector(selectLoggedInUser);
  const cardRef = useRef(null);

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        contactInfo: {
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || ''
        }
      }));
    }
    
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setShowMobileMenu(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [user]);

  const scrollToCard = () => {
    setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);
  };

  const nextStep = () => {
    setAnimation('slide-out');
    setTimeout(() => {
      setStep(step + 1);
      setAnimation('slide-in');
      scrollToCard();
    }, 300);
  };
  
  const prevStep = () => {
    setAnimation('slide-out');
    setTimeout(() => {
      setStep(step - 1);
      setAnimation('slide-in');
      scrollToCard();
    }, 300);
  };
  
  const calculateTotal = () => {
    let subtotal = 0;
    
    // Catering cost
    if (form.selectedServices.catering.type && form.selectedServices.catering.package) {
      const cateringType = CONFIG.cateringOptions.find(t => t.id === form.selectedServices.catering.type);
      if (cateringType) {
        const pricePerPlate = cateringType.pricePerPlate[form.selectedServices.catering.package];
        subtotal += pricePerPlate * form.guests;
      }
    }
    
    // Decor cost
    if (form.selectedServices.decor.theme) {
      const theme = CONFIG.decorThemes.find(t => t.id === form.selectedServices.decor.theme);
      if (theme) subtotal += theme.basePrice;
    }
    
    // Photography cost
    if (form.selectedServices.photography.package) {
      const pkg = CONFIG.photographyPackages.find(p => p.id === form.selectedServices.photography.package);
      if (pkg) subtotal += pkg.price;
    }
    
    // Entertainment cost
    if (form.selectedServices.entertainment && form.selectedServices.entertainment.ids) {
      form.selectedServices.entertainment.ids.forEach(serviceId => {
        const service = CONFIG.entertainmentOptions.find(s => s.id === serviceId);
        if (service) subtotal += service.price;
      });
    }
    
    // Other services cost
    if (form.selectedServices.other && form.selectedServices.other.ids) {
      form.selectedServices.other.ids.forEach(serviceId => {
        const service = CONFIG.otherServices.find(s => s.id === serviceId);
        if (service) subtotal += service.price;
      });
    }
    
    const eventType = CONFIG.eventTypes.find(e => e.id === form.eventType);
    const serviceFeePercent = eventType?.serviceFeePercent || 5;
    const serviceFee = subtotal * (serviceFeePercent / 100);
    
    return { subtotal, serviceFee, total: subtotal + serviceFee };
  };
  
  const getEventTypeColor = () => {
    const eventType = CONFIG.eventTypes.find(e => e.id === form.eventType);
    return eventType ? eventType.color : 'bg-gray-100 text-gray-600';
  };

  // Step logic
  if (confirmed) {
    return (
      <div ref={cardRef} className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
        <ConfirmationScreen
          form={form}
          setStep={setStep}
          setConfirmed={setConfirmed}
          user={user}
          setForm={setForm}
          getEventTypeColor={getEventTypeColor}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FiGift className="text-white text-sm" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">DreamVentz</div>
              <div className="text-xs text-gray-500">Custom Package</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowPriceSummary(!showPriceSummary)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <FiStar className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              {showMobileMenu ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Progress Bar */}
        <div className="px-4 pb-3">
          <ProgressBar step={step} />
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <FiGift className="text-white text-sm" />
                </div>
                <span className="text-xl font-bold text-gray-900">DreamVentz</span>
              </div>
              <div className="hidden md:block">
                <span className="text-sm text-gray-500">Custom Package Builder</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <FiShare2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <FiHeart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Left Column - Main Form */}
          <div className="lg:col-span-2">
            <div ref={cardRef} className={`transition-all duration-300 ${animation}`}>
              {/* Desktop Progress Bar */}
              <div className="hidden md:block mb-8">
                <ProgressBar step={step} />
              </div>

              {/* Step Content */}
              {step === 1 && (
                <EventBasics
                  form={form}
                  setForm={setForm}
                  nextStep={nextStep}
                  isMobile={isMobile}
                  getEventTypeColor={getEventTypeColor}
                />
              )}
              
              {step === 2 && (
                <VenueChoice
                  form={form}
                  setForm={setForm}
                  nextStep={nextStep}
                  prevStep={prevStep}
                  isMobile={isMobile}
                />
              )}
              
              {step === 3 && form.needsVenue && (
                <VenueSelection
                  form={form}
                  setForm={setForm}
                  nextStep={nextStep}
                  prevStep={prevStep}
                  isMobile={isMobile}
                />
              )}
              
              {step === 3 && !form.needsVenue && (
                <ServiceSelection
                  form={form}
                  setForm={setForm}
                  nextStep={nextStep}
                  prevStep={prevStep}
                  CONFIG={CONFIG}
                  isMobile={isMobile}
                />
              )}
              
              {step === 4 && form.needsVenue && (
                <ServiceSelection
                  form={form}
                  setForm={setForm}
                  nextStep={nextStep}
                  prevStep={prevStep}
                  CONFIG={CONFIG}
                  isMobile={isMobile}
                />
              )}
              
              {step === 4 && !form.needsVenue && (
                <ReviewAndPayment
                  form={form}
                  setForm={setForm}
                  prevStep={prevStep}
                  setConfirmed={setConfirmed}
                  calculateTotal={calculateTotal}
                  getEventTypeColor={getEventTypeColor}
                  user={user}
                  isMobile={isMobile}
                />
              )}
              
              {step === 5 && form.needsVenue && (
                <ReviewAndPayment
                  form={form}
                  setForm={setForm}
                  prevStep={prevStep}
                  setConfirmed={setConfirmed}
                  calculateTotal={calculateTotal}
                  getEventTypeColor={getEventTypeColor}
                  user={user}
                  isMobile={isMobile}
                />
              )}
            </div>
          </div>

          {/* Right Column - Price Summary (Desktop) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <PriceSummary 
                form={form} 
                calculateTotal={calculateTotal} 
                CONFIG={CONFIG}
                showPriceSummary={showPriceSummary}
                setShowPriceSummary={setShowPriceSummary}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Price Summary Overlay */}
      {isMobile && showPriceSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white rounded-t-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Price Summary</h3>
                <button
                  onClick={() => setShowPriceSummary(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <PriceSummary 
                form={form} 
                calculateTotal={calculateTotal} 
                CONFIG={CONFIG}
                showPriceSummary={showPriceSummary}
                setShowPriceSummary={setShowPriceSummary}
                isMobile={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Floating Action Button */}
      {isMobile && !showPriceSummary && (
        <div className="fixed bottom-4 right-4 z-40">
          <button
            onClick={() => setShowPriceSummary(true)}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <FiStar className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}