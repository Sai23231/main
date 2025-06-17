import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export const cards = [
  {
    id: 1,
    title: "Classic Romance",
    image:
      "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg",
    duration: "01:30",
    price: "₹2,499",
  },
  {
    id: 2,
    title: "Modern Love Story",
    image:
      "https://images.pexels.com/photos/2253872/pexels-photo-2253872.jpeg",
    duration: "01:45",
    price: "₹2,799",
  },
  {
    id: 3,
    title: "Cinematic Tale",
    image:
      "https://images.pexels.com/photos/2253873/pexels-photo-2253873.jpeg",
    duration: "02:00",
    price: "₹3,299",
  },
  {
    id: 4,
    title: "Royal Celebration",
    image:
      "https://images.pexels.com/photos/2253874/pexels-photo-2253874.jpeg",
    duration: "01:15",
    price: "₹2,999",
  },
  {
    id: 5,
    title: "Elegant Moments",
    image:
      "https://images.pexels.com/photos/2253875/pexels-photo-2253875.jpeg",
    duration: "01:30",
    price: "₹2,699",
  },
  {
    id: 6,
    title: "Traditional Bliss",
    image:
      "https://images.pexels.com/photos/2253876/pexels-photo-2253876.jpeg",
    duration: "02:15",
    price: "₹3,499",
  },
  {
    id: 7,
    title: "Rustic Love",
    image:
      "https://images.pexels.com/photos/2253877/pexels-photo-2253877.jpeg",
    duration: "01:45",
    price: "₹2,899",
  },
  {
    id: 8,
    title: "Beach Romance",
    image:
      "https://images.pexels.com/photos/2253878/pexels-photo-2253878.jpeg",
    duration: "02:30",
    price: "₹3,799",
  },
  {
    id: 9,
    title: "Garden Wedding",
    image:
      "https://images.pexels.com/photos/2253879/pexels-photo-2253879.jpeg",
    duration: "01:30",
    price: "₹2,599",
  },
  {
    id: 10,
    title: "Sunset Love",
    image:
      "https://images.pexels.com/photos/2253880/pexels-photo-2253880.jpeg",
    duration: "02:00",
    price: "₹3,199",
  },
];

const VideoCards = ({ showAll = false }) => {
  const navigate = useNavigate();

  const handleCardClick = (card) => {
    const titleSlug = card.title.toLowerCase().replace(/\s+/g, "-");
    navigate(`/wedding-invitations/video/${titleSlug}`);
  };

  if (showAll) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Video Invitations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className="relative h-96 group cursor-pointer"
              onClick={() => handleCardClick(card)}
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover object-center rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                  <p className="text-sm opacity-90">{card.duration}</p>
                  <p className="text-sm opacity-90">{card.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Video Invitations</h2>
        <Link
          to="/wedding-invitations/video-cards"
          className="text-pink-600 hover:text-pink-700 font-medium"
        >
          View All
        </Link>
      </div>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={4}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        className="rounded-lg"
      >
        {cards.map((card) => (
          <SwiperSlide key={card.id}>
            <div
              key={card.id}
              className="relative h-96 group cursor-pointer"
              onClick={() => handleCardClick(card)}
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover object-center rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                  <p className="text-sm opacity-90">{card.duration}</p>
                  <p className="text-sm opacity-90">{card.price}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default VideoCards;
