import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const placeholderImg = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80';

const VendorServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    duration: ''
  });
  const [isAddingService, setIsAddingService] = useState(false);
  const [editServiceId, setEditServiceId] = useState(null);
  const [editService, setEditService] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteServiceId, setDeleteServiceId] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      // For now, we'll use mock data since the backend doesn't have a services endpoint yet
      setServices([
        {
          id: 1,
          name: 'Wedding Photography',
          description: 'Full day wedding photography coverage',
          price: '₹25,000',
          duration: '8 hours'
        },
        {
          id: 2,
          name: 'Engagement Shoot',
          description: '2-hour engagement photography session',
          price: '₹8,000',
          duration: '2 hours'
        }
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to fetch services');
      setLoading(false);
    }
  };

  const handleAddService = () => {
    if (!newService.name || !newService.description || !newService.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    const service = {
      id: Date.now(),
      ...newService
    };

    setServices([...services, service]);
    setNewService({
      name: '',
      description: '',
      price: '',
      duration: ''
    });
    toast.success('Service added successfully!');
  };

  const handleDeleteService = (id) => {
    setServices(services.filter(service => service.id !== id));
    toast.success('Service removed successfully!');
  };

  const handleChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    if (isEdit) {
      setEditService(prev => ({ ...prev, [name]: value }));
    } else {
      setNewService(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEdit = (service) => {
    setEditServiceId(service.id);
    setEditService({ ...service });
  };

  const handleSaveEdit = () => {
    setServices(prev => prev.map(s => s.id === editServiceId ? { ...editService, image: editService.image || placeholderImg } : s));
    setEditServiceId(null);
    setEditService({});
  };

  const handleCancelEdit = () => {
    setEditServiceId(null);
    setEditService({});
  };

  const handleDelete = (id) => {
    setDeleteServiceId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setServices(prev => prev.filter(s => s.id !== deleteServiceId));
    setShowDeleteModal(false);
    setDeleteServiceId(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteServiceId(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">My Services</h2>
        {!isAddingService && (
          <button
            onClick={() => document.getElementById('addServiceModal').classList.remove('hidden')}
            className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition-colors"
          >
            Add New Service
          </button>
        )}
      </div>

      <div className="grid gap-6">
        {services.map((service) => (
          <div key={service.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                <p className="text-gray-600 mt-1">{service.description}</p>
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  <span>Price: <span className="font-semibold text-green-600">{service.price}</span></span>
                  {service.duration && (
                    <span>Duration: <span className="font-semibold">{service.duration}</span></span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDeleteService(service.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
                title="Delete service"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {services.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No services added yet</p>
            <p className="text-sm text-gray-400 mt-1">Add your first service to get started</p>
          </div>
        )}
      </div>

      {/* Add Service Modal */}
      <div id="addServiceModal" className="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h3 className="text-lg font-semibold mb-4">Add New Service</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Service Name *</label>
              <input
                type="text"
                value={newService.name}
                onChange={(e) => setNewService({...newService, name: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                placeholder="e.g., Wedding Photography"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Description *</label>
              <textarea
                value={newService.description}
                onChange={(e) => setNewService({...newService, description: e.target.value})}
                rows="3"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                placeholder="Describe what this service includes"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Price *</label>
              <input
                type="text"
                value={newService.price}
                onChange={(e) => setNewService({...newService, price: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                placeholder="e.g., ₹25,000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration</label>
              <input
                type="text"
                value={newService.duration}
                onChange={(e) => setNewService({...newService, duration: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                placeholder="e.g., 8 hours"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => document.getElementById('addServiceModal').classList.add('hidden')}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddService}
              className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition-colors"
            >
              Add Service
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4 text-center text-pink-700">Delete Service?</h3>
            <p className="text-center mb-6">Are you sure you want to delete this service?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 font-bold"
              >
                Yes, Delete
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorServices; 