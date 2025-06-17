import React, { useState } from "react";

const Portfolio = ({ photos, videos }) => {
  const [showCard, setShowCard] = useState("photos");
  const [showMore, setShowMore] = useState(false);

  const handleProject = (category) => {
    setShowCard(category);
    if (category !== "photos") {
      setShowMore(false); // Reset "showMore" when switching categories
    }
  };

  const getImagesForCategory = () => {
    if (showCard === "photos") {
      return showMore ? photos : photos.slice(0, 6); // Show more or initial set of photos
    }
    if (showCard === "videos") {
      return videos;
    }
    return [];
  };

  return (
    <section className="pt-20 pb-12 lg:pt-[120px] lg:pb-[90px] dark:bg-dark">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold">Portfolio</h1>

        <div className="w-full flex flex-wrap justify-center -mx-4">
          <div className="w-full px-4">
            <ul className="flex flex-wrap justify-center mb-12 space-x-1">
              <li className="mb-1">
                <button
                  onClick={() => handleProject("photos")}
                  className={`inline-block rounded-lg py-2 px-5 text-center text-base font-semibold transition md:py-3 lg:px-8 ${
                    showCard === "photos"
                      ? "activeClasses bg-primary text-white"
                      : "inactiveClasses text-body-color dark:text-dark-6 hover:bg-primary hover:text-white"
                  }`}
                >
                  Photos
                </button>
              </li>
              <li className="mb-1">
                <button
                  onClick={() => handleProject("videos")}
                  className={`inline-block rounded-lg py-2 px-5 text-center text-base font-semibold transition md:py-3 lg:px-8 ${
                    showCard === "videos"
                      ? "activeClasses bg-primary text-white"
                      : "inactiveClasses text-body-color dark:text-dark-6 hover:bg-primary hover:text-white"
                  }`}
                >
                  Videos
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap -mx-4">
          {getImagesForCategory().map((url, index) => (
            <PortfolioCard key={index} ImageHref={url} />
          ))}
        </div>

        {showCard === "photos" && photos.length > 6 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowMore(!showMore)}
              className="inline-block rounded-lg py-2 px-5 text-center text-base font-semibold transition bg-primary text-white hover:bg-primary-dark"
            >
              {showMore ? "Show Less" : "View More"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;

const PortfolioCard = ({ ImageHref }) => {
  return (
    <div className="w-full px-4 md:w-1/2 lg:w-1/3 mb-4">
      <div className="relative overflow-hidden rounded-[10px]">
        <img
          src={ImageHref}
          alt="portfolio"
          className="w-full h-64 object-cover" // Fixed height, cover to maintain aspect ratio
        />
      </div>
    </div>
  );
};
