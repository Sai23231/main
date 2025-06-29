import React, { useState, useRef } from 'react';
import { FiChevronLeft, FiCalendar, FiMapPin, FiClock, FiUser, FiMail, FiPhone, FiCheck, FiCreditCard, FiArrowRight, FiArrowLeft, FiStar, FiHome, FiCoffee, FiDroplet, FiCamera, FiMusic, FiPlus, FiTruck, FiEdit3 } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

function getDuration(start, end) {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let startMins = sh * 60 + sm;
  let endMins = eh * 60 + em;
  if (endMins < startMins) endMins += 24 * 60; // handle overnight events
  return (endMins - startMins) / 60;
}

export default function ReviewAndPayment({ form, setForm, prevStep, setConfirmed, calculateTotal, getEventTypeColor, user, isMobile }) {
  const { total } = calculateTotal();
  const advanceAmount = Math.round(total * 0.2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    fullName: form.contactInfo.name || '',
    phone: form.contactInfo.phone || '',
    email: form.contactInfo.email || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });
  const [isEditingShipping, setIsEditingShipping] = useState(false);
  const duration = getDuration(form.startTime, form.endTime);
  const confirmationRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  // Move all delivery/event details here
  const handleInput = (field, value) => {
    setForm({
      ...form,
      contactInfo: {
        ...form.contactInfo,
        [field]: value
      }
    });
  };
  const handleEventDetail = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleShippingInput = (field, value) => {
    setShippingDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveShippingDetails = () => {
    setIsEditingShipping(false);
    // You can save shipping details to form state if needed
    setForm(prev => ({
      ...prev,
      shippingDetails: shippingDetails
    }));
  };

  // Updated Razorpay payment logic
  const handlePayment = async () => {
    if (!user) {
      toast.error('Please login to continue with payment');
      return;
    }

    if (!termsAccepted) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Exclude CONFIG from form before sending
      const { CONFIG, ...formData } = form;
      
      // 1. Create order on backend
      const response = await fetch(`${API_BASE_URL}/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: advanceAmount * 100, // Amount in paise
          userId: user?._id,
          packageDetails: formData
        })
      });

      if (!response.ok) throw new Error(`Failed with status: ${response.status}`);
      
      const data = await response.json();
      if (data?.orderId && data?.key) {
        handlePaymentVerify(data);
      } else {
        throw new Error(data?.message || 'Unable to create order');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Payment failed');
      toast.error(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentVerify = (orderData) => {
    if (!window.Razorpay) {
      toast.error("Payment gateway is not available.");
      return;
    }

    const options = {
      key: orderData.key,
      amount: orderData.amount * 100,
      currency: orderData.currency || 'INR',
      name: 'Dream Ventz',
      description: 'Event Advance Payment',
      order_id: orderData.orderId,
      handler: async function (response) {
        try {
          // 3. Verify payment on backend
          const verifyRes = await fetch(`${API_BASE_URL}/payment/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: orderData.orderId,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            })
          });

          if (!verifyRes.ok) throw new Error('Payment verification failed');
          
          const verifyData = await verifyRes.json();
          if (!verifyData.success) throw new Error('Payment verification failed');

          // 4. Save custom package to backend
          const { CONFIG, ...formData } = form;
          const saveRes = await fetch(`${API_BASE_URL}/custom-packages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user?._id,
              packageDetails: formData,
              paymentId: orderData.orderId,
              totalAmount: total,
              advanceAmount: advanceAmount,
              remainingAmount: total - advanceAmount,
              paymentStatus: 'advance_paid'
            })
          });
          
          if (!saveRes.ok) throw new Error('Failed to save package');
          
          toast.success('Payment successful! Your booking has been confirmed.');
          setConfirmed(true);
          setTimeout(() => {
            if (confirmationRef.current) {
              confirmationRef.current.scrollIntoView({ behavior: 'smooth' });
            }
          }, 200);
        } catch (error) {
          console.error(error);
          toast.error('Payment verification failed.');
        }
      },
      prefill: {
        name: form.contactInfo.name,
        email: form.contactInfo.email,
        contact: form.contactInfo.phone
      },
      theme: { color: '#ec4899' }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const getEventTypeName = (eventTypeId) => {
    const eventType = form.CONFIG.eventTypes.find(e => e.id === eventTypeId);
    return eventType ? eventType.name : eventTypeId;
  };

  const getVenueTypeName = (venueTypeId) => {
    const venueType = form.CONFIG.venueTypes.find(v => v.id === venueTypeId);
    return venueType ? venueType.name : venueTypeId;
  };

  return (
    <div className="space-y-6">
      <Toaster />
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Review & Payment
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Review your event details and complete your booking
        </p>
      </div>

      {/* Event Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FiCalendar className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-pink-500`} />
          Event Details
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getEventTypeColor()}`}>
                <FiStar className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
              </div>
              <div>
                <div className="font-medium text-gray-900">{getEventTypeName(form.eventType)}</div>
                <div className="text-sm text-gray-600">Event Type</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <FiCalendar className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-gray-400`} />
              <div>
                <div className="font-medium text-gray-900">{form.date}</div>
                <div className="text-sm text-gray-600">Date</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <FiMapPin className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-gray-400`} />
              <div>
                <div className="font-medium text-gray-900">{form.location}</div>
                <div className="text-sm text-gray-600">Location</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FiUser className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-gray-400`} />
              <div>
                <div className="font-medium text-gray-900">{form.guests} guests</div>
                <div className="text-sm text-gray-600">Guest Count</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <FiClock className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-gray-400`} />
              <div>
                <div className="font-medium text-gray-900">{form.startTime} - {form.endTime}</div>
                <div className="text-sm text-gray-600">{duration} hour{duration !== 1 ? 's' : ''}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FiTruck className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-pink-500`} />
            Shipping Details
          </h2>
          <button
            onClick={() => setIsEditingShipping(!isEditingShipping)}
            className="flex items-center gap-1 text-pink-600 hover:text-pink-700 text-sm font-medium"
          >
            <FiEdit3 className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
            {isEditingShipping ? 'Cancel' : 'Edit'}
          </button>
        </div>
        
        {isEditingShipping ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={shippingDetails.fullName}
                  onChange={(e) => handleShippingInput('fullName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={shippingDetails.phone}
                  onChange={(e) => handleShippingInput('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input
                type="email"
                value={shippingDetails.email}
                onChange={(e) => handleShippingInput('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="Enter email address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Complete Address *</label>
              <textarea
                value={shippingDetails.address}
                onChange={(e) => handleShippingInput('address', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 placeholder-gray-500 resize-none"
                placeholder="Enter complete address (House/Flat No., Street, Area)"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  value={shippingDetails.city}
                  onChange={(e) => handleShippingInput('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <input
                  type="text"
                  value={shippingDetails.state}
                  onChange={(e) => handleShippingInput('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Enter state"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                <input
                  type="text"
                  value={shippingDetails.pincode}
                  onChange={(e) => handleShippingInput('pincode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Enter pincode"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Landmark (Optional)</label>
              <input
                type="text"
                value={shippingDetails.landmark}
                onChange={(e) => handleShippingInput('landmark', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="Nearby landmark for easy location"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={saveShippingDetails}
                className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                Save Details
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FiUser className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-gray-400`} />
              <div>
                <div className="font-medium text-gray-900">{shippingDetails.fullName || 'Not provided'}</div>
                <div className="text-sm text-gray-600">Full Name</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <FiPhone className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-gray-400`} />
              <div>
                <div className="font-medium text-gray-900">{shippingDetails.phone || 'Not provided'}</div>
                <div className="text-sm text-gray-600">Phone Number</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <FiMail className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-gray-400`} />
              <div>
                <div className="font-medium text-gray-900">{shippingDetails.email || 'Not provided'}</div>
                <div className="text-sm text-gray-600">Email Address</div>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <FiMapPin className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-gray-400 mt-0.5`} />
              <div>
                <div className="font-medium text-gray-900">
                  {shippingDetails.address ? (
                    <>
                      {shippingDetails.address}
                      {shippingDetails.city && <>, {shippingDetails.city}</>}
                      {shippingDetails.state && <>, {shippingDetails.state}</>}
                      {shippingDetails.pincode && <> - {shippingDetails.pincode}</>}
                      {shippingDetails.landmark && (
                        <div className="text-sm text-gray-500 mt-1">
                          Near: {shippingDetails.landmark}
                        </div>
                      )}
                    </>
                  ) : (
                    'Address not provided'
                  )}
                </div>
                <div className="text-sm text-gray-600">Shipping Address</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Venue Details */}
      {form.needsVenue && form.venueDetails.type && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FiHome className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-pink-500`} />
            Venue Details
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                <FiHome className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-pink-600`} />
              </div>
              <div>
                <div className="font-medium text-gray-900">{getVenueTypeName(form.venueDetails.type)}</div>
                <div className="text-sm text-gray-600">Venue Type</div>
              </div>
            </div>
            
            {form.venueDetails.amenities.length > 0 && (
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Amenities:</div>
                <div className="flex flex-wrap gap-2">
                  {form.venueDetails.amenities.map((amenity) => (
                    <span key={amenity} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Services Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FiStar className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-pink-500`} />
          Selected Services
        </h2>
        
        <div className="space-y-4">
          {/* Catering */}
          {form.selectedServices.catering.type && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                <FiCoffee className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-pink-600`} />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">Catering</div>
                <div className="text-sm text-gray-600">
                  {form.CONFIG.cateringOptions.find(c => c.id === form.selectedServices.catering.type)?.name}
                </div>
              </div>
            </div>
          )}
          
          {/* Decor */}
          {form.selectedServices.decor.theme && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                <FiDroplet className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-pink-600`} />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">Decor</div>
                <div className="text-sm text-gray-600">
                  {form.CONFIG.decorThemes.find(d => d.id === form.selectedServices.decor.theme)?.name}
                </div>
              </div>
            </div>
          )}
          
          {/* Photography */}
          {form.selectedServices.photography.package && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                <FiCamera className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-pink-600`} />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">Photography</div>
                <div className="text-sm text-gray-600">
                  {form.CONFIG.photographyPackages.find(p => p.id === form.selectedServices.photography.package)?.name}
                </div>
              </div>
            </div>
          )}
          
          {/* Entertainment */}
          {form.selectedServices.entertainment.ids?.length > 0 && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                <FiMusic className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-pink-600`} />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">Entertainment</div>
                <div className="text-sm text-gray-600">
                  {form.selectedServices.entertainment.ids.map(id => 
                    form.CONFIG.entertainmentOptions.find(e => e.id === id)?.name
                  ).join(', ')}
                </div>
              </div>
            </div>
          )}
          
          {/* Other Services */}
          {form.selectedServices.other.ids?.length > 0 && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                <FiPlus className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-pink-600`} />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">Additional Services</div>
                <div className="text-sm text-gray-600">
                  {form.selectedServices.other.ids.map(id => 
                    form.CONFIG.otherServices.find(o => o.id === id)?.name
                  ).join(', ')}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FiCreditCard className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-pink-500`} />
          Payment Summary
        </h2>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">₹{Math.round(total * 0.95).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Service Fee (5%):</span>
            <span className="font-medium">₹{Math.round(total * 0.05).toLocaleString()}</span>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-lg font-bold text-pink-600">₹{total.toLocaleString()}</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Advance Payment (20%): ₹{advanceAmount.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-1 w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
          />
          <label htmlFor="terms" className="text-sm text-gray-700">
            I agree to the <a href="#" className="text-pink-600 hover:underline">Terms and Conditions</a> and 
            <a href="#" className="text-pink-600 hover:underline"> Privacy Policy</a>. I understand that this is an advance payment of 20% and the remaining 80% will be due after event completion.
          </label>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button
          onClick={prevStep}
          className="flex-1 sm:flex-none py-4 md:py-5 px-6 rounded-xl font-semibold text-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <FiArrowLeft className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
          Back
        </button>
        
        <button
          onClick={handlePayment}
          disabled={!termsAccepted || loading || !user}
          className={`flex-1 sm:flex-none py-4 md:py-5 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
            termsAccepted && !loading && user
              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg hover:scale-105'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            <>
              Pay Advance (20%)
              <FiArrowRight className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
            </>
          )}
        </button>
      </div>

      {!user && (
        <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            Please login to proceed with payment
          </p>
        </div>
      )}

      <div ref={confirmationRef}></div>
    </div>
  );
} 