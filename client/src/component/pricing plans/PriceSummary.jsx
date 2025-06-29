import { useState } from 'react';
import { FiDollarSign, FiChevronDown, FiChevronUp, FiStar, FiGift, FiHome, FiCamera, FiMusic, FiCoffee, FiDroplet, FiPlus } from 'react-icons/fi';

export default function PriceSummary({ form, calculateTotal, CONFIG, showPriceSummary, setShowPriceSummary, isMobile }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { subtotal, serviceFee, total } = calculateTotal();
  const hasSelections = form.eventType || form.needsVenue || 
    (form.selectedServices && (
      form.selectedServices.catering?.type ||
      form.selectedServices.decor?.theme ||
      form.selectedServices.photography?.package ||
      (form.selectedServices.entertainment?.ids && form.selectedServices.entertainment.ids.length > 0) ||
      (form.selectedServices.other?.ids && form.selectedServices.other.ids.length > 0)
    ));

  const getEventTypeName = (eventTypeId) => {
    const eventType = CONFIG.eventTypes.find(e => e.id === eventTypeId);
    return eventType ? eventType.name : eventTypeId;
  };

  const getVenueTypeName = (venueTypeId) => {
    const venueType = CONFIG.venueTypes.find(v => v.id === venueTypeId);
    return venueType ? venueType.name : venueTypeId;
  };

  const getServiceName = (serviceType, serviceId) => {
    switch (serviceType) {
      case 'catering':
        return CONFIG.cateringOptions.find(c => c.id === serviceId)?.name || serviceId;
      case 'decor':
        return CONFIG.decorThemes.find(d => d.id === serviceId)?.name || serviceId;
      case 'photography':
        return CONFIG.photographyPackages.find(p => p.id === serviceId)?.name || serviceId;
      case 'entertainment':
        return CONFIG.entertainmentOptions.find(e => e.id === serviceId)?.name || serviceId;
      case 'other':
        return CONFIG.otherServices.find(o => o.id === serviceId)?.name || serviceId;
      default:
        return serviceId;
    }
  };

  const getServicePrice = (serviceType, serviceId) => {
    switch (serviceType) {
      case 'catering':
        const cateringType = CONFIG.cateringOptions.find(c => c.id === serviceId);
        if (cateringType && form.selectedServices.catering.package) {
          return cateringType.pricePerPlate[form.selectedServices.catering.package] * form.guests;
        }
        return 0;
      case 'decor':
        return CONFIG.decorThemes.find(d => d.id === serviceId)?.basePrice || 0;
      case 'photography':
        return CONFIG.photographyPackages.find(p => p.id === serviceId)?.price || 0;
      case 'entertainment':
        return CONFIG.entertainmentOptions.find(e => e.id === serviceId)?.price || 0;
      case 'other':
        return CONFIG.otherServices.find(o => o.id === serviceId)?.price || 0;
      default:
        return 0;
    }
  };

  const getServiceIcon = (serviceType) => {
    switch (serviceType) {
      case 'venue': return <FiHome className="w-4 h-4" />;
      case 'catering': return <FiCoffee className="w-4 h-4" />;
      case 'decor': return <FiDroplet className="w-4 h-4" />;
      case 'photography': return <FiCamera className="w-4 h-4" />;
      case 'entertainment': return <FiMusic className="w-4 h-4" />;
      case 'other': return <FiPlus className="w-4 h-4" />;
      default: return <FiStar className="w-4 h-4" />;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (isMobile && !showPriceSummary) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg md:text-xl font-bold">Price Summary</h3>
            <p className="text-pink-100 text-sm">Real-time calculation</p>
          </div>
          {!isMobile && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              {isExpanded ? <FiChevronUp className="w-5 h-5" /> : <FiChevronDown className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Event Info */}
      {form.eventType && (
        <div className="p-4 md:p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
              <FiStar className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">{getEventTypeName(form.eventType)}</div>
              <div className="text-sm text-gray-600">
                {form.date} • {form.guests} guests
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="p-4 md:p-6 space-y-4">
        {/* Venue */}
        {form.needsVenue && form.venueDetails.type && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FiHome className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">{getVenueTypeName(form.venueDetails.type)}</div>
                <div className="text-sm text-gray-600">Venue</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 italic">Venue pricing will be quoted separately based on your requirements.</div>
            </div>
          </div>
        )}

        {/* Services */}
        {hasSelections && (
          <div className="space-y-3">
            {/* Catering */}
            {form.selectedServices.catering.type && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                    {getServiceIcon('catering')}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {getServiceName('catering', form.selectedServices.catering.type)}
                      {form.selectedServices.catering.package && (
                        <span className="text-sm text-gray-600 ml-2 capitalize">
                          ({form.selectedServices.catering.package})
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">Catering</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    ₹{getServicePrice('catering', form.selectedServices.catering.type).toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            {/* Decor */}
            {form.selectedServices.decor.theme && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                    {getServiceIcon('decor')}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{getServiceName('decor', form.selectedServices.decor.theme)}</div>
                    <div className="text-sm text-gray-600">Decor</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    ₹{getServicePrice('decor', form.selectedServices.decor.theme).toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            {/* Photography */}
            {form.selectedServices.photography.package && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                    {getServiceIcon('photography')}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{getServiceName('photography', form.selectedServices.photography.package)}</div>
                    <div className="text-sm text-gray-600">Photography</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    ₹{getServicePrice('photography', form.selectedServices.photography.package).toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            {/* Entertainment */}
            {form.selectedServices.entertainment.ids.map((serviceId) => (
              <div key={serviceId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                    {getServiceIcon('entertainment')}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{getServiceName('entertainment', serviceId)}</div>
                    <div className="text-sm text-gray-600">Entertainment</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    ₹{getServicePrice('entertainment', serviceId).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}

            {/* Other Services */}
            {form.selectedServices.other.ids.map((serviceId) => (
              <div key={serviceId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                    {getServiceIcon('other')}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{getServiceName('other', serviceId)}</div>
                    <div className="text-sm text-gray-600">Additional Service</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    ₹{getServicePrice('other', serviceId).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Total */}
        <div className="border-t border-gray-200 pt-4 space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal:</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Service Fee:</span>
            <span>₹{serviceFee.toLocaleString()}</span>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between">
              <span className="text-lg font-bold text-gray-900">Total:</span>
              <span className="text-lg font-bold text-pink-600">₹{total.toLocaleString()}</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Advance (20%): ₹{Math.round(total * 0.2).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Close Button */}
      {isMobile && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setShowPriceSummary(false)}
            className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Close Summary
          </button>
        </div>
      )}
    </div>
  );
} 