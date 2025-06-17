import React, { useState, useEffect } from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";

const Dashboard = ({ userName = "Guest" }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [milestones, setMilestones] = useState([]);
  // const navigate = useNavigate();

  useEffect(() => {
    getUserBookings();
  }, []);

  const getUserBookings = async () => {
    try {
      const bookingsRes = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/booking`
      );
      const remindersRes = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/reminders`
      );
      const tasksRes = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/tasks`
      );
      const budgetRes = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/budget`
      );

      // console.log("a",bookingsRes.data);
      // console.log("b",remindersRes.data);
      // console.log("c",tasksRes.data);
      // console.log("d",budgetRes.data);

      setData({
        bookings: bookingsRes.data,
        reminders: remindersRes.data,
        tasks: tasksRes.data,
        budget: budgetRes.data,
      });

      setMilestones(
        remindersRes.data.filter((reminder) => reminder.isMilestone)
      );
      setError(null);
    } catch (err) {
      console.error("Error fetching user bookings:", err);
      setError("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // Redirect to login
  };

  const calculateProgress = () => {
    const completedTasks = data.tasks.filter((task) => task.completed).length;
    return (completedTasks / data.tasks.length) * 100;
  };

  const calculateBudgetSpent = () => {
    return (data.budget.spent / data.budget.totalBudget) * 100;
  };

  const renderContent = () => {
    if (loading) return <div className="text-center text-lg">Loading...</div>;
    if (error) return <div className="text-center text-red-600">{error}</div>;

    switch (activeTab) {
      case "Bookings":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-lg shadow-lg p-6 flex flex-col space-y-4"
              >
                <h3 className="text-xl font-semibold text-pink-600">
                  Vendor ID: {booking.vendorId}
                </h3>
                <p>
                  <strong>Name:</strong> {booking.customerName}
                </p>
                <p>
                  <strong>Phone:</strong> {booking.phone}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(booking.eventDate).toDateString()}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {booking.confirmed ? "Confirmed" : "Pending"}
                </p>
                <div className="flex justify-between">
                  <button
                    // onClick={() => navigate(`/Reminder`)}
                    className="bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-500 transition-all"
                  >
                    To-Do List
                  </button>
                  <button
                    // onClick={() => navigate(`/guest-list/${booking._id}`)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-500 transition-all"
                  >
                    Manage Guests
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      case "To-Do List":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.reminders.map((reminder) => (
              <div
                key={reminder._id}
                className="bg-white rounded-lg shadow-lg p-6 flex flex-col space-y-4"
              >
                <h3 className="text-xl font-semibold text-pink-600">
                  Reminder: {new Date(reminder.date).toLocaleDateString()}
                </h3>
                <p>{reminder.message}</p>
                <button
                  // onClick={() => navigate(`/package/${reminder.packageId}`)}
                  className="bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-500 transition-all"
                >
                  View Package
                </button>
              </div>
            ))}
          </div>
        );

      case "Dashboard":
        return (
          <div>
            <div className="mb-4">
              <h3 className="text-xl font-semibold">
                Task Completion Progress
              </h3>
              <div className="w-full bg-gray-200 h-4 rounded-lg">
                <div
                  className="bg-pink-600 h-4 rounded-lg"
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
              <p>{Math.round(calculateProgress())}% of tasks completed</p>
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-semibold">Budget Overview</h3>
              <div className="w-full bg-gray-200 h-4 rounded-lg">
                <div
                  className="bg-green-600 h-4 rounded-lg"
                  style={{ width: `${calculateBudgetSpent()}%` }}
                ></div>
              </div>
              <p>{Math.round(calculateBudgetSpent())}% of the budget spent</p>
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-semibold">Upcoming Milestones</h3>
              <ul>
                {milestones.map((milestone) => (
                  <li
                    key={milestone._id}
                    className="bg-white p-4 mb-2 shadow-md rounded-md"
                  >
                    <p>
                      <strong>
                        {new Date(milestone.date).toLocaleDateString()}
                      </strong>
                      : {milestone.message}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
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

      {/* Explore buttons */}
      <div className="mb-6 text-center mt-6">
        <button
          // onClick={() => navigate("/venue")}
          className="bg-pink-600 text-white px-6 py-2 rounded-md mr-4 hover:bg-pink-500 transition-all"
        >
          Explore Venues
        </button>
        <button
          // onClick={() => navigate("/vendors")}
          className="bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-500 transition-all"
        >
          Explore Vendors
        </button>
      </div>

      {/* Content Section */}
      <div className="mt-6">
        {loading ? (
          <div className="text-center text-lg">Loading...</div>
        ) : data.bookings.length === 0 ? (
          <div>No booking history found.</div>
        ) : (
          <div>
            {/* Bookings Section */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold">Your Bookings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-white rounded-lg shadow-lg p-6 flex flex-col space-y-4"
                  >
                    <h3 className="text-xl font-semibold text-pink-600">
                      Vendor: {booking.vendorName}
                    </h3>
                    <p>
                      <strong>Name:</strong> {booking.customerName}
                    </p>
                    <p>
                      <strong>Phone:</strong> {booking.phone}
                    </p>
                    <p>
                      <strong>Event Date:</strong>{" "}
                      {new Date(booking.eventDate).toDateString()}
                    </p>
                    <p>
                      <strong>Status:</strong> {booking.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
