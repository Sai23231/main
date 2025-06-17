import React, { useState } from 'react';

const placeholderImg = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80';

const VendorServices = () => {
  const [services, setServices] = useState([
    {
      id: 1,
      title: 'Wedding Photography Package',
      description: 'Complete wedding photography coverage including pre-wedding shoot',
      price: '₹50,000',
      category: 'Photography',
      image: placeholderImg
    }
  ]);

  const [isAddingService, setIsAddingService] = useState(false);
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: ''
  });
  const [editServiceId, setEditServiceId] = useState(null);
  const [editService, setEditService] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteServiceId, setDeleteServiceId] = useState(null);

  const handleAddService = () => {
    setIsAddingService(true);
  };

  const handleSaveService = () => {
    if (newService.title && newService.price) {
      setServices(prev => [...prev, { ...newService, id: Date.now(), image: newService.image || placeholderImg }]);
      setNewService({
        title: '',
        description: '',
        price: '',
        category: '',
        image: ''
      });
      setIsAddingService(false);
    }
  };

  const handleCancelAdd = () => {
    setIsAddingService(false);
    setNewService({
      title: '',
      description: '',
      price: '',
      category: '',
      image: ''
    });
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">My Services</h2>
        {!isAddingService && (
          <button
            onClick={handleAddService}
            className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition-colors"
          >
            Add New Service
          </button>
        )}
      </div>

      {isAddingService && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Service</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Service Title</label>
              <input
                type="text"
                name="title"
                value={newService.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={newService.description}
                onChange={handleChange}
                rows="3"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="text"
                name="price"
                value={newService.price}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                name="category"
                value={newService.category}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="text"
                name="image"
                value={newService.image}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              />
            </div>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={handleSaveService}
                className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition-colors"
              >
                Save Service
              </button>
              <button
                onClick={handleCancelAdd}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {services.map(service => (
          <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {editServiceId === service.id ? (
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Service</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Service Title</label>
                    <input
                      type="text"
                      name="title"
                      value={editService.title}
                      onChange={e => handleChange(e, true)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="description"
                      value={editService.description}
                      onChange={e => handleChange(e, true)}
                      rows="3"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                      type="text"
                      name="price"
                      value={editService.price}
                      onChange={e => handleChange(e, true)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={editService.category}
                      onChange={e => handleChange(e, true)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input
                      type="text"
                      name="image"
                      value={editService.image}
                      onChange={e => handleChange(e, true)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Upload New Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setEditService(prev => ({ ...prev, image: reader.result }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="mt-1 block w-full text-sm text-gray-500"
                    />
                    {editService.image && (
                      <img
                        src={editService.image}
                        alt="Preview"
                        className="mt-2 h-32 w-32 object-cover rounded-lg border border-pink-200 shadow"
                      />
                    )}
                  </div>
                  <div className="flex space-x-4 mt-4">
                    <button
                      onClick={handleSaveEdit}
                      className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="md:flex">
                <div className="md:flex-shrink-0 flex items-center justify-center p-4 md:pl-8 md:p-0">
                  <img
                    className="h-48 w-full object-cover md:w-48 rounded-xl border-2 border-pink-100 shadow-md transition-transform duration-300 hover:scale-105"
                    src={service.image || placeholderImg}
                    alt={service.title}
                    onError={e => { e.target.onerror = null; e.target.src = placeholderImg; }}
                  />
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                      <p className="mt-2 text-gray-500">{service.description}</p>
                    </div>
                    <p className="text-2xl font-bold text-pink-500">{service.price}</p>
                  </div>
                  <div className="mt-4">
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-pink-100 text-pink-800">
                      {service.category}
                    </span>
                  </div>
                  <div className="mt-6 flex space-x-3">
                    <button className="text-pink-600 hover:text-pink-500" onClick={() => handleEdit(service)}>Edit</button>
                    <button className="text-red-600 hover:text-red-500" onClick={() => handleDelete(service.id)}>Delete</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
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