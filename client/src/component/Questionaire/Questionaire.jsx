import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // React Router for navigation
import { motion, AnimatePresence } from "framer-motion"; // For animations
import { useSelector } from "react-redux";
import { selectLoggedInUser } from "../UserLogin/authSlice";

// Define conversation steps for clarity
const CONVERSATION_STEPS = {
  INITIAL: "initial",
  ASK_TYPE: "ask_type",
  ASK_CAPACITY: "ask_capacity",
  ASK_ADDRESS: "ask_address",
  ASK_BUDGET: "ask_budget",
  SHOW_RESULTS: "show_results",
};

// --- Nested Message Component (Tailwind Styled) ---
const Message = ({ text, sender }) => {
  const isUser = sender === "user";
  const isBotInfo = sender === "bot-info";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`mb-2 p-3 rounded-lg max-w-[70%] text-sm break-words ${
        isUser
          ? "bg-blue-500 text-white self-end rounded-br-none shadow-md"
          : isBotInfo
          ? "bg-gray-200 text-gray-700 self-center text-xs italic shadow-sm"
          : "bg-gray-100 text-gray-800 self-start rounded-bl-none shadow-md"
      }`}
    >
      {/* dangerouslySetInnerHTML allows bolding from bot messages */}
      <p dangerouslySetInnerHTML={{ __html: text }}></p>
    </motion.div>
  );
};

