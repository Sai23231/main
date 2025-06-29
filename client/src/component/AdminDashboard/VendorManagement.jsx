import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  FiEdit, FiCheckCircle, FiXCircle, FiEye, FiStar, FiMail, 
  FiPhone, FiMapPin, FiClock, FiAward, FiSettings, FiAlertCircle,
  FiUser, FiDollarSign, FiCalendar, FiImage
} from 'react-icons/fi';

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    search: ''
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/vendors/all`, {
        withCredentials: true
      });
      setVendors(response.data || []);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast.error('Failed to fetch vendors');
    } finally {
      setLoading(false);
    }
  };

  const handleVendorAction = async (vendorId, action) => {
    try {
      if (action === 'approve') {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/vendors/${vendorId}/approve`, {}, {
          withCredentials: true
        });
      } else if (action === 'reject') {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/vendors/${vendorId}/reject`, {}, {
          withCredentials: true
        });
      } else if (action === 'suspend') {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/vendors/${vendorId}/suspend`, {}, {
          withCredentials: true
        });
      }
      fetchVendors();
      toast.success(`Vendor ${action}d successfully`);
    } catch (error) {
      console.error('Error performing vendor action:', error);
      toast.error('Failed to perform action');
    }
  };

  const handleEditVendor = (vendor) => {
    setSelectedVendor(vendor);
    setShowEditModal(true);
  };

  const handleViewProfile = (vendor) => {
    setSelectedVendor(vendor);
    setShowProfileModal(true);
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesStatus = filters.status === 'all' || vendor.status === filters.status;
    const matchesCategory = filters.category === 'all' || vendor.category === filters.category;
    const matchesSearch = vendor.businessName?.toLowerCase().includes(filters.search.toLowerCase()) ||
                         vendor.email?.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesStatus && matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading vendors...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Vendor Management</h2>
        <div className="text-sm text-gray-600">
          Total Vendors: {vendors.length}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search vendors..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="photography">Photography</option>
              <option value="catering">Catering</option>
              <option value="decoration">Decoration</option>
              <option value="music">Music</option>
              <option value="transportation">Transportation</option>
              <option value="makeup">Makeup</option>
              <option value="venue">Venue</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ status: 'all', category: 'all', search: '' })}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVendors.map((vendor) => (
                <tr key={vendor._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={vendor.profileImage || 'https://via.placeholder.com/40x40?text=V'}
                          alt={vendor.businessName}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{vendor.businessName}</div>
                        <div className="text-sm text-gray-500">{vendor.email}</div>
                        <div className="text-xs text-gray-400">{vendor.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {vendor.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vendor.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      vendor.status === 'approved' ? 'bg-green-100 text-green-800' :
                      vendor.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      vendor.status === 'suspended' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {vendor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <FiStar className="w-4 h-4 text-yellow-400 mr-1" />
                      {vendor.averageRating || '0.0'}
                      <span className="text-gray-500 ml-1">({vendor.totalReviews || 0})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewProfile(vendor)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Profile"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditVendor(vendor)}
                        className="text-green-600 hover:text-green-900"
                        title="Edit Vendor"
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      {vendor.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleVendorAction(vendor._id, 'approve')}
                            className="text-green-600 hover:text-green-900"
                            title="Approve"
                          >
                            <FiCheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleVendorAction(vendor._id, 'reject')}
                            className="text-red-600 hover:text-red-900"
                            title="Reject"
                          >
                            <FiXCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {vendor.status === 'approved' && (
                        <button
                          onClick={() => handleVendorAction(vendor._id, 'suspend')}
                          className="text-orange-600 hover:text-orange-900"
                          title="Suspend"
                        >
                          <FiAlertCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Vendor Modal */}
      {showEditModal && selectedVendor && (
        <EditVendorModal
          vendor={selectedVendor}
          onClose={() => setShowEditModal(false)}
          onUpdate={fetchVendors}
        />
      )}

      {/* View Profile Modal */}
      {showProfileModal && selectedVendor && (
        <ViewProfileModal
          vendor={selectedVendor}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
};

// Edit Vendor Modal Component
const EditVendorModal = ({ vendor, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    businessName: vendor.businessName || '',
    description: vendor.description || '',
    category: vendor.category || '',
    location: vendor.location || '',
    contact: {
      email: vendor.email || '',
      phone: vendor.phone || '',
      website: vendor.website || ''
    },
    pricing: vendor.pricing || {},
    status: vendor.status || 'pending',
    verificationStatus: vendor.verificationStatus || 'pending',
    featured: vendor.featured || false,
    commissionRate: vendor.commissionRate || 15
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/vendors/${vendor._id}/admin-update`, formData, {
        withCredentials: true
      });
      toast.success('Vendor updated successfully');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating vendor:', error);
      toast.error('Failed to update vendor');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Edit Vendor</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiXCircle className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Category</option>
                  <option value="photography">Photography</option>
                  <option value="catering">Catering</option>
                  <option value="decoration">Decoration</option>
                  <option value="music">Music</option>
                  <option value="transportation">Transportation</option>
                  <option value="makeup">Makeup</option>
                  <option value="venue">Venue</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Commission Rate (%)</label>
                <input
                  type="number"
                  name="commissionRate"
                  value={formData.commissionRate}
                  onChange={handleChange}
                  min="0"
                  max="50"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="contact.email"
                  value={formData.contact.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="contact.phone"
                  value={formData.contact.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Website</label>
                <input
                  type="url"
                  name="contact.website"
                  value={formData.contact.website}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Verification Status</label>
                <select
                  name="verificationStatus"
                  value={formData.verificationStatus}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Featured Vendor
              </label>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Vendor'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// View Profile Modal Component
const ViewProfileModal = ({ vendor, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">Vendor Profile</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiXCircle className="w-6 h-6" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Basic Info */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={vendor.profileImage || 'https://via.placeholder.com/80x80?text=V'}
                    alt={vendor.businessName}
                    className="w-20 h-20 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">{vendor.businessName}</h4>
                    <p className="text-gray-600">{vendor.category}</p>
                    <div className="flex items-center mt-1">
                      <FiStar className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-600">
                        {vendor.averageRating || '0.0'} ({vendor.totalReviews || 0} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FiMapPin className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{vendor.location}</span>
                  </div>
                  <div className="flex items-center">
                    <FiMail className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{vendor.email}</span>
                  </div>
                  <div className="flex items-center">
                    <FiPhone className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{vendor.phone}</span>
                  </div>
                  {vendor.website && (
                    <div className="flex items-center">
                      <FiGlobe className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{vendor.website}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {vendor.description && (
                <div className="mt-6">
                  <h5 className="text-lg font-medium text-gray-900 mb-2">Description</h5>
                  <p className="text-gray-600">{vendor.description}</p>
                </div>
              )}
              
              {vendor.services && vendor.services.length > 0 && (
                <div className="mt-6">
                  <h5 className="text-lg font-medium text-gray-900 mb-2">Services</h5>
                  <div className="flex flex-wrap gap-2">
                    {vendor.services.map((service, index) => (
                      <span
                        key={index}
                        className="inline-flex px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Stats & Status */}
            <div className="space-y-6">
              <div className="bg-white border rounded-lg p-4">
                <h5 className="text-lg font-medium text-gray-900 mb-4">Status & Stats</h5>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`text-sm font-medium ${
                      vendor.status === 'approved' ? 'text-green-600' :
                      vendor.status === 'pending' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {vendor.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Verification:</span>
                    <span className={`text-sm font-medium ${
                      vendor.verificationStatus === 'verified' ? 'text-green-600' :
                      vendor.verificationStatus === 'pending' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {vendor.verificationStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Featured:</span>
                    <span className={`text-sm font-medium ${vendor.featured ? 'text-green-600' : 'text-gray-600'}`}>
                      {vendor.featured ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Commission:</span>
                    <span className="text-sm font-medium text-gray-900">{vendor.commissionRate || 15}%</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border rounded-lg p-4">
                <h5 className="text-lg font-medium text-gray-900 mb-4">Performance</h5>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Bookings:</span>
                    <span className="text-sm font-medium text-gray-900">{vendor.totalBookings || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Completed Events:</span>
                    <span className="text-sm font-medium text-gray-900">{vendor.completedEvents || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Response Rate:</span>
                    <span className="text-sm font-medium text-gray-900">{vendor.responseRate || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorManagement; 