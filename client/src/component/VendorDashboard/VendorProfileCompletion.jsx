import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectLoggedInUser } from '../UserLogin/authSlice';
import { 
  FaUpload, FaPlus, FaTrash, FaInfoCircle, FaStar, 
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaGlobe,
  FaSave, FaCheckCircle, FaSpinner
} from 'react-icons/fa';

const VendorProfileCompletion = () => {
  const navigate = useNavigate();
  const user = useSelector(selectLoggedInUser);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [coverImage, setCoverImage] = useState('');

  const [profileData, setProfileData] = useState({
    // Basic Information
    name: '',
    location: '',
    type: '',
    description: '',
    
    // Contact Information
    contact: {
      phone: '',
      email: '',
      website: ''
    },
    
    // Services & Pricing
    services: [''],
    pricing: {
      package: '',
      price: ''
    },
    
    // Media
    photos: [],
    CoverImage: '',
    
    // Business Details
    businessDetails: {
      address: '',
      experience: '',
      teamSize: '',
      languages: [''],
      specializations: ['']
    },
    
    // Social Media
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: ''
    },
    
    // Business Hours
    businessHours: {
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: '',
      sunday: ''
    },
    
    // Ratings & Reviews
    rating: '0.0',
    reviews: 0,
    averageRating: 0
  });

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name || '',
        contact: {
          ...prev.contact,
          email: user.email || '',
          phone: user.phoneNumber || ''
        }
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setProfileData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setProfileData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setProfileData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const setCoverImageFromUploads = (index) => {
    if (uploadedImages[index]) {
      setCoverImage(uploadedImages[index]);
      setProfileData(prev => ({
        ...prev,
        CoverImage: uploadedImages[index]
      }));
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return profileData.name && profileData.location && profileData.type && profileData.description;
      case 2:
        return profileData.contact.phone && profileData.contact.email;
      case 3:
        return profileData.services[0] && profileData.pricing.package && profileData.pricing.price;
      case 4:
        return uploadedImages.length > 0;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSaveProfile = async () => {
    if (!validateStep(currentStep)) {
      toast.error("Please complete all required fields");
      return;
    }

    setSaving(true);
    try {
      const finalData = {
        ...profileData,
        photos: uploadedImages,
        CoverImage: coverImage || uploadedImages[0] || ''
      };

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/vendors/profile`,
        finalData,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        navigate("/vendor-dashboard");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error(error.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-pink-500"
                  placeholder="Your business name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={profileData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-pink-500"
                  placeholder="City, State"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Type *</label>
                <select
                  name="type"
                  value={profileData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-pink-500"
                  required
                >
                  <option value="">Select Business Type</option>
                  <option value="photographer">Photographer</option>
                  <option value="cinematographer">Cinematographer</option>
                  <option value="catering">Catering</option>
                  <option value="decorators">Decorators</option>
                  <option value="makeup">Makeup Artist</option>
                  <option value="mehndi">Mehndi Artist</option>
                  <option value="bands">Live Bands</option>
                  <option value="djs">DJs</option>
                  <option value="music">Music/Dance Artist</option>
                  <option value="fashion">Fashion Wear</option>
                  <option value="jewelry">Jewelry</option>
                  <option value="transport">Transport</option>
                  <option value="others">Others</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Description *</label>
              <textarea
                name="description"
                value={profileData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-pink-500"
                placeholder="Describe your business, services, and what makes you unique..."
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={profileData.contact.phone}
                  onChange={(e) => handleNestedChange('contact', 'phone', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-pink-500"
                  placeholder="+91 XXXXX XXXXX"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={profileData.contact.email}
                  onChange={(e) => handleNestedChange('contact', 'email', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-pink-500"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={profileData.contact.website}
                  onChange={(e) => handleNestedChange('contact', 'website', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-pink-500"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Services & Pricing</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Services Offered *</label>
              {profileData.services.map((service, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={service}
                    onChange={(e) => handleArrayChange('services', index, e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-pink-500"
                    placeholder="e.g., Wedding Photography, Engagement Shoot"
                    required={index === 0}
                  />
                  {profileData.services.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('services', index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('services')}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                + Add Service
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Package Name *</label>
                <input
                  type="text"
                  value={profileData.pricing.package}
                  onChange={(e) => handleNestedChange('pricing', 'package', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., Premium Wedding Package"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Starting Price *</label>
                <input
                  type="text"
                  value={profileData.pricing.price}
                  onChange={(e) => handleNestedChange('pricing', 'price', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., ₹25,000"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Business Photos</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Business Photos *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <FaUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600">Click to upload photos or drag and drop</p>
                  <p className="text-sm text-gray-500 mt-2">PNG, JPG, JPEG up to 10MB each</p>
                </label>
              </div>
            </div>

            {uploadedImages.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Uploaded Images ({uploadedImages.length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className={`w-full h-24 object-cover rounded-lg cursor-pointer ${
                          coverImage === image ? 'ring-2 ring-pink-500' : ''
                        }`}
                        onClick={() => setCoverImageFromUploads(index)}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                      {coverImage === image && (
                        <div className="absolute top-1 left-1 bg-pink-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          <FaStar />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Click on an image to set it as your cover photo
                </p>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Additional Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                <input
                  type="text"
                  value={profileData.businessDetails.experience}
                  onChange={(e) => handleNestedChange('businessDetails', 'experience', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., 5+ years"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
                <input
                  type="text"
                  value={profileData.businessDetails.teamSize}
                  onChange={(e) => handleNestedChange('businessDetails', 'teamSize', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., 10-15 people"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                value={profileData.businessDetails.address}
                onChange={(e) => handleNestedChange('businessDetails', 'address', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-pink-500"
                placeholder="Complete business address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Languages Spoken</label>
              {profileData.businessDetails.languages.map((language, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={language}
                    onChange={(e) => handleArrayChange('businessDetails.languages', index, e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-pink-500"
                    placeholder="e.g., English, Hindi"
                  />
                  {profileData.businessDetails.languages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('businessDetails.languages', index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('businessDetails.languages')}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                + Add Language
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-600 to-pink-700 text-white px-6 py-8">
            <h1 className="text-3xl font-bold text-center">Complete Your Profile</h1>
            <p className="text-center mt-2 text-pink-100">
              Fill in your business details to appear in our marketplace
            </p>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4 bg-gray-50 border-b">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep} of 5
              </span>
              <span className="text-sm text-gray-500">
                {Math.round((currentStep / 5) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-pink-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-2 rounded-md font-medium ${
                  currentStep === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-500 text-white hover:bg-gray-600"
                }`}
              >
                Previous
              </button>

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-pink-600 text-white rounded-md font-medium hover:bg-pink-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className={`px-8 py-2 rounded-md font-medium flex items-center ${
                    saving
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {saving ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" />
                      Save Profile
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfileCompletion; 