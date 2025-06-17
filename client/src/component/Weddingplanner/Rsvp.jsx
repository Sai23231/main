// RSVPPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const RSVPPage = () => {
  const { id } = useParams();
  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchGuest = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/guests/${id}`
        );
        console.log(response);

        setGuest(response.data);
      } catch (error) {
        setError("Failed to fetch guest details.");
      } finally {
        setLoading(false);
      }
    };

    fetchGuest();
  }, [id]);

  const toggleRSVP = async (status) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/guests/${id}/rsvp`,
        { rsvp: status }
      );
      setGuest(response.data);
    } catch (error) {
      setError("Failed to update RSVP status.");
    }
  };

  const handleFamilyMembersChange = async (value) => {
    const newValue = Math.max(1, parseInt(value) || 1);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/guests/${id}`,
        { familyMembers: newValue }
      );
      setGuest(response.data);
    } catch (error) {
      setError("Failed to update family members.");
    }
  };

  const addMessage = async () => {
    if (!message.trim()) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/guests/${id}/wish`,
        { message }
      );
      setGuest(response.data);
      setMessage("");
    } catch (error) {
      setError("Failed to add message.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Guest Card */}
        <div className="p-6 rounded-xl bg-white shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold">{guest.guestName}</h3>
              <p className="text-sm text-gray-500">{guest.familyName}</p>
            </div>
          </div>

          {/* RSVP Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => toggleRSVP(true)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                guest.rsvp === true
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Attending
            </button>
            <button
              onClick={() => toggleRSVP(false)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                guest.rsvp === false
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Decline
            </button>
          </div>

          {guest.rsvpDate && (
            <p className="text-sm text-gray-500 mb-4">
              RSVP Date: {new Date(guest.rsvpDate).toLocaleString()}
            </p>
          )}

          {/* Family Members */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Family Members Attending
            </label>
            <input
              type="number"
              value={guest.familyMembers}
              onChange={(e) => handleFamilyMembersChange(e.target.value)}
              min="1"
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Blessings */}
          <div className="mb-4">
            <h4 className="font-semibold mb-2">
              Blessings ({guest.wishMessages.length})
            </h4>
            <div className="space-y-2">
              {guest.wishMessages.map((msg, i) => (
                <div key={i} className="p-2 bg-gray-100 rounded-lg">
                  {msg}
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a blessing..."
                className="flex-1 p-2 border rounded-lg"
              />
              <button
                onClick={addMessage}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RSVPPage;
