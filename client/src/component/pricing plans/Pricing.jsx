import React, { useState } from 'react';

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
        for: 'Large college festivals',
        includes: [
          'LED stage backdrop with truss setup',
          'High-watt sound system + lights',
          '10+ sponsorship proposals + email templates',
          'Full media coverage (photography + videography)',
          'Aftermovie (3 min reel + event video)'
        ],
        guests: '150-300',
        saving: 5000,
        fee: 4999,
        details: [
          'Professional stage design',
          'High-end sound system',
          '10+ sponsors',
          'Press coverage',
          '3-minute after-movie'
        ],
        testimonials: [
          { quote: "Our fest looked like a professional concert!", author: "Cultural Secretary, IIT Bombay" },
          { quote: "Got a Bollywood performer!", author: "Event Head, DTU" }
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
        for: 'Luxury wedding celebrations',
        includes: [
          'Designer wedding decor (venue + mandap)',
          'Cinematic photography & drone shots',
          'Live music or entertainment act',
          'Gourmet catering vendor coordination',
          'Dedicated wedding planner with assistant'
        ],
        guests: '150-300',
        saving: 10000,
        fee: 7999,
        details: [
          '3-day event coverage',
          'Cinematic wedding film',
          'Live band performance',
          '5-star catering',
          'Dedicated planner'
        ],
        testimonials: [{ quote: "A fairytale wedding beyond our dreams", author: "Aisha & Karan, Mumbai" }],
        image: 'https://images.unsplash.com/photo-1553615738-d5e4ec0a0d51?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        id: 9,
        name: 'Corporate Elite',
        emoji: '🏢',
        price: 44999,
        discountedPrice: 39999,
        type: 'corporate',
        for: 'Startup mixers, product launches, team offsites',
        includes: [
          'Corporate branding backdrop & digital screen',
          'AV + mic setup for pitch/product demo',
          'Anchor/emcee for engagement',
          'Food + beverage vendor coordination',
          'Photo + video team for social content'
        ],
        guests: '100-200',
        saving: 5000,
        fee: 3499,
        details: [
          'Stage + screen for launch/presentation',
          'AV + mic system',
          'Event host',
          'Promo videos and reels'
        ],
        testimonials: [
          { quote: "Launch felt like a TEDx event!", author: "Rohit, Andheri startup founder" },
          { quote: "Perfect for team-building offsite", author: "HR Lead, Navi Mumbai" }
        ],
        image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        id: 10,
        name: 'Social Gathering',
        emoji: '🥂',
        price: 19999,
        discountedPrice: 17999,
        type: 'social',
        for: 'Reunions, alumni meets, networking mixers',
        includes: [
          'Stylish entrance and themed decor setup',
          'Mood lighting & lanterns/fairy lights',
          'Welcome drinks or mocktail bar (optional)',
          'Photo/selfie zone with props',
          'Live DJ or curated music playlist'
        ],
        guests: '50-100',
        saving: 2000,
        fee: 1599,
        details: [
          '3-hour event support',
          'Mood lighting and decor accents',
          'Selfie corner or photo booth',
          'Playlist curation or live DJ (optional)',
          'On-site assistant'
        ],
        testimonials: [
          { quote: "Perfect ambiance for our alumni reunion!", author: "Kavita, SP Jain Alumni" },
          { quote: "The networking zone with chill vibes worked great", author: "Anish, Startup Grind Mumbai" }
        ],
        image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      }
    ]
  };

  // Add-ons
  const addOns = [
    { id: 'ao1', name: 'Photography Upgrade', price: 3999, category: 'all', icon: '📷', details: ['Second photographer', '100 extra photos'] },
    { id: 'ao2', name: 'Videography Package', price: 5999, category: 'all', icon: '🎥', details: ['Highlight video', 'Raw footage'] },
    { id: 'ao3', name: 'Social Media Manager', price: 2999, category: 'all', icon: '📱', details: ['Live updates', '20+ stories'] },
    { id: 'ao4', name: 'Additional Decor', price: 4999, category: 'wedding', icon: '🌸', details: ['Ceiling drapes', 'Extra floral arrangements'] },
    { id: 'ao5', name: 'DJ Services', price: 7999, category: 'college', icon: '🎧', details: ['4-hour performance', 'Sound system included'] },
    { id: 'ao6', name: 'Live Streaming Setup', price: 3499, category: 'all', icon: '📡', details: ['YouTube/Facebook live support', '1 camera operator'] },
    { id: 'ao7', name: 'Emcee/Anchor', price: 3999, category: 'all', icon: '🎤', details: ['Professional host', 'Up to 3 hours'] },
    { id: 'ao8', name: 'Custom Backdrop Banner', price: 2999, category: 'all', icon: '🖼️', details: ['Printed with event branding', 'Up to 8x10 ft'] },
    { id: 'ao9', name: 'Games & Activities Kit', price: 1999, category: 'college', icon: '🎯', details: ['5+ indoor games', 'Fun team-building kits'] },
    { id: 'ao10', name: 'Catering Assistant', price: 2499, category: 'family', icon: '🍽️', details: ['Buffet coordination', 'Snacks & drinks table'] },
    { id: 'ao11', name: 'Drone Coverage', price: 6999, category: 'wedding', icon: '🛸', details: ['Aerial shots', 'Drone operator included'] },
    { id: 'ao12', name: 'Invitation Design Pack', price: 1499, category: 'all', icon: '💌', details: ['Digital & printable versions', 'Up to 3 revisions'] },
    { id: 'ao13', name: 'Memory Wall Installation', price: 3999, category: 'college', icon: '🧱', details: ['Message board + Polaroid display', 'Decor accessories included'] }
  ];

  // Filter packages
  const filteredPackages = [...packages.micro, ...packages.mid, ...packages.premium].filter(pkg => {
    const matchesTab = activeTab === 'all' || pkg.type === activeTab;
    const matchesGuestSize = !guestSize || 
      (guestSize === '0-50' && pkg.guests === '0-50') ||
      (guestSize === '50-150' && pkg.guests === '50-150') ||
      (guestSize === '150+' && pkg.guests === '150-300');
    return matchesTab && matchesGuestSize;
  });

  // Filter add-ons
  const filteredAddOns = (pkgType) => addOns.filter(addOn => 
    addOn.category === 'all' || addOn.category === pkgType
  );

  // Format currency
  const formatCurrency = (amount) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  // Calculate total price
  const calculateTotal = () => {
    if (!selectedPackage) return 0;
    const packagePrice = selectedPackage.discountedPrice || selectedPackage.price;
    const addOnsTotal = selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0);
    return packagePrice + addOnsTotal;
  };

  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log({
      package: selectedPackage,
      addOns: selectedAddOns,
      formData: form,
      total: calculateTotal()
    });
    setFormSubmitted(true);
  };

  // Toggle package expansion
  const toggleExpand = (packageId) => {
    setExpandedPackage(expandedPackage === packageId ? null : packageId);
  };

  // Toggle add-on selection
  const toggleAddOn = (addOn) => {
    setSelectedAddOns(prev => 
      prev.some(ao => ao.id === addOn.id)
        ? prev.filter(ao => ao.id !== addOn.id)
        : [...prev, addOn]
    );
  };

  // Reset booking process
  const resetBooking = () => {
    setSelectedPackage(null);
    setSelectedAddOns([]);
    setShowBookingModal(false);
    setCurrentStep(1);
    setFormSubmitted(false);
    setForm({
      name: '',
      email: '',
      phone: '',
      eventDate: '',
      location: '',
      notes: ''
    });
  };

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-pink-900 mb-4">Event Packages</h1>
          <p className="text-pink-700 max-w-3xl mx-auto">
            All-inclusive packages tailored for your event needs. Select the perfect package and customize with add-ons.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-8 border border-pink-100">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="w-full">
              <h2 className="text-lg font-semibold mb-3 text-pink-800">Filter Packages</h2>
              <div className="flex flex-wrap gap-2">
                {['all', 'college', 'wedding', 'birthday', 'family', 'corporate', 'social'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 md:px-4 md:py-2 rounded-full text-sm transition-all ${
                      activeTab === tab 
                        ? 'bg-pink-600 text-white shadow-md' 
                        : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                    }`}
                  >
                    {tab === 'all' ? 'All Packages' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium mb-1 text-pink-800">Guest Size</label>
              <select 
                value={guestSize}
                onChange={(e) => setGuestSize(e.target.value)}
                className="w-full px-4 py-2 border border-pink-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="">All Sizes</option>
                <option value="0-50">Small (0-50 guests)</option>
                <option value="50-150">Medium (50-150 guests)</option>
                <option value="150+">Large (150+ guests)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        {filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredPackages.map(pkg => (
              <div 
                key={pkg.id}
                className={`bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg ${
                  pkg.popular ? 'ring-2 ring-pink-500 transform hover:-translate-y-1' : 'border border-pink-100'
                }`}
              >
                {/* Package Image */}
                <div className="h-48 overflow-hidden">
                  <img 
                    src={pkg.image} 
                    alt={pkg.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-4 border-b border-pink-100 relative">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-pink-900">{pkg.name}</h3>
                      <p className="text-pink-600 text-sm">{pkg.for}</p>
                    </div>
                    <span className="text-3xl">{pkg.emoji}</span>
                  </div>
                  {pkg.popular && (
                    <div className="absolute top-0 right-0 bg-pink-600 text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg">
                      POPULAR
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="mb-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-2xl font-bold text-pink-600">
                          {pkg.discountedPrice ? formatCurrency(pkg.discountedPrice) : formatCurrency(pkg.price)}
                        </span>
                        {pkg.discountedPrice && (
                          <span className="ml-2 text-sm text-pink-400 line-through">
                            {formatCurrency(pkg.price)}
                          </span>
                        )}
                      </div>
                      {pkg.saving && (
                        <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded">
                          Save {formatCurrency(pkg.saving)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-pink-500 mt-1">
                      + {formatCurrency(pkg.fee)} service fee
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium mb-2 text-pink-800">Key Features:</h4>
                    <ul className="space-y-2">
                      {pkg.includes.slice(0, 3).map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-pink-500 mr-2">•</span>
                          <span className="text-pink-700 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {expandedPackage === pkg.id && (
                    <div className="mt-4 pt-4 border-t border-pink-100">
                      <h4 className="font-medium mb-2 text-pink-800">Details:</h4>
                      <ul className="space-y-2 mb-4">
                        {pkg.details.map((detail, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-pink-400 mr-2">✓</span>
                            <span className="text-pink-700 text-sm">{detail}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {pkg.testimonials?.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2 text-pink-800">Feedback:</h4>
                          <div className="space-y-2">
                            {pkg.testimonials.map((testimonial, index) => (
                              <div key={index} className="bg-pink-50 p-3 rounded border border-pink-100">
                                <p className="text-pink-700 italic text-sm">"{testimonial.quote}"</p>
                                <p className="text-pink-600 text-xs mt-1">— {testimonial.author}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => toggleExpand(pkg.id)}
                      className="text-pink-600 text-sm hover:text-pink-800"
                    >
                      {expandedPackage === pkg.id ? 'Show Less' : 'Show More'}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPackage(pkg);
                        setShowBookingModal(true);
                      }}
                      className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-lg text-sm shadow-md transition-all"
                    >
                      Select Package
                    </button>
                  </div>
                </div>
                
                <div className="px-4 py-2 bg-pink-50 border-t border-pink-100 text-sm text-pink-600">
                  <div className="flex justify-between">
                    <span>For {pkg.guests} guests</span>
                    <span>{pkg.type.charAt(0).toUpperCase() + pkg.type.slice(1)} Event</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-pink-100">
            <div className="text-4xl mb-4">😕</div>
            <h3 className="text-xl font-bold text-pink-800 mb-2">No packages found</h3>
            <p className="text-pink-600">Try adjusting your filters to see more options</p>
            <button
              onClick={() => {
                setActiveTab('all');
                setGuestSize('');
              }}
              className="mt-4 bg-pink-600 hover:bg-pink-700 text-white py-2 px-6 rounded-lg shadow-md"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Booking Modal */}
        {showBookingModal && selectedPackage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 md:p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-pink-900">
                      {selectedPackage.name}
                    </h3>
                    <p className="text-sm text-pink-600">
                      {selectedPackage.for}
                    </p>
                  </div>
                  <button 
                    onClick={resetBooking} 
                    className="text-pink-400 hover:text-pink-600 transition-all"
                  >
                    ✕
                  </button>
                </div>

                {/* Progress Steps */}
                <div className="mb-6">
                  <div className="flex items-center">
                    {[1, 2, 3].map(step => (
                      <React.Fragment key={step}>
                        <div className={`flex items-center ${currentStep >= step ? 'text-pink-600' : 'text-pink-300'}`}>
                          <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
                            currentStep >= step ? 'bg-pink-100 border-2 border-pink-600' : 'bg-pink-50 border border-pink-200'
                          }`}>
                            {step}
                          </div>
                          <div className="ml-2 text-sm hidden sm:block">
                            {step === 1 ? 'Package' : step === 2 ? 'Customize' : 'Details'}
                          </div>
                        </div>
                        {step < 3 && (
                          <div className={`flex-1 h-1 mx-2 ${currentStep > step ? 'bg-pink-600' : 'bg-pink-200'}`}></div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Step Content */}
                {!formSubmitted ? (
                  <>
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">
                          <h4 className="font-bold text-lg mb-3 text-pink-800">Package Details</h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <div className="h-48 overflow-hidden rounded-lg mb-4">
                                <img 
                                  src={selectedPackage.image} 
                                  alt={selectedPackage.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <h5 className="font-medium mb-2 text-pink-700">What's Included:</h5>
                              <ul className="space-y-2 text-sm">
                                {selectedPackage.includes.map((item, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="text-pink-500 mr-2">•</span>
                                    <span className="text-pink-700">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              {selectedPackage.testimonials?.length > 0 && (
                                <>
                                  <h5 className="font-medium mb-2 text-pink-700">Feedback:</h5>
                                  <div className="space-y-2">
                                    {selectedPackage.testimonials.map((testimonial, index) => (
                                      <div key={index} className="bg-white p-3 rounded border border-pink-100">
                                        <p className="text-pink-700 italic text-sm">"{testimonial.quote}"</p>
                                        <p className="text-pink-600 text-xs mt-1">— {testimonial.author}</p>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg border border-pink-100 shadow-sm">
                          <h4 className="font-bold text-lg mb-3 text-pink-800">Pricing</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-pink-700">{selectedPackage.name}</span>
                              <span className="font-medium text-pink-600">
                                {selectedPackage.discountedPrice ? formatCurrency(selectedPackage.discountedPrice) : formatCurrency(selectedPackage.price)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm text-pink-500">
                              <span>Service Fee</span>
                              <span>{formatCurrency(selectedPackage.fee)}</span>
                            </div>
                            <div className="pt-2 border-t border-pink-100">
                              <div className="flex justify-between font-medium">
                                <span className="text-pink-800">Estimated Total</span>
                                <span className="text-pink-600">
                                  {formatCurrency(calculateTotal())}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <button
                            onClick={() => setCurrentStep(2)}
                            className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-6 rounded-lg shadow-md transition-all"
                          >
                            Continue
                          </button>
                        </div>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-bold text-lg mb-3 text-pink-800">Add-ons</h4>
                          <p className="text-pink-600 mb-4 text-sm">
                            Enhance your package with these options:
                          </p>
                          <div className="space-y-3 mb-6">
                            {filteredAddOns(selectedPackage.type).map(addOn => (
                              <div
                                key={addOn.id}
                                className={`p-4 border rounded-lg transition-all ${
                                  selectedAddOns.some(ao => ao.id === addOn.id) 
                                    ? 'border-pink-500 bg-pink-50 shadow-sm' 
                                    : 'border-pink-200 hover:border-pink-300'
                                }`}
                              >
                                <div className="flex items-start">
                                  <div className="mr-3">
                                    <input
                                      type="checkbox"
                                      id={`addon-${addOn.id}`}
                                      checked={selectedAddOns.some(ao => ao.id === addOn.id)}
                                      onChange={() => toggleAddOn(addOn)}
                                      className="h-5 w-5 text-pink-600 rounded border-pink-300 focus:ring-pink-500"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex justify-between">
                                      <div>
                                        <label htmlFor={`addon-${addOn.id}`} className="font-medium text-pink-800 cursor-pointer">
                                          {addOn.name}
                                        </label>
                                      </div>
                                      <div className="ml-3 font-medium text-pink-600">
                                        +{formatCurrency(addOn.price)}
                                      </div>
                                    </div>
                                    <div className="mt-1">
                                      <ul className="text-xs text-pink-600 space-y-1">
                                        {addOn.details.map((detail, idx) => (
                                          <li key={idx} className="flex items-start">
                                            <span>•</span>
                                            <span className="ml-1">{detail}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="p-4 bg-pink-50 rounded-lg border border-pink-100">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-bold text-pink-800">Total:</span>
                              <span className="text-xs text-pink-600 block">Inclusive of all selected add-ons</span>
                            </div>
                            <span className="text-xl font-bold text-pink-700">
                              {formatCurrency(calculateTotal())}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <button
                            onClick={() => setCurrentStep(1)}
                            className="text-pink-600 hover:text-pink-800 py-2 px-4 rounded-lg border border-pink-200 hover:border-pink-300 transition-all"
                          >
                            Back
                          </button>
                          <button
                            onClick={() => setCurrentStep(3)}
                            className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-6 rounded-lg shadow-md transition-all"
                          >
                            Continue
                          </button>
                        </div>
                      </div>
                    )}


                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <form className="space-y-4" onSubmit={handleFormSubmit}>
                          <h4 className="font-bold text-lg text-pink-800">Event Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1 text-pink-700">Full Name*</label>
                              <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleFormChange}
                                className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1 text-pink-700">Email*</label>
                              <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleFormChange}
                                className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                required
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1 text-pink-700">Phone*</label>
                              <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleFormChange}
                                className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1 text-pink-700">Event Date*</label>
                              <input
                                type="date"
                                name="eventDate"
                                value={form.eventDate}
                                onChange={handleFormChange}
                                className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1 text-pink-700">Location*</label>
                            <input
                              type="text"
                              name="location"
                              value={form.location}
                              onChange={handleFormChange}
                              className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1 text-pink-700">Notes</label>
                            <textarea
                              name="notes"
                              value={form.notes}
                              onChange={handleFormChange}
                              className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                              rows={3}
                              placeholder="Any special requirements or additional information..."
                            />
                          </div>
                          <div className="flex justify-between">
                            <button
                              type="button"
                              onClick={() => setCurrentStep(2)}
                              className="text-pink-600 hover:text-pink-800 py-2 px-4 rounded-lg border border-pink-200 hover:border-pink-300 transition-all"
                            >
                              Back
                            </button>
                            <button
                              type="submit"
                              className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-6 rounded-lg shadow-md transition-all"
                            >
                              Submit Booking
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">🎉</div>
                    <h4 className="text-2xl font-bold mb-2 text-pink-800">Thank you for your booking!</h4>
                    <p className="text-pink-600 mb-6">
                      We've received your request for the {selectedPackage.name} package.
                      Our team will contact you within 24 hours to confirm your booking details.
                    </p>
                    <div className="bg-pink-50 p-4 rounded-lg border border-pink-100 max-w-md mx-auto mb-6">
                      <h5 className="font-medium text-pink-700 mb-2">Booking Summary</h5>
                      <div className="text-left text-sm space-y-2">
                        <div className="flex justify-between">
                          <span className="text-pink-600">Package:</span>
                          <span className="font-medium">{selectedPackage.name}</span>
                        </div>
                        {selectedAddOns.length > 0 && (
                          <div>
                            <div className="text-pink-600">Add-ons:</div>
                            <ul className="ml-4">
                              {selectedAddOns.map(addOn => (
                                <li key={addOn.id} className="flex justify-between">
                                  <span>{addOn.name}</span>
                                  <span>+{formatCurrency(addOn.price)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className="pt-2 border-t border-pink-100">
                          <div className="flex justify-between font-medium">
                            <span>Total:</span>
                            <span className="text-pink-600">{formatCurrency(calculateTotal())}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={resetBooking}
                      className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-6 rounded-lg shadow-md transition-all"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Packages;