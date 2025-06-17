import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FiSun,
  FiMoon,
  FiEdit2,
  FiTrash2,
  FiCopy,
  FiCheck,
  FiUserPlus,
  FiSearch,
  FiSend,
} from "react-icons/fi";
import { FaCamera } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectLoggedInUser } from "../UserLogin/authSlice";

const GuestListManager = () => {
  const [guestList, setGuestList] = useState([]);
  const [formData, setFormData] = useState({
    guestName: "",
    familyName: "",
    email: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // const userSignedIn = useSelector(selectLoggedInUser);
  // useEffect(() => {
  //   if (!userSignedIn) {
  //     navigate("/userlogin");
  //   }
  // },[userSignedIn]);

  useEffect(() => {
    const fetchGuests = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/guests/getUserGuests`, {withCredentials: true}
        );
        setGuestList(response.data);
      } catch (error) {
        console.error("Error fetching guests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuests();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.familyName.trim())
      newErrors.familyName = "Family name is required";
    if (!formData.guestName.trim())
      newErrors.guestName = "Guest name is required";
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addGuest = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/guests/addUserGuest`,
        formData,  {withCredentials: true}
      );
      setGuestList([...guestList, response.data]);
      setFormData({ guestName: "", familyName: "", email: "" });
      setMessage("Guest added successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Failed to add guest:", error);
      setMessage("Error adding guest. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const updateGuest = async (id, newData) => {
    if (!validateForm()) return;

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/guests/${id}`,
        newData
      );
      setGuestList(
        guestList.map((guest) => (guest._id === id ? response.data : guest))
      );
      setEditingId(null);
      setFormData({ guestName: "", familyName: "", email: "" });
      setMessage("Guest updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Failed to update guest:", error);
      setMessage("Error updating guest. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const deleteGuest = async (id) => {
    if (window.confirm("Are you sure you want to delete this guest?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/guests/${id}`);
        setGuestList(guestList.filter((guest) => guest._id !== id));
        setMessage("Guest deleted successfully!");
        setTimeout(() => setMessage(""), 3000);
      } catch (error) {
        console.error("Failed to delete guest:", error);
        setMessage("Error deleting guest. Please try again.");
        setTimeout(() => setMessage(""), 3000);
      }
    }
  };

  const toggleRSVP = async (id, status) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/guests/${id}/rsvp`,
        { rsvp: status }
      );
      setGuestList(
        guestList.map((guest) => (guest._id === id ? response.data : guest))
      );
    } catch (error) {
      console.error("Failed to update RSVP:", error);
    }
  };

  const handleFamilyMembersChange = async (id, value) => {
    const newValue = Math.max(1, parseInt(value) || 1);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/guests/${id}`,
        { familyMembers: newValue }
      );
      setGuestList(
        guestList.map((guest) => (guest._id === id ? response.data : guest))
      );
    } catch (error) {
      console.error("Failed to update family members:", error);
    }
  };

  // const handlePhotoUpload = async (id, e) => {
  //   const files = Array.from(e.target.files);
  //   if (files.length === 0) return;

  //   try {
  //     const formData = new FormData();
  //     files.forEach(file => formData.append('photos', file));

  //     const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/guests/${id}/photos`, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     });

  //     setGuestList(guestList.map(guest => guest._id === id ? response.data : guest));
  //     setMessage("Photos uploaded successfully!");
  //     setTimeout(() => setMessage(""), 3000);
  //   } catch (error) {
  //     console.error("Failed to upload photos:", error);
  //     setMessage("Error uploading photos. Please try again.");
  //     setTimeout(() => setMessage(""), 3000);
  //   }
  // };

  const addMessage = async (id) => {
    if (!message.trim()) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/guests/${id}/wish`,
        { message }
      );
      setGuestList(
        guestList.map((guest) => (guest._id === id ? response.data : guest))
      );
      setMessage("");
    } catch (error) {
      console.error("Failed to add message:", error);
    }
  };

  const generateShareLink = (id) => {
    return `${window.location.origin}/guest/${id}`;
  };

  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(generateShareLink(id));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStats = () => ({
    total: guestList.length,
    attending: guestList.filter((g) => g.rsvp === true).length,
    declined: guestList.filter((g) => g.rsvp === false).length,
    pending: guestList.filter((g) => g.rsvp === null).length,
    totalMembers: guestList.reduce(
      (sum, guest) => sum + guest.familyMembers,
      0
    ),
  });

  const filteredGuests = guestList.filter((guest) => {
    const matchesSearch =
      guest.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.familyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (guest.email &&
        guest.email.toLowerCase().includes(searchQuery.toLowerCase()));

    switch (filter) {
      case "attending":
        return guest.rsvp === true && matchesSearch;
      case "declined":
        return guest.rsvp === false && matchesSearch;
      case "pending":
        return guest.rsvp === null && matchesSearch;
      default:
        return matchesSearch;
    }
  });

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
              Event Guest Manager
            </h1>
            <p className="text-sm opacity-80">
              Manage your event guests with ease
            </p>
          </div>
          <div className="flex items-center gap-4">
            {message && (
              <div
                className={`px-4 py-2 rounded-lg ${
                  message.includes("success")
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {message}
              </div>
            )}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-yellow-300"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
          </div>
        </header>

        {/* Stats Dashboard */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard
            label="Total Guests"
            value={getStats().total}
            icon="👥"
            trend={guestList.length > 0 ? "positive" : "neutral"}
            isDarkMode={isDarkMode}
          />
          <StatCard
            label="Attending"
            value={getStats().attending}
            icon="✅"
            trend={getStats().attending > 0 ? "positive" : "neutral"}
            isDarkMode={isDarkMode}
          />
          <StatCard
            label="Declined"
            value={getStats().declined}
            icon="❌"
            trend={getStats().declined > 0 ? "negative" : "neutral"}
            isDarkMode={isDarkMode}
          />
          <StatCard
            label="Pending"
            value={getStats().pending}
            icon="⏳"
            trend="neutral"
            isDarkMode={isDarkMode}
          />
          <StatCard
            label="Total People"
            value={getStats().totalMembers}
            icon="👪"
            trend={getStats().totalMembers > 0 ? "positive" : "neutral"}
            isDarkMode={isDarkMode}
          />
        </section>

        {/* Add/Edit Form */}
        <section
          className={`p-6 rounded-xl mb-8 shadow-sm transition-colors duration-300 ${
            isDarkMode ? "bg-gray-800" : "bg-white shadow"
          }`}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiUserPlus />
            {editingId ? "Edit Guest Details" : "Add New Guest"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Family Name"
              value={formData.familyName}
              error={errors.familyName}
              onChange={(e) =>
                setFormData({ ...formData, familyName: e.target.value })
              }
              placeholder="e.g. Smith"
              isDarkMode={isDarkMode}
            />
            <InputField
              label="Guest Name"
              value={formData.guestName}
              error={errors.guestName}
              onChange={(e) =>
                setFormData({ ...formData, guestName: e.target.value })
              }
              placeholder="e.g. John"
              isDarkMode={isDarkMode}
            />
            <InputField
              label="Email (Optional)"
              value={formData.email}
              error={errors.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="e.g. john@example.com"
              type="email"
              isDarkMode={isDarkMode}
            />
          </div>
          <div className="mt-6 flex justify-end gap-3">
            {editingId && (
              <Button
                onClick={() => {
                  setEditingId(null);
                  setFormData({ guestName: "", familyName: "", email: "" });
                }}
                variant="secondary"
                isDarkMode={isDarkMode}
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={() => {
                if (editingId) {
                  updateGuest(editingId, formData);
                } else {
                  addGuest();
                }
              }}
              variant="primary"
              className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-3 py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              isDarkMode={isDarkMode}
            >
              {editingId ? "Update Guest" : "Add Guest"}
            </Button>
          </div>
        </section>

        {/* Controls */}
        <section className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guests by name, family or email..."
              className={`pl-10 w-full p-3 rounded-lg border transition-colors duration-300 ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 focus:border-indigo-500"
                  : "bg-white border-gray-300 focus:border-indigo-500"
              }`}
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={`p-3 rounded-lg border transition-colors duration-300 ${
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-300"
            }`}
          >
            <option value="all">All Guests</option>
            <option value="attending">Attending</option>
            <option value="declined">Declined</option>
            <option value="pending">Pending RSVP</option>
          </select>
        </section>

        {/* Guest List */}
        <section className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredGuests.length === 0 ? (
            <div
              className={`p-8 text-center rounded-xl ${
                isDarkMode ? "bg-gray-800" : "bg-white shadow"
              }`}
            >
              <p className="text-lg">
                {searchQuery
                  ? "No guests match your search"
                  : "No guests added yet"}
              </p>
              <p className="text-sm opacity-80 mt-2">
                {searchQuery
                  ? "Try a different search term"
                  : "Add your first guest using the form above"}
              </p>
            </div>
          ) : (
            filteredGuests.map((guest) => (
              <article
                key={guest._id}
                className={`p-6 rounded-xl transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-800 hover:bg-gray-750"
                    : "bg-white shadow-sm hover:shadow-md"
                }`}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-semibold">{guest.guestName}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-100"
                        }`}
                      >
                        {guest.familyName}
                      </span>
                      {guest.email && (
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-100"
                          }`}
                        >
                          {guest.email}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setFormData({
                          guestName: guest.guestName,
                          familyName: guest.familyName,
                          email: guest.email || "",
                        });
                        setEditingId(guest._id);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      isDarkMode={isDarkMode}
                      icon={<FiEdit2 />}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => deleteGuest(guest._id)}
                      isDarkMode={isDarkMode}
                      icon={<FiTrash2 />}
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                {/* RSVP Section */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-3 opacity-80">
                    RSVP STATUS
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <RSVPButton
                      status={true}
                      active={guest.rsvp === true}
                      onClick={() => toggleRSVP(guest._id, true)}
                      isDarkMode={isDarkMode}
                    >
                      Accepts with pleasure
                    </RSVPButton>
                    <RSVPButton
                      status={false}
                      active={guest.rsvp === false}
                      onClick={() => toggleRSVP(guest._id, false)}
                      isDarkMode={isDarkMode}
                    >
                      Declines with regret
                    </RSVPButton>
                  </div>
                  {guest.rsvpDate && (
                    <p
                      className={`text-xs mt-2 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Responded on{" "}
                      {new Date(guest.rsvpDate).toLocaleDateString()} at{" "}
                      {new Date(guest.rsvpDate).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>

                {/* Family Members */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-3 opacity-80">
                    FAMILY MEMBERS ATTENDING
                  </h4>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={guest.familyMembers}
                      onChange={(e) =>
                        handleFamilyMembersChange(guest._id, e.target.value)
                      }
                      min="1"
                      className={`w-20 p-2 rounded-lg border transition-colors duration-300 ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white border-gray-300"
                      }`}
                    />
                    <span className="text-sm">people total</span>
                  </div>
                </div>

                {/* Messages Section */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-3 opacity-80">
                    BLESSINGS & MESSAGES ({guest.wishMessages.length})
                  </h4>
                  {guest.wishMessages.length > 0 ? (
                    <div className="space-y-3 mb-4">
                      {guest.wishMessages.map((msg, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-lg transition-colors duration-300 ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-50"
                          }`}
                        >
                          <p className="text-sm">{msg}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      No messages yet
                    </p>
                  )}
                  <div className="flex gap-2 mt-3">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write a blessing or message..."
                      className={`flex-1 p-3 rounded-lg border transition-colors duration-300 ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700 focus:border-indigo-500"
                          : "bg-white border-gray-300 focus:border-indigo-500"
                      }`}
                    />
                    <Button
                      onClick={() => addMessage(guest._id)}
                      variant="primary"
                      isDarkMode={isDarkMode}
                      icon={<FiSend />}
                    />
                  </div>
                </div>

                {/* Photos Section */}
                {/* <div className="mb-6">
                  <h4 className="text-sm font-medium mb-3 opacity-80">
                    PHOTOS ({guest.photos.length})
                  </h4>
                  {guest.photos.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                      {guest.photos.map((photo, i) => (
                        <div key={i} className="relative group">
                          <img
                            src={photo}
                            alt={`Guest ${i+1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <a
                              href={photo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-white bg-opacity-80 rounded-full text-gray-800 hover:bg-opacity-100"
                            >
                              View
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      No photos uploaded yet
                    </p>
                  )}
                  <label className={`inline-flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors duration-300 ${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}>
                    <FaCamera />
                    <span>Upload Photos</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(guest._id, e)}
                      className="hidden"
                    />
                  </label>
                </div> */}

                {/* Share Link */}
                <div>
                  <h4 className="text-sm font-medium mb-3 opacity-80">
                    SHARE LINK
                  </h4>
                  <div className="flex gap-2">
                    <div
                      className={`flex-1 p-3 rounded-lg border transition-colors duration-300 overflow-x-auto ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700"
                          : "bg-gray-50 border-gray-300"
                      }`}
                    >
                      <code className="text-sm whitespace-nowrap">
                        {generateShareLink(guest._id)}
                      </code>
                    </div>
                    <Button
                      onClick={() => copyToClipboard(guest._id)}
                      variant={copiedId === guest._id ? "success" : "primary"}
                      isDarkMode={isDarkMode}
                      icon={copiedId === guest._id ? <FiCheck /> : <FiCopy />}
                    >
                      {copiedId === guest._id ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
};

// Helper Components

const StatCard = ({ label, value, icon, trend, isDarkMode }) => {
  const trendColors = {
    positive: "text-green-500",
    negative: "text-red-500",
    neutral: isDarkMode ? "text-gray-400" : "text-gray-500",
  };

  return (
    <div
      className={`p-4 rounded-xl transition-colors duration-300 ${
        isDarkMode ? "bg-gray-800" : "bg-white shadow-sm"
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p
            className={`text-sm font-medium mb-1 ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {label}
          </p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <span className={`text-2xl ${trendColors[trend]}`}>{icon}</span>
      </div>
    </div>
  );
};

const InputField = ({
  label,
  value,
  error,
  placeholder,
  type = "text",
  isDarkMode,
  ...props
}) => (
  <div>
    <label
      className={`block text-sm font-medium mb-1 ${
        isDarkMode ? "text-gray-300" : "text-gray-700"
      }`}
    >
      {label}
    </label>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      className={`w-full p-3 rounded-lg border transition-colors duration-300 ${
        error
          ? "border-red-500"
          : isDarkMode
          ? "bg-gray-800 border-gray-700 focus:border-indigo-500"
          : "bg-white border-gray-300 focus:border-indigo-500"
      }`}
      {...props}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const Button = ({
  children,
  variant = "primary",
  isDarkMode,
  icon,
  ...props
}) => {
  const baseClasses =
    "px-4 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2";

  const variantClasses = {
    primary: isDarkMode
      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
      : "bg-indigo-600 hover:bg-indigo-700 text-white",
    secondary: isDarkMode
      ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
      : "bg-gray-200 hover:bg-gray-300 text-gray-800",
    ghost: isDarkMode
      ? "hover:bg-gray-700 text-gray-300"
      : "hover:bg-gray-100 text-gray-700",
    success: "bg-green-500 hover:bg-green-600 text-white",
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`} {...props}>
      {icon && React.cloneElement(icon, { className: "flex-shrink-0" })}
      {children}
    </button>
  );
};

const RSVPButton = ({ children, status, active, isDarkMode, ...props }) => {
  const baseClasses =
    "px-4 py-2 rounded-lg transition-colors duration-300 text-sm font-medium flex-1 md:flex-none";

  if (active) {
    return (
      <button
        {...props}
        className={`${baseClasses} ${
          status
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-red-600 hover:bg-red-700 text-white"
        }`}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      {...props}
      className={`${baseClasses} ${
        isDarkMode
          ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
      }`}
    >
      {children}
    </button>
  );
};

export default GuestListManager;
