import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  FaUpload, FaPlus, FaTrash, FaEdit, FaSave, FaTimes,
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaCamera,
  FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaClock
} from 'react-icons/fa';

const VendorProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    type: '',
    description: '',
    CoverImage: '',
    photos: [],
    pricing: {
      package: 'Standard Package',
      price: 'Contact for pricing'
    },
    contact: {
      phone: '',
      email: '',
      website: ''
    },
    businessDetails: {
      address: '',
      experience: '',
      teamSize: '',
      languages: [],
      specializations: []
    },
    businessHours: {
      monday: '9:00 AM - 6:00 PM',
      tuesday: '9:00 AM - 6:00 PM',
      wednesday: '9:00 AM - 6:00 PM',
      thursday: '9:00 AM - 6:00 PM',
      friday: '9:00 AM - 6:00 PM',
      saturday: '9:00 AM - 4:00 PM',
      sunday: 'Closed'
    },
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: ''
    },
    services: []
  });

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newService, setNewService] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newSpecialization, setNewSpecialization] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/vendor/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('vendorToken')}`
        }
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setProfile(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (parent, field, value) => {
    setProfile(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const addArrayItem = (parent, field, value) => {
    if (!value.trim()) return;
    setProfile(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: [...(prev[parent][field] || []), value.trim()]
      }
    }));
  };

  const removeArrayItem = (parent, field, index) => {
    setProfile(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: prev[parent][field].filter((_, i) => i !== index)
      }
    }));
  };

  const handleImageUpload = async (e, type = 'cover') => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/upload/images`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('vendorToken')}`
          }
        }
      );

      if (type === 'cover') {
        setProfile(prev => ({
          ...prev,
          CoverImage: response.data.urls[0]
        }));
      } else {
        setProfile(prev => ({
          ...prev,
          photos: [...prev.photos, ...response.data.urls]
        }));
      }

      toast.success('Images uploaded successfully!');
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index, type = 'photos') => {
    if (type === 'cover') {
      setProfile(prev => ({
        ...prev,
        CoverImage: ''
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        photos: prev.photos.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/vendor/profile`,
        profile,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('vendorToken')}`
          }
        }
      );
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Profile Management</h2>
        <div className="flex gap-3">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors flex items-center gap-2"
              >
                <FaSave />
                Save Changes
              </button>
              <button
                onClick={() => setEditing(false)}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <FaTimes />
                Cancel
              </button>
            </>
          ) : (
          <button
              onClick={() => setEditing(true)}
              className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors flex items-center gap-2"
          >
              <FaEdit />
            Edit Profile
          </button>
        )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!editing}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!editing}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!editing}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                disabled={!editing}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
              <input
                type="text"
                value={profile.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                disabled={!editing}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:bg-gray-50"
              />
      </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={profile.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                disabled={!editing}
                rows="4"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
          <div className="space-y-4">
                <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                  <input
                type="tel"
                value={profile.contact.phone}
                onChange={(e) => handleNestedChange('contact', 'phone', e.target.value)}
                disabled={!editing}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:bg-gray-50"
                  />
                </div>

                <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                  <input
                type="email"
                value={profile.contact.email}
                onChange={(e) => handleNestedChange('contact', 'email', e.target.value)}
                disabled={!editing}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:bg-gray-50"
                  />
                </div>

                <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                type="url"
                value={profile.contact.website}
                onChange={(e) => handleNestedChange('contact', 'website', e.target.value)}
                disabled={!editing}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:bg-gray-50"
                  />
                </div>
          </div>
        </div>
      </div>

      {/* Business Details */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Business Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
                <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                value={profile.businessDetails.address}
                onChange={(e) => handleNestedChange('businessDetails', 'address', e.target.value)}
                disabled={!editing}
                rows="3"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:bg-gray-50"
                  />
                </div>

                <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                  <input
                    type="text"
                value={profile.businessDetails.experience}
                onChange={(e) => handleNestedChange('businessDetails', 'experience', e.target.value)}
                disabled={!editing}
                placeholder="e.g., 5+ years"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:bg-gray-50"
                  />
                </div>

                <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
                  <input
                    type="text"
                value={profile.businessDetails.teamSize}
                onChange={(e) => handleNestedChange('businessDetails', 'teamSize', e.target.value)}
                disabled={!editing}
                placeholder="e.g., 5-10 people"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:bg-gray-50"
                  />
                </div>
          </div>

          <div className="space-y-4">
                <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
              <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  disabled={!editing}
                  placeholder="Add language"
                  className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:bg-gray-50"
                />
                {editing && (
                  <button
                    onClick={() => {
                      addArrayItem('businessDetails', 'languages', newLanguage);
                      setNewLanguage('');
                    }}
                    className="bg-pink-600 text-white px-3 py-2 rounded-md hover:bg-pink-700 transition-colors"
                  >
                    <FaPlus />
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.businessDetails.languages?.map((lang, index) => (
                  <span key={index} className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {lang}
                    {editing && (
                      <button
                        onClick={() => removeArrayItem('businessDetails', 'languages', index)}
                        className="text-pink-500 hover:text-pink-700"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
                </div>

                <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specializations</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newSpecialization}
                  onChange={(e) => setNewSpecialization(e.target.value)}
                  disabled={!editing}
                  placeholder="Add specialization"
                  className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:bg-gray-50"
                />
                {editing && (
                  <button
                    onClick={() => {
                      addArrayItem('businessDetails', 'specializations', newSpecialization);
                      setNewSpecialization('');
                    }}
                    className="bg-pink-600 text-white px-3 py-2 rounded-md hover:bg-pink-700 transition-colors"
                  >
                    <FaPlus />
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.businessDetails.specializations?.map((spec, index) => (
                  <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {spec}
                    {editing && (
                      <button
                        onClick={() => removeArrayItem('businessDetails', 'specializations', index)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Services</h3>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              disabled={!editing}
              placeholder="Add a service"
              className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:bg-gray-50"
            />
            {editing && (
              <button
                onClick={() => {
                  addArrayItem('', 'services', newService);
                  setNewService('');
                }}
                className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors flex items-center gap-2"
              >
                <FaPlus />
                Add
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {profile.services?.map((service, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                <span>{service}</span>
                {editing && (
                  <button
                    onClick={() => removeArrayItem('', 'services', index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Package Name</label>
            <input
              type="text"
              value={profile.pricing.package}
              onChange={(e) => handleNestedChange('pricing', 'package', e.target.value)}
              disabled={!editing}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:bg-gray-50"
            />
                </div>
                <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
            <input
              type="text"
              value={profile.pricing.price}
              onChange={(e) => handleNestedChange('pricing', 'price', e.target.value)}
              disabled={!editing}
              placeholder="e.g., ₹25,000 or Contact for pricing"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Business Hours</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(profile.businessHours).map(([day, hours]) => (
            <div key={day}>
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{day}</label>
              <input
                type="text"
                value={hours}
                onChange={(e) => handleNestedChange('businessHours', day, e.target.value)}
                disabled={!editing}
                placeholder="e.g., 9:00 AM - 6:00 PM"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:bg-gray-50"
              />
            </div>
          ))}
        </div>
                </div>

      {/* Social Media */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Social Media</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
            <input
              type="url"
              value={profile.socialMedia.facebook}
              onChange={(e) => handleNestedChange('socialMedia', 'facebook', e.target.value)}
              disabled={!editing}
              placeholder="https://facebook.com/yourpage"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:bg-gray-50"
            />
                  </div>
                  <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
            <input
              type="url"
              value={profile.socialMedia.instagram}
              onChange={(e) => handleNestedChange('socialMedia', 'instagram', e.target.value)}
              disabled={!editing}
              placeholder="https://instagram.com/yourhandle"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:bg-gray-50"
            />
                  </div>
                  <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
            <input
              type="url"
              value={profile.socialMedia.twitter}
              onChange={(e) => handleNestedChange('socialMedia', 'twitter', e.target.value)}
              disabled={!editing}
              placeholder="https://twitter.com/yourhandle"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:bg-gray-50"
            />
                  </div>
                  <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
            <input
              type="url"
              value={profile.socialMedia.linkedin}
              onChange={(e) => handleNestedChange('socialMedia', 'linkedin', e.target.value)}
              disabled={!editing}
              placeholder="https://linkedin.com/in/yourprofile"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:bg-gray-50"
            />
          </div>
                  </div>
                </div>

      {/* Images */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Images</h3>
        
        {/* Cover Image */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
          <div className="relative">
            {profile.CoverImage ? (
              <div className="relative">
                <img
                  src={profile.CoverImage}
                  alt="Cover"
                  className="w-full h-48 object-cover rounded-lg"
                />
                {editing && (
                  <button
                    onClick={() => removeImage(0, 'cover')}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ) : (
              <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <FaCamera className="text-gray-400 text-3xl mx-auto mb-2" />
                  <p className="text-gray-500">No cover image</p>
                </div>
              </div>
            )}
            {editing && (
              <label className="absolute bottom-2 right-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors cursor-pointer">
                <FaUpload className="inline mr-2" />
                Upload Cover
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'cover')}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Gallery Images */}
                <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {profile.photos?.map((photo, index) => (
              <div key={index} className="relative">
                <img
                  src={photo}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                {editing && (
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                )}
              </div>
            ))}
            {editing && (
              <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-pink-300 transition-colors">
                <div className="text-center">
                  <FaUpload className="text-gray-400 text-2xl mx-auto mb-1" />
                  <p className="text-gray-500 text-sm">Add Photo</p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile; 