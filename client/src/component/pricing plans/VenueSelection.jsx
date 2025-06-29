import { useState } from 'react';
import { FiHome, FiDroplet, FiSquare, FiWifi, FiFilm, FiZap, FiCoffee, FiArrowRight, FiArrowLeft, FiCheck, FiStar } from 'react-icons/fi';

export default function VenueSelection({ form, setForm, nextStep, prevStep, isMobile }) {
  const [selectedVenueType, setSelectedVenueType] = useState(form.venueDetails.type);
  const [selectedAmenities, setSelectedAmenities] = useState(form.venueDetails.amenities || []);

  const handleNext = () => {
    setForm({
      ...form,
      venueDetails: {
        type: selectedVenueType,
        amenities: selectedAmenities
      }
    });
    nextStep();
  };

  const isFormValid = selectedVenueType;

  const venueTypes = [
    { 
      id: 'banquet', 
      name: 'Banquet Hall', 
      icon: <FiHome />, 
      basePrice: 50000,
      description: 'Elegant indoor venues',
      image: '/public/hall.png',
      popular: true
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
  ];

  const amenities = [
    { id: 'ac', name: 'Air Conditioning', icon: <FiDroplet />, description: 'Climate controlled comfort' },
    { id: 'parking', name: 'Parking', icon: <FiSquare />, description: 'Convenient parking space' },
    { id: 'wifi', name: 'WiFi', icon: <FiWifi />, description: 'High-speed internet access' },
    { id: 'stage', name: 'Stage', icon: <FiFilm />, description: 'Professional stage setup' },
    { id: 'lighting', name: 'Lighting', icon: <FiZap />, description: 'Professional lighting system' },
    { id: 'kitchen', name: 'Kitchen', icon: <FiCoffee />, description: 'Full-service kitchen facilities' }
  ];

  const toggleAmenity = (amenityId) => {
    setSelectedAmenities(prev => 
      prev.includes(amenityId) 
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Choose Your Perfect Venue
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Select a venue type and amenities that match your event vision
        </p>
      </div>

      {/* Venue Type Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FiHome className="w-5 h-5 text-pink-500" />
            What type of venue do you prefer?
          </h2>
          <span className="text-sm text-gray-500">2 of 4</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {venueTypes.map((venue) => (
            <button
              key={venue.id}
              onClick={() => setSelectedVenueType(venue.id)}
              className={`relative p-4 md:p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                selectedVenueType === venue.id
                  ? 'bg-gradient-to-br from-pink-100 to-purple-100 border-pink-500 shadow-lg'
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              {venue.popular && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <FiStar className="w-3 h-3" />
                  Popular
                </div>
              )}
              
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-xl md:text-2xl ${
                  selectedVenueType === venue.id ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {venue.icon}
                </div>
                
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-900 text-base md:text-lg">{venue.name}</div>
                  <div className="text-sm text-gray-600 mt-1">{venue.description}</div>
                </div>
                
                {selectedVenueType === venue.id && (
                  <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                    <FiCheck className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Amenities Selection */}
      {selectedVenueType && (
        <div className="space-y-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FiStar className="w-5 h-5 text-pink-500" />
            What amenities do you need?
          </h2>
          <p className="text-sm text-gray-600">Select all that apply</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {amenities.map((amenity) => (
              <button
                key={amenity.id}
                onClick={() => toggleAmenity(amenity.id)}
                className={`p-3 md:p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                  selectedAmenities.includes(amenity.id)
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-transparent shadow-lg'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg md:text-xl ${
                    selectedAmenities.includes(amenity.id) ? 'bg-white bg-opacity-20' : 'bg-gray-100'
                  }`}>
                    {amenity.icon}
                  </div>
                  <div>
                    <div className="font-medium text-sm md:text-base">{amenity.name}</div>
                    <div className="text-xs md:text-sm opacity-80 mt-1">{amenity.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button
          onClick={prevStep}
          className="flex-1 sm:flex-none py-4 px-6 rounded-xl font-semibold text-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <FiArrowLeft className="w-5 h-5" />
          Back
        </button>
        
        <button
          onClick={handleNext}
          disabled={!isFormValid}
          className={`flex-1 sm:flex-none py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
            isFormValid
              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg hover:scale-105'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue to Services
          <FiArrowRight className="w-5 h-5" />
        </button>
      </div>

      {!isFormValid && (
        <p className="text-sm text-gray-500 text-center">
          Please select a venue type to continue
        </p>
      )}
    </div>
  );
} 