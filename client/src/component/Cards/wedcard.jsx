import { useState } from "react";
import EventDetails from "./Eventdetails"; // Import EventDetails component

const Wedcard = () => {
  const [selectedEventId, setSelectedEventId] = useState(null);

  const openEventDetails = (eventId) => {
    setSelectedEventId(eventId);
  };

  const closeEventDetails = () => {
    setSelectedEventId(null);
  };

  return (
    <div className="mx-10">
      <section className="w-full h-auto bg-white p-8 overflow-x-hidden">
        <br />
        <h2 className="font-serif text-3xl text-center font-bold text-pink-700 mb-8">
          Real Stories By DreamWedz
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
          {cards.map((card) => (
            <div
              key={card.id}
              className="flex flex-col h-full rounded-3xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
              onClick={() => openEventDetails(card.id)}
            >
              {/* Image Section */}
              <div
                style={{
                  backgroundImage: `url(${card.url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                className="h-48 sm:h-56 md:h-64 w-full"
              ></div>

              {/* Content Section */}
              <div className="bg-white p-4 flex flex-col justify-between h-auto">
                <h3 className="text-gray-800 text-xl font-bold mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{card.content}</p>
                <span className="text-pink-700 font-medium">Read more...</span>
              </div>
            </div>
          ))}
        </div>

        {/* Render EventDetails */}
        {selectedEventId && (
          <EventDetails eventId={selectedEventId} onClose={closeEventDetails} />
        )}
      </section>
    </div>
  );
};

export { Wedcard };

const cards = [
  {
    url: "Farewell.jpeg",
    title: "Farewell Fiesta",
    content:
      "A heartfelt farewell event filled with love, laughter, and unforgettable memories for a dear colleague.",
    id: 1,
  },
  {
    url: "EngagementPD.JPG",
    title: "Peacock-Themed Engagement",
    content:
      "An enchanting peacock-themed engagement set against a pink and white backdrop, creating a magical atmosphere.",
    id: 2,
  },
  {
    url: "MarriagePD.JPG",
    title: "A Hindu Marathi Wedding",
    content:
      "Experience the vibrant colors and rich traditions of a beautiful Hindu Marathi wedding celebration.",
    id: 3,
  },
];
