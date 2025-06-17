import React, { useState, useEffect, useReducer } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { cards as weddingCards } from "./WeddingCards";
import { cards as videoCards } from "./VideoCards";
import { cards as saveDateCards } from "./SaveDateCards";

const historyReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE":
      return {
        past: [...state.past, state.present],
        present: action.data,
        future: [],
      };
    case "UNDO":
      if (state.past.length === 0) return state;
      return {
        past: state.past.slice(0, -1),
        present: state.past[state.past.length - 1],
        future: [state.present, ...state.future],
      };
    default:
      return state;
  }
};

// First, create a constant for default values outside the component
const DEFAULT_STATE = {
  past: [],
  present: {
    page1: {
      names: "Anjali & Rahul",
      date: "August 27, 2025",
      venue: "RAMBAGH, JAIPUR",
      events: {
        haldi: { time: "10 AM ONWARDS" },
        mehndi: { time: "6PM ONWARDS" },
      },
    },
    page2: {},
    page3: {},
    page4: {},
    page5: {},
  },
  future: [],
};

const CustomisationCard = () => {
  const { cardType, titleSlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [history, dispatch] = useReducer(historyReducer, DEFAULT_STATE);

  const getCurrentCard = () => {
    const titleToFind = titleSlug.replace(/-/g, " ");

    switch (cardType) {
      case "wedding":
        return weddingCards.find(
          (card) => card.title.toLowerCase() === titleToFind.toLowerCase()
        );
      case "video":
        return videoCards.find(
          (card) => card.title.toLowerCase() === titleToFind.toLowerCase()
        );
      case "save-date":
        return saveDateCards.find(
          (card) => card.title.toLowerCase() === titleToFind.toLowerCase()
        );
      default:
        return null;
    }
  };

  const card = getCurrentCard();

  useEffect(() => {
    // Only update current page from URL
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get("page")) || 1;
    setCurrentPage(page);
  }, [location]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Update URL with new page number
    navigate(`${location.pathname}?page=${pageNumber}`);
  };

  // Update handleEdit to be page-specific
  const handleEdit = (field, value, eventType = null) => {
    let newData = { ...history.present };
    const currentPageData = newData[`page${currentPage}`] || {};

    if (eventType) {
      newData[`page${currentPage}`] = {
        ...currentPageData,
        events: {
          ...(currentPageData.events || {}),
          [eventType]: {
            ...(currentPageData.events?.[eventType] || {}),
            time: value,
          },
        },
      };
    } else {
      newData[`page${currentPage}`] = {
        ...currentPageData,
        [field]: value,
      };
    }

    dispatch({ type: "UPDATE", data: newData });
  };

  // Add undo handler
  const handleUndo = () => {
    dispatch({ type: "UNDO" });
  };

  // Modify handleSave to only toggle editMode
  const handleSave = () => {
    setEditMode(false);
  };

  const CustomizationTools = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 border-t border-gray-200">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="flex space-x-4">
            <button
              className={`p-2 rounded-lg ${
                editMode ? "bg-pink-100" : "hover:bg-gray-100"
              }`}
              title="Edit Text"
              onClick={() => setEditMode(!editMode)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
            <button
              className={`p-2 rounded-lg hover:bg-gray-100 ${
                history.past.length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title="Undo"
              onClick={handleUndo}
              disabled={history.past.length === 0}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            Save Draft
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
          >
            {editMode ? "Save Changes" : "Edit"} {/* Updated button text */}
          </button>
        </div>
      </div>
    </div>
  );

  if (!card) return <div>Card not found</div>;

  // Get current page data
  const currentPageData = history.present[`page${currentPage}`] || {};

  return (
    <div className="min-h-screen bg-gray-50 py-8 pb-24">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            {card.title}
          </h1>

          <div className="flex justify-center space-x-4 mb-8">
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-full ${
                  page === currentPage
                    ? "bg-pink-600 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                Page {page}
              </button>
            ))}
          </div>

          <div className="aspect-[9/16] max-w-sm mx-auto rounded-lg overflow-hidden shadow-lg relative">
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              {editMode ? (
                <>
                  <input
                    type="text"
                    value={currentPageData.names || ""}
                    onChange={(e) => handleEdit("names", e.target.value)}
                    className="text-4xl font-script mb-4 bg-transparent border-b border-white text-center"
                    placeholder={currentPage === 1 ? "Enter Names" : ""}
                  />
                  <input
                    type="text"
                    value={currentPageData.date || ""}
                    onChange={(e) => handleEdit("date", e.target.value)}
                    className="text-xl mb-2 bg-transparent border-b border-white text-center"
                    placeholder={currentPage === 1 ? "Enter Date" : ""}
                  />
                  {/* Show events only on page 1 */}
                  {currentPage === 1 && (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center space-x-2">
                        <span>Haldi:</span>
                        <input
                          type="text"
                          value={currentPageData.events?.haldi?.time || ""}
                          onChange={(e) => handleEdit("time", e.target.value, "haldi")}
                          className="bg-transparent border-b border-white text-center"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>Mehndi:</span>
                        <input
                          type="text"
                          value={currentPageData.events?.mehndi?.time || ""}
                          onChange={(e) => handleEdit("time", e.target.value, "mehndi")}
                          className="bg-transparent border-b border-white text-center"
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {currentPageData.names && (
                    <h2 className="text-4xl font-script mb-4">{currentPageData.names}</h2>
                  )}
                  {currentPageData.date && (
                    <div className="text-xl mb-2">{currentPageData.date}</div>
                  )}
                  {currentPageData.venue && (
                    <div className="text-lg">{currentPageData.venue}</div>
                  )}
                  {currentPage === 1 && currentPageData.events && (
                    <div className="mt-4">
                      {currentPageData.events.haldi && (
                        <div>Haldi: {currentPageData.events.haldi.time}</div>
                      )}
                      {currentPageData.events.mehndi && (
                        <div>Mehndi: {currentPageData.events.mehndi.time}</div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <CustomizationTools />
        </div>
      </div>
    </div>
  );
};

export default CustomisationCard;
