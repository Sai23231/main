import { useState, useEffect } from 'react';
import { FiCoffee, FiDroplet, FiCamera, FiMusic, FiPlus, FiArrowRight, FiArrowLeft, FiCheck, FiStar, FiPackage } from 'react-icons/fi';

export default function ServiceSelection({ form, setForm, nextStep, prevStep, CONFIG, isMobile }) {
  const [selectedServices, setSelectedServices] = useState(form.selectedServices);
  const [activeTab, setActiveTab] = useState('catering');

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

  const serviceTabs = [
    { id: 'catering', name: 'Catering', icon: <FiCoffee />, color: 'text-orange-600' },
    { id: 'decor', name: 'Decor', icon: <FiDroplet />, color: 'text-pink-600' },
    { id: 'photography', name: 'Photography', icon: <FiCamera />, color: 'text-blue-600' },
    { id: 'entertainment', name: 'Entertainment', icon: <FiMusic />, color: 'text-purple-600' },
    { id: 'other', name: 'Other Services', icon: <FiPackage />, color: 'text-green-600' }
  ];

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

      {/* Service Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {serviceTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.name}</span>
            </button>
          ))}
        </div>
        <span className="text-sm text-gray-500">3 of 4</span>
      </div>

      {/* Service Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* Catering Tab */}
        {activeTab === 'catering' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
                <FiCoffee className="w-6 h-6 text-orange-500" />
                Catering Services
              </h2>
              <p className="text-gray-600 mt-2">Choose your catering type and package</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CONFIG.cateringOptions.map((option) => (
                <div key={option.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                  <div className="text-center mb-4">
                    <h3 className="font-semibold text-gray-900 text-lg">{option.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                  </div>
                  
                  <div className="space-y-3">
                    {Object.entries(option.pricePerPlate).map(([packageType, price]) => (
                      <button
                        key={packageType}
                        onClick={() => {
                          updateService('catering', 'type', option.id);
                          updateService('catering', 'package', packageType);
                        }}
                        className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                          selectedServices.catering.type === option.id && selectedServices.catering.package === packageType
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-left">
                            <div className="font-medium text-gray-900 capitalize">{packageType}</div>
                            <div className="text-sm text-gray-600">₹{price}/plate</div>
                          </div>
                          <div className="text-lg font-bold text-orange-600">
                            ₹{(price * form.guests).toLocaleString()}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Special Requests</label>
              <textarea
                value={selectedServices.catering.notes}
                onChange={(e) => updateService('catering', 'notes', e.target.value)}
                placeholder="Any dietary restrictions or special requests?"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                rows="2"
              />
            </div>
          </div>
        )}

        {/* Decor Tab */}
        {activeTab === 'decor' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
                <FiDroplet className="w-6 h-6 text-pink-500" />
                Decor & Styling
              </h2>
              <p className="text-gray-600 mt-2">Choose your decor theme</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CONFIG.decorThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => updateService('decor', 'theme', theme.id)}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                    selectedServices.decor.theme === theme.id
                      ? 'bg-gradient-to-br from-pink-100 to-purple-100 border-pink-500 shadow-lg'
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
                      <FiDroplet className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{theme.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{theme.description}</div>
                      <div className="text-lg font-bold text-pink-600 mt-2">₹{theme.basePrice.toLocaleString()}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Decor Notes</label>
              <textarea
                value={selectedServices.decor.notes}
                onChange={(e) => updateService('decor', 'notes', e.target.value)}
                placeholder="Any specific decor preferences or themes?"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                rows="2"
              />
            </div>
          </div>
        )}

        {/* Photography Tab */}
        {activeTab === 'photography' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
                <FiCamera className="w-6 h-6 text-blue-500" />
                Photography & Videography
              </h2>
              <p className="text-gray-600 mt-2">Choose your photography package</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CONFIG.photographyPackages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => updateService('photography', 'package', pkg.id)}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                    selectedServices.photography.package === pkg.id
                      ? 'bg-gradient-to-br from-blue-100 to-indigo-100 border-blue-500 shadow-lg'
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <FiCamera className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{pkg.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{pkg.description}</div>
                      <div className="text-lg font-bold text-blue-600 mt-2">₹{pkg.price.toLocaleString()}</div>
                    </div>
                    <div className="text-xs text-gray-600">
                      {pkg.includes.map((item, index) => (
                        <div key={index} className="flex items-center gap-1 justify-center">
                          <FiCheck className="w-3 h-3 text-green-500" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Photography Notes</label>
              <textarea
                value={selectedServices.photography.notes}
                onChange={(e) => updateService('photography', 'notes', e.target.value)}
                placeholder="Any specific photography requirements?"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="2"
              />
            </div>
          </div>
        )}

        {/* Entertainment Tab */}
        {activeTab === 'entertainment' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
                <FiMusic className="w-6 h-6 text-purple-500" />
                Entertainment
              </h2>
              <p className="text-gray-600 mt-2">Select your entertainment options</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CONFIG.entertainmentOptions.map((service) => (
                <button
                  key={service.id}
                  onClick={() => toggleEntertainmentService(service.id)}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                    selectedServices.entertainment.ids.includes(service.id)
                      ? 'bg-gradient-to-br from-purple-100 to-pink-100 border-purple-500 shadow-lg'
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-center space-y-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
                      selectedServices.entertainment.ids.includes(service.id) ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-600'
                    }`}>
                      <FiMusic className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{service.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{service.description}</div>
                      <div className="text-lg font-bold text-purple-600 mt-2">₹{service.price.toLocaleString()}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Entertainment Notes</label>
              <textarea
                value={selectedServices.entertainment.notes}
                onChange={(e) => updateService('entertainment', 'notes', e.target.value)}
                placeholder="Any specific entertainment requirements?"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows="2"
              />
            </div>
          </div>
        )}

        {/* Other Services Tab */}
        {activeTab === 'other' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
                <FiPackage className="w-6 h-6 text-green-500" />
                Additional Services
              </h2>
              <p className="text-gray-600 mt-2">Select additional services you need</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CONFIG.otherServices.map((service) => (
                <button
                  key={service.id}
                  onClick={() => toggleOtherService(service.id)}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                    selectedServices.other.ids.includes(service.id)
                      ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-green-500 shadow-lg'
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-center space-y-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
                      selectedServices.other.ids.includes(service.id) ? 'bg-green-500 text-white' : 'bg-green-100 text-green-600'
                    }`}>
                      <FiPackage className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{service.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{service.description}</div>
                      <div className="text-lg font-bold text-green-600 mt-2">₹{service.price.toLocaleString()}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
              <textarea
                value={selectedServices.other.notes}
                onChange={(e) => updateService('other', 'notes', e.target.value)}
                placeholder="Any additional requirements or special requests?"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                rows="2"
              />
            </div>
          </div>
        )}
      </div>

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
          className="flex-1 sm:flex-none py-4 px-6 rounded-xl font-semibold text-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
        >
          Continue to Review
          <FiArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
} 