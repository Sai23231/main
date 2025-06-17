import React, { useState, useEffect } from "react";
import axios from "axios"; // Keeping axios import in case it's used elsewhere in a larger context, though not directly in the admin panel logic here.
import {
  Home,
  BarChart,
  DollarSign,
  BookOpen,
  MessageSquare,
  UserPlus,
  Edit,
  Trash2,
  Pin,
  Check,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectLoggedInUser } from "../UserLogin/authSlice";

// Placeholder for a custom confirmation modal.
// In a real application, you would implement a UI modal here
// instead of using window.confirm.
const CustomConfirmModal = ({ message, onConfirm, onCancel }) => {
  // This is a simplified placeholder.
  // A full implementation would involve React state to show/hide the modal,
  // and buttons for "Confirm" and "Cancel" that call onConfirm/onCancel.
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <p className="text-lg font-semibold mb-4">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Admin Panel Sub-Components

// Sidebar Navigation Component
const Sidebar = ({ currentPage, setCurrentPage, adminNavItems }) => {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col p-4 rounded-lg shadow-lg">
      <div className="text-2xl font-bold mb-8 text-center">Admin Panel</div>
      <nav className="flex-grow">
        <ul>
          {adminNavItems.map((item) => (
            <li key={item.page} className="mb-2">
              <button
                onClick={() => setCurrentPage(item.page)}
                className={`flex items-center w-full p-3 rounded-md transition-colors duration-200 ${
                  currentPage === item.page
                    ? "bg-indigo-600 text-white shadow-md"
                    : "hover:bg-gray-700 text-gray-300"
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

// Income Analytics Page Component
const IncomeAnalytics = ({ incomeData }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredTransactions = incomeData.transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    return (
      (!start || transactionDate >= start) && (!end || transactionDate <= end)
    );
  });

  const totalFilteredIncome = filteredTransactions
    .reduce((sum, t) => sum + t.amount, 0)
    .toFixed(2);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Income Analytics
      </h2>

      {/* Total Income */}
      <div className="mb-8 p-4 bg-indigo-500 text-white rounded-lg shadow-inner flex items-center justify-between">
        <div className="flex items-center">
          <DollarSign className="h-8 w-8 mr-3" />
          <span className="text-xl font-semibold">Total Income:</span>
        </div>
        <span className="text-4xl font-extrabold">
          ${incomeData.totalIncome.toLocaleString()}
        </span>
      </div>

      {/* Date Filters */}
      <div className="flex flex-wrap gap-4 mb-8 items-center">
        <label htmlFor="startDate" className="font-medium text-gray-700">
          From:
        </label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
        <label htmlFor="endDate" className="font-medium text-gray-700">
          To:
        </label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Monthly/Weekly Earnings Graph (Simplified) */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          Monthly Earnings Overview
        </h3>
        <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
          <p className="text-gray-600 mb-2">
            (A real application would use a charting library like Recharts or
            Chart.js here.)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {incomeData.monthlyEarnings.map((data, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-2 bg-white rounded-md shadow-sm"
              >
                <span className="text-sm font-medium text-gray-700">
                  {data.month}
                </span>
                <span className="text-lg font-bold text-indigo-700">
                  ${data.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Transactions Table */}
      <div>
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          All Transactions
        </h3>
        <div className="overflow-x-auto bg-gray-50 rounded-lg shadow-inner">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${transaction.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTransactions.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No transactions found for the selected date range.
          </p>
        )}
      </div>
    </div>
  );
};

// Pricing Plans Page Component
const PricingPlans = ({ pricingPlans, setPricingPlans }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null); // null for add, object for edit
  const [formErrors, setFormErrors] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  const initialFormState = {
    name: "",
    price: "",
    features: "",
    isActive: true,
  };
  const [planForm, setPlanForm] = useState(initialFormState);

  useEffect(() => {
    if (editingPlan) {
      setPlanForm({
        name: editingPlan.name,
        price: editingPlan.price,
        features: editingPlan.features.join(", "), // Convert array to comma-separated string
        isActive: editingPlan.isActive,
      });
    } else {
      setPlanForm(initialFormState);
    }
  }, [editingPlan]);

  const validateForm = () => {
    const errors = {};
    if (!planForm.name.trim()) errors.name = "Plan name is required.";
    if (
      !planForm.price ||
      isNaN(planForm.price) ||
      parseFloat(planForm.price) <= 0
    )
      errors.price = "Valid price is required.";
    if (!planForm.features.trim()) errors.features = "Features are required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPlanForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newPlanData = {
      ...planForm,
      price: parseFloat(planForm.price),
      features: planForm.features
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f),
    };

    if (editingPlan) {
      // Edit existing plan
      setPricingPlans((prev) =>
        prev.map((plan) =>
          plan.id === editingPlan.id ? { ...plan, ...newPlanData } : plan
        )
      );
      setEditingPlan(null);
    } else {
      // Add new plan
      setPricingPlans((prev) => [
        ...prev,
        {
          id: prev.length ? Math.max(...prev.map((p) => p.id)) + 1 : 1,
          ...newPlanData,
        },
      ]);
      setIsAdding(false);
    }
    setPlanForm(initialFormState);
    setFormErrors({});
  };

  const handleDeleteClick = (id) => {
    setPlanToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    setPricingPlans((prev) => prev.filter((plan) => plan.id !== planToDelete));
    setShowConfirmModal(false);
    setPlanToDelete(null);
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setPlanToDelete(null);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Pricing Plans</h2>

      <button
        onClick={() => {
          setIsAdding(true);
          setEditingPlan(null);
        }}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md shadow-lg transition duration-300 mb-6"
      >
        Add New Plan
      </button>

      {(isAdding || editingPlan) && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-inner">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">
            {editingPlan ? "Edit Plan" : "Add New Plan"}
          </h3>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Plan Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={planForm.name}
                onChange={handleFormChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              {formErrors.name && (
                <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price ($)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={planForm.price}
                onChange={handleFormChange}
                step="0.01"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              {formErrors.price && (
                <p className="text-red-500 text-xs mt-1">{formErrors.price}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="features"
                className="block text-sm font-medium text-gray-700"
              >
                Features (comma-separated)
              </label>
              <textarea
                id="features"
                name="features"
                value={planForm.features}
                onChange={handleFormChange}
                rows="3"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              ></textarea>
              {formErrors.features && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.features}
                </p>
              )}
            </div>
            <div className="md:col-span-2 flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={planForm.isActive}
                onChange={handleFormChange}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label
                htmlFor="isActive"
                className="ml-2 block text-sm font-medium text-gray-700"
              >
                Active Plan
              </label>
            </div>
            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-lg transition duration-300"
              >
                {editingPlan ? "Update Plan" : "Add Plan"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingPlan(null);
                  setFormErrors({});
                  setPlanForm(initialFormState);
                }}
                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md shadow-lg transition duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pricingPlans.map((plan) => (
          <div
            key={plan.id}
            className="bg-gray-100 p-6 rounded-lg shadow-md border border-gray-200"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {plan.name}
            </h3>
            <p className="text-4xl font-extrabold text-indigo-700 mb-4">
              ${plan.price}{" "}
              <span className="text-lg font-medium text-gray-600">/month</span>
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              {plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <div className="flex items-center mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  plan.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {plan.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditingPlan(plan);
                  setIsAdding(false);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-md shadow-md transition duration-300 flex items-center"
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </button>
              <button
                onClick={() => handleDeleteClick(plan.id)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-md shadow-md transition duration-300 flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {pricingPlans.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          No pricing plans available. Add a new one!
        </p>
      )}
      {showConfirmModal && (
        <CustomConfirmModal
          message="Are you sure you want to delete this plan?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

// Blog Manager Page Component
const BlogManager = ({ blogs, setBlogs }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: "",
    content: "",
    thumbnail: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  useEffect(() => {
    if (editingBlog) {
      setBlogForm({
        title: editingBlog.title,
        content: editingBlog.content,
        thumbnail: editingBlog.thumbnail, // Keep existing thumbnail if editing
      });
    } else {
      setBlogForm({ title: "", content: "", thumbnail: "" });
    }
  }, [editingBlog]);

  const validateForm = () => {
    const errors = {};
    if (!blogForm.title.trim()) errors.title = "Blog title is required.";
    if (!blogForm.content.trim()) errors.content = "Blog content is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setBlogForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailUpload = (e) => {
    // In a real app, you'd upload this to a storage service (e.g., Firebase Storage, AWS S3)
    // and get a URL. For this demo, we'll just use a placeholder.
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBlogForm((prev) => ({ ...prev, thumbnail: reader.result })); // Use base64 for preview
      };
      reader.readAsDataURL(file);
    } else {
      setBlogForm((prev) => ({ ...prev, thumbnail: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newBlogData = {
      ...blogForm,
      date: new Date().toISOString().split("T")[0], // Current date
    };

    if (editingBlog) {
      setBlogs((prev) =>
        prev.map((blog) =>
          blog.id === editingBlog.id ? { ...blog, ...newBlogData } : blog
        )
      );
      setEditingBlog(null);
    } else {
      setBlogs((prev) => [
        ...prev,
        {
          id: prev.length ? Math.max(...prev.map((b) => b.id)) + 1 : 1,
          ...newBlogData,
        },
      ]);
      setIsAdding(false);
    }
    setBlogForm({ title: "", content: "", thumbnail: "" });
    setFormErrors({});
  };

  const handleDeleteClick = (id) => {
    setBlogToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    setBlogs((prev) => prev.filter((blog) => blog.id !== blogToDelete));
    setShowConfirmModal(false);
    setBlogToDelete(null);
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setBlogToDelete(null);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Blog Manager</h2>

      <button
        onClick={() => {
          setIsAdding(true);
          setEditingBlog(null);
        }}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md shadow-lg transition duration-300 mb-6"
      >
        Add New Blog Post
      </button>

      {(isAdding || editingBlog) && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-inner">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">
            {editingBlog ? "Edit Blog Post" : "Add New Blog Post"}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <div>
              <label
                htmlFor="blogTitle"
                className="block text-sm font-medium text-gray-700"
              >
                Blog Title
              </label>
              <input
                type="text"
                id="blogTitle"
                name="title"
                value={blogForm.title}
                onChange={handleFormChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              {formErrors.title && (
                <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="blogContent"
                className="block text-sm font-medium text-gray-700"
              >
                Blog Content (Rich Text Editor Placeholder)
              </label>
              <textarea
                id="blogContent"
                name="content"
                value={blogForm.content}
                onChange={handleFormChange}
                rows="10"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your blog content here. In a real application, this would be a rich text editor like TinyMCE or Quill."
              ></textarea>
              {formErrors.content && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.content}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="blogThumbnail"
                className="block text-sm font-medium text-gray-700"
              >
                Upload Thumbnail
              </label>
              <input
                type="file"
                id="blogThumbnail"
                name="thumbnail"
                accept="image/*"
                onChange={handleThumbnailUpload}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {blogForm.thumbnail && (
                <img
                  src={blogForm.thumbnail}
                  alt="Thumbnail Preview"
                  className="mt-2 w-32 h-24 object-cover rounded-md shadow-sm"
                />
              )}
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-lg transition duration-300"
              >
                {editingBlog ? "Update Blog" : "Publish Blog"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingBlog(null);
                  setFormErrors({});
                  setBlogForm({ title: "", content: "", thumbnail: "" });
                }}
                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md shadow-lg transition duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-gray-100 p-6 rounded-lg shadow-md border border-gray-200 flex flex-col"
          >
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="w-full h-40 object-cover rounded-md mb-4"
              onError={(e) =>
                (e.target.src =
                  "https://placehold.co/300x160/A0AEC0/FFFFFF?text=No+Image")
              }
            />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {blog.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3">Published: {blog.date}</p>
            <p className="text-gray-700 text-sm flex-grow mb-4 line-clamp-3">
              {blog.content}
            </p>
            <div className="flex gap-3 mt-auto">
              <button
                onClick={() => {
                  setEditingBlog(blog);
                  setIsAdding(false);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-md shadow-md transition duration-300 flex items-center"
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </button>
              <button
                onClick={() => handleDeleteClick(blog.id)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-md shadow-md transition duration-300 flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {blogs.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          No blog posts available. Start writing!
        </p>
      )}
      {showConfirmModal && (
        <CustomConfirmModal
          message="Are you sure you want to delete this blog post?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

// User Reviews & Testimonials Page Component
const UserReviews = ({ userReviews, setUserReviews }) => {
  const togglePin = (id) => {
    setUserReviews((prev) =>
      prev.map((review) =>
        review.id === id ? { ...review, isPinned: !review.isPinned } : review
      )
    );
  };

  const pinnedReviews = userReviews.filter((review) => review.isPinned);
  const unpinnedReviews = userReviews.filter((review) => !review.isPinned);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        User Reviews & Testimonials
      </h2>

      {/* Pinned Testimonials Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          Pinned Testimonials
        </h3>
        {pinnedReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pinnedReviews.map((review) => (
              <div
                key={review.id}
                className="bg-green-50 p-4 rounded-lg shadow-inner border border-green-200"
              >
                <p className="text-lg font-semibold text-green-800">
                  "{review.comment}"
                </p>
                <p className="text-sm text-green-700 mt-2">
                  - {review.user} (Rating: {review.rating}/5)
                </p>
                <button
                  onClick={() => togglePin(review.id)}
                  className="mt-3 bg-green-600 hover:bg-green-700 text-white text-sm py-1 px-3 rounded-md shadow-md transition duration-300 flex items-center"
                >
                  <Pin className="h-4 w-4 mr-1 rotate-45" /> Unpin
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No testimonials pinned yet.</p>
        )}
      </div>

      {/* All Reviews Section */}
      <div>
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          All User Reviews
        </h3>
        {unpinnedReviews.length > 0 || pinnedReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unpinnedReviews.map((review) => (
              <div
                key={review.id}
                className="bg-gray-100 p-4 rounded-lg shadow-sm border border-gray-200"
              >
                <p className="text-lg font-semibold text-gray-800">
                  "{review.comment}"
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  - {review.user} (Rating: {review.rating}/5)
                </p>
                <button
                  onClick={() => togglePin(review.id)}
                  className="mt-3 bg-indigo-500 hover:bg-indigo-600 text-white text-sm py-1 px-3 rounded-md shadow-md transition duration-300 flex items-center"
                >
                  <Pin className="h-4 w-4 mr-1" /> Pin as Testimonial
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No user reviews available.</p>
        )}
      </div>
    </div>
  );
};

// Vendor Access Requests Page Component
const VendorAccessRequests = ({
  vendorAccessRequests,
  setVendorAccessRequests,
}) => {
  const updateVendorStatus = (id, newStatus) => {
    setVendorAccessRequests((prev) =>
      prev.map((vendor) =>
        vendor.id === id ? { ...vendor, status: newStatus } : vendor
      )
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Vendor Access Requests
      </h2>

      <div className="overflow-x-auto bg-gray-50 rounded-lg shadow-inner">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg"
              >
                Vendor Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Requested Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3-medium text-gray-500 uppercase tracking-wider rounded-tr-lg"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vendorAccessRequests.length > 0 ? (
              vendorAccessRequests.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {vendor.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vendor.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vendor.requestedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        vendor.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : vendor.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {vendor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {vendor.status === "Pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            updateVendorStatus(vendor.id, "Approved")
                          }
                          className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-md text-xs shadow-sm flex items-center"
                        >
                          <Check className="h-3 w-3 mr-1" /> Grant Access
                        </button>
                        <button
                          onClick={() =>
                            updateVendorStatus(vendor.id, "Rejected")
                          }
                          className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-xs shadow-sm flex items-center"
                        >
                          <X className="h-3 w-3 mr-1" /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500">Actioned</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No vendor access requests.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Admin Dashboard Content (main overview for the admin panel)
const AdminDashboardContent = ({
  incomeData,
  pricingPlans,
  vendorAccessRequests,
  userReviews,
  blogs,
}) => (
  <div className="p-6 bg-white rounded-lg shadow-md">
    <h2 className="text-3xl font-bold mb-6 text-gray-800">
      Admin Dashboard Overview
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Card 1 */}
      <div className="bg-indigo-100 p-6 rounded-lg shadow-inner flex items-center justify-between">
        <div>
          <p className="text-gray-700 text-lg">Total Income</p>
          <p className="text-4xl font-extrabold text-indigo-700">
            ${incomeData.totalIncome.toLocaleString()}
          </p>
        </div>
        <DollarSign className="h-12 w-12 text-indigo-500 opacity-50" />
      </div>
      {/* Card 2 */}
      <div className="bg-blue-100 p-6 rounded-lg shadow-inner flex items-center justify-between">
        <div>
          <p className="text-gray-700 text-lg">Active Plans</p>
          <p className="text-4xl font-extrabold text-blue-700">
            {pricingPlans.filter((p) => p.isActive).length}
          </p>
        </div>
        <BarChart className="h-12 w-12 text-blue-500 opacity-50" />
      </div>
      {/* Card 3 */}
      <div className="bg-purple-100 p-6 rounded-lg shadow-inner flex items-center justify-between">
        <div>
          <p className="text-gray-700 text-lg">New Vendor Requests</p>
          <p className="text-4xl font-extrabold text-purple-700">
            {vendorAccessRequests.filter((v) => v.status === "Pending").length}
          </p>
        </div>
        <UserPlus className="h-12 w-12 text-purple-500 opacity-50" />
      </div>
      {/* Card 4 */}
      <div className="bg-yellow-100 p-6 rounded-lg shadow-inner flex items-center justify-between">
        <div>
          <p className="text-gray-700 text-lg">New Reviews</p>
          <p className="text-4xl font-extrabold text-yellow-700">
            {userReviews.length}
          </p>
        </div>
        <MessageSquare className="h-12 w-12 text-yellow-500 opacity-50" />
      </div>
      {/* Card 5 */}
      <div className="bg-teal-100 p-6 rounded-lg shadow-inner flex items-center justify-between">
        <div>
          <p className="text-gray-700 text-lg">Total Blogs</p>
          <p className="text-4xl font-extrabold text-teal-700">
            {blogs.length}
          </p>
        </div>
        <BookOpen className="h-12 w-12 text-teal-500 opacity-50" />
      </div>
    </div>
    <p className="mt-8 text-gray-600">
      Welcome to your intuitive Admin Panel. Use the sidebar to navigate through
      various sections and manage your application effectively.
    </p>
  </div>
);

// Main Admin Panel Component
const AdminPanelMain = ({
  incomeData,
  setIncomeData,
  pricingPlans,
  setPricingPlans,
  blogs,
  setBlogs,
  userReviews,
  setUserReviews,
  vendorAccessRequests,
  setVendorAccessRequests,
}) => {
  const [currentPage, setCurrentPage] = useState("dashboard"); // State to manage current active page within Admin Panel

  const adminNavItems = [
    { name: "Dashboard", icon: Home, page: "dashboard" },
    { name: "Income Analytics", icon: BarChart, page: "income" },
    { name: "Pricing Plans", icon: DollarSign, page: "pricing" },
    { name: "Blog Manager", icon: BookOpen, page: "blog" },
    { name: "User Reviews", icon: MessageSquare, page: "reviews" },
    { name: "Vendor Access", icon: UserPlus, page: "vendors" },
  ];

  const navigate = useNavigate();
  // useEffect(() => {
  //   const userSignedIn = localStorage.getItem("email");
  //   console.log(userSignedIn);
  //   userSignedIn.endsWith('@admin.com');
  //   if (!userSignedIn || !userSignedIn.endsWith('@admin.com')) {
  //     navigate("/");
  //   }
  // })
  const userSignedIn = useSelector(selectLoggedInUser);
  useEffect(() => {
    if (!userSignedIn || !userSignedIn.email.endsWith('@admin.com')) {
      navigate("/");
    }
  }, [userSignedIn]);

  // Conditional rendering for content area based on currentPage
  const renderAdminContent = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <AdminDashboardContent
            incomeData={incomeData}
            pricingPlans={pricingPlans}
            vendorAccessRequests={vendorAccessRequests}
            userReviews={userReviews}
            blogs={blogs}
          />
        );
      case "income":
        return <IncomeAnalytics incomeData={incomeData} />;
      case "pricing":
        return (
          <PricingPlans
            pricingPlans={pricingPlans}
            setPricingPlans={setPricingPlans}
          />
        );
      case "blog":
        return <BlogManager blogs={blogs} setBlogs={setBlogs} />;
      case "reviews":
        return (
          <UserReviews
            userReviews={userReviews}
            setUserReviews={setUserReviews}
          />
        );
      case "vendors":
        return (
          <VendorAccessRequests
            vendorAccessRequests={vendorAccessRequests}
            setVendorAccessRequests={setVendorAccessRequests}
          />
        );
      default:
        return (
          <AdminDashboardContent
            incomeData={incomeData}
            pricingPlans={pricingPlans}
            vendorAccessRequests={vendorAccessRequests}
            userReviews={userReviews}
            blogs={blogs}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased flex p-4">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        adminNavItems={adminNavItems}
      />

      {/* Main Content Area */}
      <main className="flex-1 ml-4 rounded-lg bg-white p-6 shadow-xl">
        {renderAdminContent()}
      </main>
    </div>
  );
};

// Main Profile Component
const Profile = ({ userName = "Admin" }) => {
  // Renamed Dashboard to Profile, default userName to Admin
  // Dummy Data for Admin Panel states
  const [incomeData, setIncomeData] = useState({
    totalIncome: 125000,
    monthlyEarnings: [
      { month: "Jan", amount: 10000 },
      { month: "Feb", amount: 12000 },
      { month: "Mar", amount: 15000 },
      { month: "Apr", amount: 13000 },
      { month: "May", amount: 18000 },
      { month: "Jun", amount: 17000 },
      { month: "Jul", amount: 20000 },
      { month: "Aug", amount: 22000 },
      { month: "Sep", amount: 25000 },
      { month: "Oct", amount: 23000 },
      { month: "Nov", amount: 26000 },
      { month: "Dec", amount: 28000 },
    ],
    transactions: [
      {
        id: 1,
        date: "2024-01-15",
        description: "Premium Plan Subscription",
        amount: 99.99,
        status: "Completed",
      },
      {
        id: 2,
        date: "2024-01-20",
        description: "Basic Plan Renewal",
        amount: 29.99,
        status: "Completed",
      },
      {
        id: 3,
        date: "2024-02-01",
        description: "Enterprise Plan Setup",
        amount: 499.0,
        status: "Completed",
      },
      {
        id: 4,
        date: "2024-02-10",
        description: "Add-on Feature Purchase",
        amount: 19.99,
        status: "Pending",
      },
      {
        id: 5,
        date: "2024-03-05",
        description: "Premium Plan Subscription",
        amount: 99.99,
        status: "Completed",
      },
      {
        id: 6,
        date: "2024-03-12",
        description: "Basic Plan Renewal",
        amount: 29.99,
        status: "Completed",
      },
      {
        id: 7,
        date: "2024-04-01",
        description: "Enterprise Plan Setup",
        amount: 499.0,
        status: "Completed",
      },
      {
        id: 8,
        date: "2024-04-10",
        description: "Add-on Feature Purchase",
        amount: 19.99,
        status: "Completed",
      },
    ],
  });

  const [pricingPlans, setPricingPlans] = useState([
    {
      id: 1,
      name: "Basic",
      price: 29.99,
      features: ["5 Projects", "10GB Storage"],
      isActive: true,
    },
    {
      id: 2,
      name: "Premium",
      price: 99.99,
      features: ["Unlimited Projects", "100GB Storage", "Priority Support"],
      isActive: true,
    },
    {
      id: 3,
      name: "Enterprise",
      price: 499.0,
      features: ["Custom Solutions", "Dedicated Manager", "24/7 Support"],
      isActive: false,
    },
  ]);

  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: "Getting Started with Our Platform",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      thumbnail: "https://placehold.co/150x100/A0AEC0/FFFFFF?text=Blog+1",
      date: "2024-01-01",
    },
    {
      id: 2,
      title: "Advanced Tips for Productivity",
      content:
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
      thumbnail: "https://placehold.co/150x100/A0AEC0/FFFFFF?text=Blog+2",
      date: "2024-02-15",
    },
  ]);

  const [userReviews, setUserReviews] = useState([
    {
      id: 1,
      user: "Alice Smith",
      rating: 5,
      comment: "Amazing platform, highly recommend!",
      isPinned: false,
    },
    {
      id: 2,
      user: "Bob Johnson",
      rating: 4,
      comment: "Great features, a few minor bugs but overall good.",
      isPinned: true,
    },
    {
      id: 3,
      user: "Charlie Brown",
      rating: 5,
      comment: "Transformed my workflow, excellent support!",
      isPinned: false,
    },
    {
      id: 4,
      user: "Diana Prince",
      rating: 3,
      comment: "Decent, but could use more integrations.",
      isPinned: false,
    },
  ]);

  const [vendorAccessRequests, setVendorAccessRequests] = useState([
    {
      id: 1,
      name: "Tech Solutions Inc.",
      email: "tech@example.com",
      status: "Pending",
      requestedDate: "2024-04-20",
    },
    {
      id: 2,
      name: "Global Goods Ltd.",
      email: "global@example.com",
      status: "Approved",
      requestedDate: "2024-04-18",
    },
    {
      id: 3,
      name: "Creative Minds Agency",
      email: "creative@example.com",
      status: "Pending",
      requestedDate: "2024-04-22",
    },
  ]);
  const navigate = useNavigate();

  // Handle user logout (kept as a placeholder, but no actual logout logic here)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    // console.log("Admin logged out."); // Placeholder for navigation
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header Section */}
      <header className="flex items-center justify-between p-5 bg-pink-600 text-white rounded-md shadow-md">
        <h1 className="text-2xl font-bold">Welcome, {userName}!</h1>
        <button
          onClick={handleLogout}
          className="bg-white text-pink-600 px-4 py-2 rounded-md shadow hover:bg-gray-200 transition-all"
        >
          Logout
        </button>
      </header>

      {/* Admin Panel Content */}
      <div className="mt-6">
        <AdminPanelMain
          incomeData={incomeData}
          setIncomeData={setIncomeData}
          pricingPlans={pricingPlans}
          setPricingPlans={setPricingPlans}
          blogs={blogs}
          setBlogs={setBlogs}
          userReviews={userReviews}
          setUserReviews={setUserReviews}
          vendorAccessRequests={vendorAccessRequests}
          setVendorAccessRequests={setVendorAccessRequests}
        />
      </div>
    </div>
  );
};

export default Profile; // Exporting Profile as the main component
