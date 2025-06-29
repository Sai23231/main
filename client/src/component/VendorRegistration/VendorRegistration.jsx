import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaPlus, FaTrash, FaInfoCircle, FaCheck, FaSpinner } from 'react-icons/fa';

const VendorRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    description: '',
    location: '',
    businessType: '',
    services: [''],
    pricing: {
      package: '',
      price: ''
    },
    contact: {
      phone: '',
      email: '',
      website: ''
    },
    CoverImage: '',
    businessDetails: {
      experience: '',
      teamSize: '',
      specialties: []
    },
    businessHours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '18:00', closed: false },
      sunday: { open: '09:00', close: '18:00', closed: true }
    },
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: ''
    }
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isExistingVendor, setIsExistingVendor] = useState(false);
  const navigate = useNavigate();

  const totalSteps = 4;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
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

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.name && formData.email && formData.phone && formData.password && formData.confirmPassword && formData.businessType;
      case 2:
        return formData.businessName && formData.description && formData.location;
      case 3:
        return formData.services[0] && formData.pricing.package && formData.pricing.price;
      case 4:
        return uploadedImages.length > 0;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 1 && formData.password !== formData.confirmPassword) {
        toast.error("Passwords don't match");
        return;
      }
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Map fields according to backend expectations
      const submissionData = {
        name: formData.businessName, // Backend expects business name as 'name'
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        businessName: formData.businessName,
        description: formData.description,
        location: formData.location,
        businessType: formData.businessType,
        services: formData.services.filter(service => service.trim() !== ''),
        pricing: formData.pricing,
        contact: {
          phone: formData.contact.phone || formData.phone,
          email: formData.contact.email || formData.email,
          website: formData.contact.website || ''
        },
        photos: uploadedImages,
        CoverImage: uploadedImages.length > 0 ? uploadedImages[0] : '', // Use first image as cover
        businessDetails: formData.businessDetails,
        businessHours: formData.businessHours,
        socialMedia: formData.socialMedia,
        status: "pending",
        isExistingVendor: isExistingVendor
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/vendor/register`,
        submissionData
      );

      if (response.data.success) {
        if (isExistingVendor) {
          toast.success("Registration submitted successfully! Please wait for admin approval.");
          navigate("/vendor-registration-success");
        } else {
          toast.success("Registration successful! You can now log in and complete your portfolio.");
          navigate("/vendorlogin");
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="+91 98765 43210"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Type *</label>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Select business type</option>
                  <option value="photography">Photography</option>
                  <option value="cinematography">Cinematography</option>
                  <option value="catering">Catering</option>
                  <option value="decoration">Decoration</option>
                  <option value="music">Music & Entertainment</option>
                  <option value="makeup">Makeup & Beauty</option>
                  <option value="transportation">Transportation</option>
                  <option value="jewelry">Jewelry</option>
                  <option value="clothing">Clothing & Attire</option>
                  <option value="planning">Event Planning</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Create a password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <FaInfoCircle className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900">Are you an existing vendor?</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    If you're already listed on our platform, check this to expedite your registration process.
                  </p>
                  <label className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      checked={isExistingVendor}
                      onChange={(e) => setIsExistingVendor(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">I am an existing vendor on your platform</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Business Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Your business name"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="City, State"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Tell us about your business, experience, and what makes you unique..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                <input
                  type="text"
                  value={formData.businessDetails.experience}
                  onChange={(e) => handleNestedChange('businessDetails', 'experience', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="e.g., 5+ years"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
                <input
                  type="text"
                  value={formData.businessDetails.teamSize}
                  onChange={(e) => handleNestedChange('businessDetails', 'teamSize', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="e.g., 10-15 people"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Services & Pricing</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Services Offered *</label>
                {formData.services.map((service, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={service}
                      onChange={(e) => handleArrayChange('services', index, e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md"
                      placeholder="e.g., Wedding Photography"
                      required
                    />
                    {formData.services.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('services', index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('services')}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <FaPlus className="mr-1" />
                  Add another service
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Package Name *</label>
                  <input
                    type="text"
                    value={formData.pricing.package}
                    onChange={(e) => handleNestedChange('pricing', 'package', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="e.g., Premium Wedding Package"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                  <input
                    type="text"
                    value={formData.pricing.price}
                    onChange={(e) => handleNestedChange('pricing', 'price', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="e.g., ₹50,000 or Contact for pricing"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Portfolio & Images</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Portfolio Images *</label>
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
                    <FaUpload className="mx-auto text-gray-400 text-3xl mb-2" />
                    <p className="text-gray-600">Click to upload images or drag and drop</p>
                    <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 10MB each</p>
                  </label>
                </div>
              </div>

              {uploadedImages.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images ({uploadedImages.length})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-start">
                <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-green-900">Almost Done!</h4>
                  <p className="text-sm text-green-700 mt-1">
                    After registration, you'll be able to log in and complete your portfolio with additional details, business hours, and social media links.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Registration</h1>
            <p className="text-gray-600">Join our platform and showcase your services to couples</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          <form onSubmit={handleSubmit}>
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-2 rounded-md ${
                  currentStep === 1
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                Previous
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md hover:from-pink-600 hover:to-purple-600"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-2 rounded-md flex items-center ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
                  } text-white`}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Complete Registration'
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              Already have an account?{' '}
              <a href="/vendorlogin" className="text-pink-600 hover:text-pink-500">
                Sign in here
              </a>
            </p>
            <p className="mt-2">
              Are you an existing vendor?{' '}
              <a href="/vendor-claim" className="text-blue-600 hover:text-blue-500">
                Claim your business
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorRegistration;