// --- Nested VenueCard Component (Tailwind Styled) ---
const VenueCard = ({ venue, onViewOnMapClick }) => {
  // Fallback placeholder image if venue.imageUrl is not provided or invalid
  const imageUrl =
    venue.imageUrl ||
    `https://placehold.co/150x100/cccccc/333333?text=No+Image`;

  // Format budget to INR currency, removing any commas from the raw string
  // The budget is now expected to be a clean number after parsing in parseCSV
  const formattedBudget = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0, // No decimal places for currency
  }).format(parseInt(String(venue.budget).replace(/,/g, ""), 10) || 0); // Ensure it's a string before replace, then parse

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white p-4 rounded-lg shadow-lg mb-4 border border-gray-200 w-full flex flex-col sm:flex-row items-center justify-between" // Added flex-col, sm:flex-row for responsiveness
    >
      {/* Venue details section */}
      <div className="flex-grow text-left sm:pr-4 mb-4 sm:mb-0">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {venue.name}
        </h3>
        <p className="text-gray-600 mb-1">
          <span className="font-medium">Type:</span> {venue.type}
        </p>
        <p className="text-gray-600 mb-1">
          <span className="font-medium">Capacity:</span> {venue.capacity} guests
        </p>
        <p className="text-gray-600 mb-1">
          <span className="font-medium">Address:</span> {venue.address}
        </p>
        <p className="text-gray-600 mb-2">
          <span className="font-medium">Budget:</span> {formattedBudget}
        </p>
        {/* Display details if available */}
        {venue.details && (
          <p className="text-gray-600 text-sm mb-2 italic">
            <span className="font-medium">Details:</span> {venue.details}
          </p>
        )}
        {/* Changed to button for in-app map interaction */}
        {venue.locationInfo && venue.locationInfo.coordinates && (
          <button
            onClick={() => onViewOnMapClick(venue)} // Pass the entire venue object
            className="text-blue-500 hover:underline text-sm font-medium mt-2 px-3 py-1 rounded-md border border-blue-300 hover:bg-blue-50 transition-colors duration-200"
          >
            View on Map
          </button>
        )}
        {venue.locationInfo && venue.locationInfo.error && (
          <p className="text-red-500 text-sm mt-1">
            Location Error: {venue.locationInfo.error}
          </p>
        )}
      </div>
      {/* Image container on the right */}
      <div className="flex-shrink-0">
        <img
          src={imageUrl}
          alt={venue.name}
          className="w-48 h-36 object-cover rounded-lg shadow-sm" // Increased size here
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/150x100/cccccc/333333?text=No+Image`;
          }} // Fallback on error
        />
      </div>
    </motion.div>
  );
};

function Questionnaire() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [recommendedVenues, setRecommendedVenues] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingBotResponse, setLoadingBotResponse] = useState(false);
  const [allVenues, setAllVenues] = useState([]); // New state for all venues from CSV
  const [loadingVenues, setLoadingVenues] = useState(true); // New state for loading CSV
  const [mapUrl, setMapUrl] = useState(""); // State to store the dynamic map URL
  const [loadingMap, setLoadingMap] = useState(false); // State for map loading
  const [selectedVenueForMap, setSelectedVenueForMap] = useState(null); // New state for single venue highlight on map

  // State for guided conversation
  const [conversationStep, setConversationStep] = useState(
    CONVERSATION_STEPS.INITIAL
  );
  const [searchCriteria, setSearchCriteria] = useState({
    type: "",
    capacity: 0,
    address: "",
    budget: { min: 0, max: Infinity },
  });

  // Function to parse CSV data more robustly (handles commas within quoted fields)
  const parseCSV = (text) => {
    const lines = text.trim().split("\n");
    if (lines.length === 0) return [];

    const headers = lines[0].split(",").map((h) => h.trim());
    const data = [];

    // Regex to split by comma, but not if inside double quotes
    const csvSplitRegex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i]
        .split(csvSplitRegex)
        .map((v) => v.trim().replace(/^"|"$/g, "")); // Split and remove quotes
      const row = {};
      headers.forEach((header, index) => {
        let value = values[index];
        if (header === "budget") {
          // Extract the numeric part from "20Lakhs(2000000)"
          const budgetMatch = value.match(/\((\d+)\)/);
          if (budgetMatch && budgetMatch[1]) {
            value = budgetMatch[1]; // Use the number inside parentheses
          } else {
            value = value.replace(/[^0-9]/g, ""); // Fallback: remove all non-numeric characters
          }
        }
        row[header] = value;
      });
      data.push(row);
    }
    return data;
  };

  // const userSignedIn = useSelector(selectLoggedInUser);
  // useEffect(() => {
  //   if (!userSignedIn) {
  //     navigate("/userlogin");
  //   }
  // },[userSignedIn]);

  // Effect to fetch CSV data and check user authentication
  useEffect(() => {
    // const userSignedIn = localStorage.getItem("token");
    // if (!userSignedIn) {
    //   navigate("/userlogin");
    // }

    // Fetch venues from CSV
    const fetchVenues = async () => {
      try {
        const response = await fetch("/venues.csv"); // Access from public directory
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        const parsedData = parseCSV(text);
        setAllVenues(parsedData);
        // console.log("Parsed Venue Data:", parsedData); // Log parsed data for debugging
      } catch (error) {
        console.error("Error fetching or parsing venues.csv:", error);
        setMessages((prev) => [
          ...prev,
          {
            text: "Error loading venue data. Please try refreshing the page.",
            sender: "bot-info",
          },
        ]);
      } finally {
        setLoadingVenues(false);
      }
    };

    fetchVenues(); // Call the fetch function

    // Initial bot message when component mounts or conversation resets
    if (
      messages.length === 0 ||
      conversationStep === CONVERSATION_STEPS.INITIAL
    ) {
      setMessages([
        {
          text: "Hello! Let's find your perfect wedding venue. What **type** of venue are you looking for? (e.g., 'Banquet Hall', 'Outdoor', 'Farmhouse')",
          sender: "bot",
        },
      ]);
      setConversationStep(CONVERSATION_STEPS.ASK_TYPE);
    }
  }, [conversationStep, messages.length, navigate]); // Added navigate to dependencies

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Function to fetch venue location (Photon API)
  const fetchVenueLocation = async (venueName, venueAddress) => {
    setLoadingLocation(true);
    let locationData = {
      query: venueName,
      address: venueAddress,
      coordinates: null,
      error: null,
      mapLink: null,
    };
    const query = venueAddress || venueName;
    if (!query) {
      locationData.error = "No address or name to search for location.";
      setLoadingLocation(false);
      return locationData;
    }
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(
      query
    )}&limit=1`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Photon API error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const [lon, lat] = data.features[0].geometry.coordinates;
        locationData.coordinates = { lat, lon };
        locationData.mapLink = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=15/${lat}/${lon}`;
      } else {
        locationData.error = "Location not found by Photon API.";
      }
    } catch (error) {
      console.error("Error fetching location from Photon API:", error);
      locationData.error = "Failed to fetch location.";
    }
    setLoadingLocation(false);
    return locationData;
  };

  // Function to parse budget string into min/max range
  const getBudgetRange = (budgetString) => {
    if (!budgetString) return { min: 0, max: Infinity };
    const lowerCaseBudget = String(budgetString).toLowerCase(); // Ensure string

    // Remove commas for easier parsing of numbers like "5,00,000"
    const cleanedBudgetString = lowerCaseBudget.replace(/,/g, "");

    // Try to match specific amount like "5 lakhs" or "500000" or "5lakhs"
    const exactMatch = cleanedBudgetString.match(/(\d+)\s*lakhs?|\((\d+)\)/);

    if (exactMatch) {
      let amount;
      if (exactMatch[1]) {
        amount = parseInt(exactMatch[1], 10) * 100000;
      } else if (exactMatch[2]) {
        amount = parseInt(exactMatch[2], 10);
      }
      if (!isNaN(amount) && amount > 0) {
        return { min: amount, max: amount };
      }
    }

    // Now, handle ranges (above/under) for user queries.
    const aboveMatch = cleanedBudgetString.match(/above\s*(\d+)\s*lakhs?/);
    if (aboveMatch) {
      const minLakhs = parseInt(aboveMatch[1], 10);
      return { min: minLakhs * 100000, max: Infinity };
    }

    const underMatch = cleanedBudgetString.match(
      /(?:under|below|up to)\s*(\d+)\s*lakhs?/
    );
    if (underMatch) {
      const maxLakhs = parseInt(underMatch[1], 10);
      return { min: 0, max: maxLakhs * 100000 };
    }

    // New: Try to parse a standalone number (like "500000" or "400000")
    const numericOnlyMatch = cleanedBudgetString.match(/(\d+)/);
    if (numericOnlyMatch) {
      const numericAmount = parseInt(numericOnlyMatch[1], 10);
      if (!isNaN(numericAmount) && numericAmount > 0) {
        return { min: 0, max: numericAmount };
      }
    }

    return { min: 0, max: Infinity }; // Default if no specific budget found
  };

  // Function to process user messages and generate bot responses
  const processUserMessage = async (messageText) => {
    setLoadingBotResponse(true);
    let botResponseText = "";
    let nextStep = conversationStep; // Default to current step

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: messageText, sender: "user" },
    ]);

    // Clear selected venue for map when a new message is sent
    setSelectedVenueForMap(null);

    switch (conversationStep) {
      case CONVERSATION_STEPS.ASK_TYPE:
        setSearchCriteria((prev) => ({
          ...prev,
          type: messageText.toLowerCase(),
        }));
        botResponseText = `Got it. What's the approximate **capacity** you're expecting? (e.g., '100', '250 guests', 'more than 50')`;
        nextStep = CONVERSATION_STEPS.ASK_CAPACITY;
        break;

      case CONVERSATION_STEPS.ASK_CAPACITY:
        const capacityMatch = messageText.toLowerCase().match(/(\d+)/);
        let capacity = 0;
        if (capacityMatch && capacityMatch[1]) {
          capacity = parseInt(capacityMatch[1], 10);
        }
        setSearchCriteria((prev) => ({ ...prev, capacity: capacity }));
        botResponseText = `Understood. Which **area or address** are you considering? (e.g., 'Juhu', 'Mumbai', 'near Bandra')`;
        nextStep = CONVERSATION_STEPS.ASK_ADDRESS;
        break;

      case CONVERSATION_STEPS.ASK_ADDRESS:
        setSearchCriteria((prev) => ({
          ...prev,
          address: messageText.toLowerCase(),
        }));
        botResponseText = `Okay. What's your **budget**? (e.g., 'under 5 lakhs', 'around 10 lakhs', '500000')`;
        nextStep = CONVERSATION_STEPS.ASK_BUDGET;
        break;

      case CONVERSATION_STEPS.ASK_BUDGET:
        const budgetRange = getBudgetRange(messageText);
        setSearchCriteria((prev) => ({ ...prev, budget: budgetRange }));
        botResponseText =
          "Great! Let me find some venues for you based on your preferences.";
        nextStep = CONVERSATION_STEPS.SHOW_RESULTS; // Move to results
        break;

      case CONVERSATION_STEPS.SHOW_RESULTS:
        // If the user types something after getting results, maybe offer to restart or refine
        if (
          messageText.toLowerCase().includes("new search") ||
          messageText.toLowerCase().includes("restart")
        ) {
          setSearchCriteria({
            type: "",
            capacity: 0,
            address: "",
            budget: { min: 0, max: Infinity },
          });
          nextStep = CONVERSATION_STEPS.ASK_TYPE;
          botResponseText =
            "Starting a new search. What **type** of venue are you looking for? (e.g., 'Banquet Hall', 'Outdoor', 'Farmhouse')";
        } else if (messageText.toLowerCase().includes("all venues")) {
          // Show all venues if requested
          botResponseText = "Here are all the venues:";
          setRecommendedVenues(allVenues); // Display all venues from CSV
          setLoadingBotResponse(false);
          return; // Exit early as we've handled this case
        } else {
          botResponseText =
            "I've already shown you results based on your last search. Would you like to **start a new search** or try refining your previous criteria? You can also say 'all venues' to see everything.";
        }
        break;

      default:
        botResponseText =
          "I'm a bit lost. Please start by telling me the **type** of venue you're looking for.";
        nextStep = CONVERSATION_STEPS.ASK_TYPE;
        break;
    }

    setConversationStep(nextStep); // Update the conversation step

    // If it's time to show results, filter and display
    if (nextStep === CONVERSATION_STEPS.SHOW_RESULTS) {
      setLoadingBotResponse(true);
      const { type, capacity, address, budget } = searchCriteria;

      let filteredVenues = allVenues.filter((v) => {
        // Use allVenues here
        const venueType = v.type ? v.type.toLowerCase() : "";
        const venueCapacity = parseInt(
          String(v.capacity).match(/(\d+)/)?.[1] || "0",
          10
        ); // Extract number from capacity string
        const venueAddress = v.address ? v.address.toLowerCase() : "";
        const venueBudget = parseInt(v.budget, 10) || 0; // Directly use the parsed numeric budget

        const typeMatch = type ? venueType.includes(type) : true;
        const capacityMatch = capacity ? venueCapacity >= capacity : true; // Assuming "at least" this capacity
        const addressMatch = address ? venueAddress.includes(address) : true;

        // Check if venue's direct budget value is within the requested range
        const budgetMatch =
          venueBudget >= budget.min && venueBudget <= budget.max;

        return typeMatch && capacityMatch && addressMatch && budgetMatch;
      });

      if (filteredVenues.length === 0) {
        botResponseText =
          "Unfortunately, I couldn't find any venues matching all your criteria. Please try again with different preferences.";
      } else {
        botResponseText = `Found ${filteredVenues.length} venue(s) matching your criteria:`;
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botResponseText, sender: "bot" },
      ]);
      setRecommendedVenues([]); // Clear previous recommendations

      // Fetch location for each filtered venue and display
      setLoadingMap(true); // Start loading map
      const venuesWithLocations = await Promise.all(
        filteredVenues.map(async (venue) => {
          const locationInfo = await fetchVenueLocation(
            venue.name,
            venue.address
          );
          return { ...venue, locationInfo };
        })
      );
      setRecommendedVenues(venuesWithLocations);

      // Generate the map URL with multiple markers for all results
      if (venuesWithLocations.length > 0) {
        let markers = "";
        let centerLat = 0;
        let centerLon = 0;
        venuesWithLocations.forEach((venue) => {
          if (venue.locationInfo && venue.locationInfo.coordinates) {
            const { lat, lon } = venue.locationInfo.coordinates;
            markers += `&marker=${lat},${lon}`;
            centerLat += lat;
            centerLon += lon;
          }
        });

        if (
          venuesWithLocations.filter((v) => v.locationInfo?.coordinates)
            .length > 0
        ) {
          centerLat /= venuesWithLocations.filter(
            (v) => v.locationInfo?.coordinates
          ).length;
          centerLon /= venuesWithLocations.filter(
            (v) => v.locationInfo?.coordinates
          ).length;
          setMapUrl(
            `https://www.openstreetmap.org/export/embed.html?bbox=${
              centerLon - 0.05
            },${centerLat - 0.05},${centerLon + 0.05},${
              centerLat + 0.05
            }&layer=mapnik${markers}&marker=${centerLat},${centerLon}`
          );
        } else {
          setMapUrl(""); // No venues with coordinates, clear map
        }
      } else {
        setMapUrl(""); // No recommended venues, clear map
      }
      setLoadingMap(false); // Finish loading map
      setLoadingBotResponse(false);
    } else {
      // For other steps, just update the bot message
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botResponseText, sender: "bot" },
      ]);
      setLoadingBotResponse(false);
      setMapUrl(""); // Clear map when not showing results
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const currentInputValue = inputValue;
    setInputValue(""); // Clear input immediately

    // Pass the input to processUserMessage to handle based on current step
    await processUserMessage(currentInputValue);
  };

  // Function to refresh the page
  const handleReset = () => {
    window.location.reload();
  };

  // Function to handle clicking "View on Map" for a specific venue
  const handleViewOnMapClick = (venue) => {
    if (venue.locationInfo && venue.locationInfo.coordinates) {
      const { lat, lon } = venue.locationInfo.coordinates;
      // Set the selected venue to highlight it on the map
      setSelectedVenueForMap(venue);
      // Generate map URL for only this venue
      setMapUrl(
        `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.01},${
          lat - 0.01
        },${lon + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lon}`
      );
    } else {
      setMessages((prev) => [
        ...prev,
        {
          text: `Could not find map coordinates for ${venue.name}.`,
          sender: "bot-info",
        },
      ]);
    }
  };

  // Function to go back to showing all recommended venues on the map
  const handleBackToAllResultsMap = () => {
    setSelectedVenueForMap(null); // Clear the selected venue
    // Regenerate map URL for all recommended venues
    if (recommendedVenues.length > 0) {
      let markers = "";
      let centerLat = 0;
      let centerLon = 0;
      recommendedVenues.forEach((venue) => {
        if (venue.locationInfo && venue.locationInfo.coordinates) {
          const { lat, lon } = venue.locationInfo.coordinates;
          markers += `&marker=${lat},${lon}`;
          centerLat += lat;
          centerLon += lon;
        }
      });

      if (
        recommendedVenues.filter((v) => v.locationInfo?.coordinates).length > 0
      ) {
        centerLat /= recommendedVenues.filter(
          (v) => v.locationInfo?.coordinates
        ).length;
        centerLon /= recommendedVenues.filter(
          (v) => v.locationInfo?.coordinates
        ).length;
        setMapUrl(
          `https://www.openstreetmap.org/export/embed.html?bbox=${
            centerLon - 0.05
          },${centerLat - 0.05},${centerLon + 0.05},${
            centerLat + 0.05
          }&layer=mapnik${markers}&marker=${centerLat},${centerLon}`
        );
      } else {
        setMapUrl("");
      }
    } else {
      setMapUrl("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 to-white font-inter flex flex-col">
      {/* Hero section with background image */}
      <motion.div
        className="relative h-[200px] w-full flex items-center justify-center bg-cover bg-center rounded-b-lg shadow-md overflow-hidden"
        style={{ backgroundImage: "url('Wedplan2.jpg')" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      ></motion.div>

      {/* Chatbot and Map Container - Conditional Layout */}
      <div
        className={`flex-grow flex ${
          recommendedVenues.length > 0
            ? "flex-col lg:flex-row"
            : "flex-col items-center justify-center"
        } p-4 sm:p-6 space-y-6 lg:space-y-0 lg:space-x-6`}
      >
        {/* Chatbot Container */}
        <div
          className={`bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col h-[700px] max-h-[95vh] ${
            recommendedVenues.length > 0
              ? "w-full lg:w-1/2"
              : "w-full max-w-3xl"
          }`}
        >
          {/* Chatbot Heading */}
          <div className="bg-pink-500 text-white p-4 rounded-t-lg flex items-center justify-center shadow-md">
            <h2 className="text-xl font-bold">Wedding Venue Recommender 💍</h2>
          </div>

          {/* Chatbot Messages Area */}
          <div className="flex-grow p-4 overflow-y-auto flex flex-col space-y-3">
            {loadingVenues && (
              <Message text="Loading venue data..." sender="bot-info" />
            )}
            {!loadingVenues &&
              messages.map((msg, index) => (
                <Message key={index} text={msg.text} sender={msg.sender} />
              ))}
            {loadingBotResponse &&
              conversationStep !== CONVERSATION_STEPS.SHOW_RESULTS && (
                <Message text="Thinking..." sender="bot-info" />
              )}
            {loadingLocation && (
              <Message text="Fetching location details..." sender="bot-info" />
            )}
            {recommendedVenues.map((venue, index) => (
              <VenueCard
                key={index}
                venue={venue}
                onViewOnMapClick={handleViewOnMapClick}
              />
            ))}
          </div>

          {/* Chatbot Input Area */}
          <div className="p-4 border-t border-gray-200 flex items-center space-x-3 bg-gray-50 rounded-b-lg">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={(e) =>
                e.key === "Enter" && !loadingBotResponse && handleSendMessage()
              }
              placeholder="Type your message..."
              disabled={loadingBotResponse || loadingVenues}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSendMessage}
              disabled={loadingBotResponse || loadingVenues}
              className="px-5 py-2 bg-pink-500 text-white rounded-full shadow-md hover:bg-pink-600 transition duration-300 disabled:bg-pink-300 disabled:cursor-not-allowed"
            >
              {loadingBotResponse ? "..." : "Send"}
            </button>
            <button
              onClick={handleReset}
              className="px-5 py-2 bg-gray-400 text-white rounded-full shadow-md hover:bg-gray-500 transition duration-300"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Map Container - Conditionally rendered */}
        {recommendedVenues.length > 0 && (
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 flex-shrink-0 w-full lg:w-1/2 h-[500px] lg:h-[700px] flex flex-col items-center justify-center overflow-hidden">
            {selectedVenueForMap && (
              <div className="w-full text-center p-2 bg-pink-100 rounded-t-lg">
                <p className="text-gray-700 font-semibold mb-2">
                  Showing: {selectedVenueForMap.name}
                </p>
                <button
                  onClick={handleBackToAllResultsMap}
                  className="px-4 py-2 bg-pink-500 text-white rounded-full text-sm hover:bg-pink-600 transition-colors duration-200"
                >
                  Back to All Results
                </button>
              </div>
            )}
            {loadingMap ? (
              <p className="text-gray-600">Loading map...</p>
            ) : mapUrl ? (
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                src={mapUrl}
                style={{ border: "1px solid black", borderRadius: "0.5rem" }}
                title="Venue Locations Map"
              ></iframe>
            ) : (
              <p className="text-gray-600">
                Map will appear here after search results.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Questionnaire;
