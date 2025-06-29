import { useState } from 'react';
import { FiCoffee, FiDroplet, FiCamera, FiMusic, FiPlus, FiArrowRight, FiArrowLeft, FiCheck, FiStar, FiPackage } from 'react-icons/fi';

export default function ServiceSelection({ form, setForm, nextStep, prevStep, CONFIG, isMobile }) {
  const [selectedServices, setSelectedServices] = useState(form.selectedServices);

  const handleNext = () => {
    setForm({
      ...form,
      selectedServices: selectedServices
    });
    nextStep();
  };

  const updateService = (serviceType, field, value) => {
    setSelectedServices(prev => ({
      ...prev,
      [serviceType]: {
        ...prev[serviceType],
        [field]: value
      }
    }));
  };

  const toggleEntertainmentService = (serviceId) => {
    const currentIds = selectedServices.entertainment.ids || [];
    const newIds = currentIds.includes(serviceId)
      ? currentIds.filter(id => id !== serviceId)
      : [...currentIds, serviceId];
    
    updateService('entertainment', 'ids', newIds);
  };

  const toggleOtherService = (serviceId) => {
    const currentIds = selectedServices.other.ids || [];
    const newIds = currentIds.includes(serviceId)
      ? currentIds.filter(id => id !== serviceId)
      : [...currentIds, serviceId];
    
    updateService('other', 'ids', newIds);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Choose Your Services
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Select the services that will make your event perfect
        </p>
      </div>

      {/* Catering Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FiCoffee className="w-5 h-5 text-pink-500" />
            Catering Services
          </h2>
          <span className="text-sm text-gray-500">3 of 4</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CONFIG.cateringOptions.map((option) => (
            <div key={option.id} className="bg-white rounded-xl border-2 border-gray-200 p-4 md:p-6 hover:shadow-md transition-all duration-200">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 text-lg">{option.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(option.pricePerPlate).map(([packageType, price]) => (
                    <button
                      key={packageType}
                      onClick={() => updateService('catering', 'type', option.id)}
                      className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                        selectedServices.catering.type === option.id
                          ? 'border-pink-500 bg-gradient-to-r from-pink-50 to-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <div className="font-medium text-gray-900 capitalize">{packageType}</div>
                          <div className="text-sm text-gray-600">₹{price}/plate</div>
                        </div>
                        <div className="text-lg font-bold text-pink-600">
                          ₹{(price * form.guests).toLocaleString()}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Special Requests</label>
                  <textarea
                    value={selectedServices.catering.notes}
                    onChange={(e) => updateService('catering', 'notes', e.target.value)}
                    placeholder="Any dietary restrictions or special requests?"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                    rows="2"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button
          onClick={prevStep}
          className="flex-1 sm:flex-none py-4 md:py-5 px-6 rounded-xl font-semibold text-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <FiArrowLeft className="w-5 h-5" />
          Back
        </button>
        
        <button
          onClick={handleNext}
          className="flex-1 sm:flex-none py-4 md:py-5 px-6 rounded-xl font-semibold text-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
        >
          Review & Payment
          <FiArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
} 