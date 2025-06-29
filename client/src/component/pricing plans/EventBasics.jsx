import { useState } from 'react';
import { FiChevronRight, FiMinus, FiPlus, FiCalendar, FiMapPin, FiUsers, FiClock, FiStar, FiCheck, FiHeart, FiHome, FiGift, FiBriefcase, FiMusic, FiArrowRight } from 'react-icons/fi';

function to12Hour(time) {
  if (!time) return { hour: '', minute: '', period: 'AM' };
  let [h, m] = time.split(':');
  h = parseInt(h, 10);
  const period = h >= 12 ? 'PM' : 'AM';
  let hour = h % 12;
  if (hour === 0) hour = 12;
  return { hour: hour.toString().padStart(2, '0'), minute: m, period };
}

function to24Hour(hour, minute, period) {
  let h = parseInt(hour, 10);
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return `${h.toString().padStart(2, '0')}:${minute}`;
}

const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const minutes = ['00', '15', '30', '45'];
const periods = ['AM', 'PM'];

export default function EventBasics({ form, setForm, nextStep, isMobile, getEventTypeColor }) {
  const [selectedEventType, setSelectedEventType] = useState(form.eventType);
  const [selectedLocation, setSelectedLocation] = useState(form.location);
  const [guestCount, setGuestCount] = useState(form.guests);
  const [selectedDate, setSelectedDate] = useState(form.date);
  const [startTime, setStartTime] = useState(form.startTime);
  const [endTime, setEndTime] = useState(form.endTime);

  // Convert 24-hour time to 12-hour format for display
  const startTime12 = to12Hour(startTime);
  const endTime12 = to12Hour(endTime);

  const handleNext = () => {
    setForm({
      ...form,
      eventType: selectedEventType,
      location: selectedLocation,
      guests: guestCount,
      date: selectedDate,
      startTime: startTime,
      endTime: endTime
    });
    nextStep();
  };

  const isFormValid = selectedEventType && selectedLocation && selectedDate && startTime && endTime;

  const eventTypes = [
    { 
      id: 'wedding', 
      name: 'Wedding', 
      icon: <FiGift />, 
      color: 'bg-gradient-to-br from-pink-100 to-red-100 text-pink-600 border-pink-200',
      description: 'Your special day deserves perfection',
      popular: true
    },
    { 
      id: 'birthday', 
      name: 'Birthday', 
      icon: <FiGift />, 
      color: 'bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600 border-purple-200',
      description: 'Celebrate in style'
    },
    { 
      id: 'corporate', 
      name: 'Corporate', 
      icon: <FiBriefcase />, 
      color: 'bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 border-blue-200',
      description: 'Professional events with impact'
    },
    { 
      id: 'social', 
      name: 'Social', 
      icon: <FiUsers />, 
      color: 'bg-gradient-to-br from-green-100 to-emerald-100 text-green-600 border-green-200',
      description: 'Gatherings that bring people together'
    },
    { 
      id: 'concert', 
      name: 'Concert', 
      icon: <FiMusic />, 
      color: 'bg-gradient-to-br from-yellow-100 to-orange-100 text-orange-600 border-orange-200',
      description: 'Unforgettable musical experiences'
    },
    { 
      id: 'engagement', 
      name: 'Engagement', 
      icon: <FiHeart />, 
      color: 'bg-gradient-to-br from-rose-100 to-pink-100 text-rose-600 border-rose-200',
      description: 'The beginning of forever'
    }
  ];

  const locations = ['Mumbai', 'Navi Mumbai', 'Thane', 'Pune', 'Goa', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Let's Plan Your Perfect Event
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Tell us about your event and we'll help you create something amazing
        </p>
      </div>

      {/* Event Type Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FiGift className="w-5 h-5 text-pink-500" />
            What type of event are you planning?
          </h2>
          <span className="text-sm text-gray-500">1 of 4</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {eventTypes.map((eventType) => (
            <button
              key={eventType.id}
              onClick={() => setSelectedEventType(eventType.id)}
              className={`relative p-4 md:p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                selectedEventType === eventType.id
                  ? `${eventType.color} border-current shadow-lg`
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              {eventType.popular && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <FiStar className="w-3 h-3" />
                  Popular
                </div>
              )}
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-xl md:text-2xl ${
                  selectedEventType === eventType.id ? 'bg-white bg-opacity-20' : 'bg-gray-100'
                }`}>
                  {eventType.icon}
                </div>
                <div>
                  <div className="font-semibold text-sm md:text-base">{eventType.name}</div>
                  <div className="text-xs md:text-sm text-gray-500 mt-1">{eventType.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Location Selection */}
      <div className="space-y-4">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
          <FiMapPin className="w-5 h-5 text-pink-500" />
          Where is your event?
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {locations.map((location) => (
            <button
              key={location}
              onClick={() => setSelectedLocation(location)}
              className={`p-3 md:p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                selectedLocation === location
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-transparent shadow-lg'
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="font-medium text-sm md:text-base">{location}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Date and Time Selection */}
      <div className="space-y-4">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
          <FiCalendar className="w-5 h-5 text-pink-500" />
          When is your event?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Date */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-3 md:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          {/* Start Time */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={startTime12.hour}
                onChange={(e) => {
                  const newTime = to24Hour(e.target.value, startTime12.minute, startTime12.period);
                  setStartTime(newTime);
                }}
                className="p-3 md:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Hour</option>
                {hours.map(hour => (
                  <option key={hour} value={hour}>{hour}</option>
                ))}
              </select>
              
              <select
                value={startTime12.minute}
                onChange={(e) => {
                  const newTime = to24Hour(startTime12.hour, e.target.value, startTime12.period);
                  setStartTime(newTime);
                }}
                className="p-3 md:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Min</option>
                {minutes.map(minute => (
                  <option key={minute} value={minute}>{minute}</option>
                ))}
              </select>
              
              <select
                value={startTime12.period}
                onChange={(e) => {
                  const newTime = to24Hour(startTime12.hour, startTime12.minute, e.target.value);
                  setStartTime(newTime);
                }}
                className="p-3 md:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
              >
                {periods.map(period => (
                  <option key={period} value={period}>{period}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* End Time */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={endTime12.hour}
                onChange={(e) => {
                  const newTime = to24Hour(e.target.value, endTime12.minute, endTime12.period);
                  setEndTime(newTime);
                }}
                className="p-3 md:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Hour</option>
                {hours.map(hour => (
                  <option key={hour} value={hour}>{hour}</option>
                ))}
              </select>
              
              <select
                value={endTime12.minute}
                onChange={(e) => {
                  const newTime = to24Hour(endTime12.hour, e.target.value, endTime12.period);
                  setEndTime(newTime);
                }}
                className="p-3 md:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Min</option>
                {minutes.map(minute => (
                  <option key={minute} value={minute}>{minute}</option>
                ))}
              </select>
              
              <select
                value={endTime12.period}
                onChange={(e) => {
                  const newTime = to24Hour(endTime12.hour, endTime12.minute, e.target.value);
                  setEndTime(newTime);
                }}
                className="p-3 md:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
              >
                {periods.map(period => (
                  <option key={period} value={period}>{period}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Count */}
      <div className="space-y-4">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
          <FiUsers className="w-5 h-5 text-pink-500" />
          How many guests are you expecting?
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setGuestCount(Math.max(10, guestCount - 10))}
              className="w-12 h-12 md:w-14 md:h-14 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:border-pink-500 transition-all duration-200"
            >
              <span className="text-xl font-bold text-gray-600">-</span>
            </button>
            
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900">{guestCount}</div>
              <div className="text-sm text-gray-500">guests</div>
            </div>
            
            <button
              onClick={() => setGuestCount(guestCount + 10)}
              className="w-12 h-12 md:w-14 md:h-14 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:border-pink-500 transition-all duration-200"
            >
              <span className="text-xl font-bold text-gray-600">+</span>
            </button>
          </div>
          
          <div className="flex justify-center">
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={guestCount}
              onChange={(e) => setGuestCount(parseInt(e.target.value))}
              className="w-full max-w-md h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 px-2">
            <span>10</span>
            <span>100</span>
            <span>200</span>
            <span>300</span>
            <span>500</span>
          </div>
        </div>
      </div>

      {/* Next Button */}
      <div className="pt-6">
        <button
          onClick={handleNext}
          disabled={!isFormValid}
          className={`w-full py-4 md:py-5 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
            isFormValid
              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg hover:scale-105'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue to Venue Selection
          <FiArrowRight className="w-5 h-5" />
        </button>
        
        {!isFormValid && (
          <p className="text-sm text-gray-500 text-center mt-2">
            Please fill in all required fields to continue
          </p>
        )}
      </div>

      {/* Mobile-specific styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(to right, #ec4899, #9333ea);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(to right, #ec4899, #9333ea);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
} 