import React from "react";
import { useParams, useNavigate } from "react-router-dom"; // Add useNavigate
import { cards as weddingCards } from "./WeddingCards";
import { cards as videoCards } from "./VideoCards";
import { cards as saveDateCards } from "./SaveDateCards";

const PreviewPage = () => {
  const { cardType, titleSlug } = useParams();
  const navigate = useNavigate(); // Add this

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

  const handleCustomize = () => {
    navigate(`/customise/${cardType}/${titleSlug}`);
  };

  if (!card) return <div>Card not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            {card.title}
          </h1>

          <div className="flex justify-center space-x-4 mb-8">
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={`px-4 py-2 rounded-full ${
                  page === 1
                    ? "bg-pink-600 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                Page {page}
              </button>
            ))}
          </div>

          <div className="aspect-[9/16] max-w-sm mx-auto rounded-lg overflow-hidden shadow-lg">
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleCustomize}
              className="bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
            >
              Customise the card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
