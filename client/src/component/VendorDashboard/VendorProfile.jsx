import React, { useState } from 'react';

const VendorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Moments By Rj',
    email: 'jelep70594s51@ingitel.com',
    phone: '9920829537',
    location: 'Mumbai',
    category: 'photographer',
    description: 'Professional wedding photographer with 5+ years of experience',
    profileImage: 'https://via.placeholder.com/150'
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  const placeholderImg = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80';

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(profile);
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    // TODO: API call to update profile
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">My Profile</h2>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Image */}
        <div className="md:col-span-1">
          <div className="flex flex-col items-center">
            <img
              src={profile.profileImage || placeholderImg}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mb-4 border-2 border-pink-100 shadow-md transition-transform duration-300 hover:scale-105"
              onError={e => { e.target.onerror = null; e.target.src = placeholderImg; }}
            />
            {isEditing && (
              <button className="text-pink-500 text-sm">Change Photo</button>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-4">
            {isEditing ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editedProfile.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editedProfile.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editedProfile.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={editedProfile.location}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={editedProfile.category}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={editedProfile.description}
                    onChange={handleChange}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={handleSave}
                    className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{profile.name}</h3>
                  <p className="text-gray-500">{profile.category}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="mt-1">{profile.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="mt-1">{profile.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="mt-1">{profile.location}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">About</p>
                  <p className="mt-1">{profile.description}</p>
                </div>
                {/* Vendor Availability Section */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Availability</h4>
                  {/* Placeholder for availability data, to be filled by backend */}
                  <div className="bg-pink-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">Available Dates/Slots will be shown here.</p>
                    {/* Example: */}
                    <ul className="mt-2 list-disc ml-5 text-sm text-gray-800">
                      <li>2025-05-10 (Booked)</li>
                      <li>2025-05-15 (Available)</li>
                      {/* When backend is connected, map over real data here */}
                    </ul>
                    <p className="text-xs text-gray-400 mt-2">(This section will update automatically when backend logic is added.)</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile; 