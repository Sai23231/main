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
    title: "Traditional Elegance",
    image: "https://images.pexels.com/photos/5876695/pexels-photo-5876695.jpeg",
    price: "₹1,499",
  },
  {
    id: 2,
    title: "Modern Minimalist",
    image: "https://images.pexels.com/photos/7245278/pexels-photo-7245278.jpeg",
    price: "₹1,299",
  },
  {
    id: 3,
    title: "Royal Wedding",
    image: "https://images.pexels.com/photos/2959192/pexels-photo-2959192.jpeg",
    price: "₹1,899",
  },
  {
    id: 4,
    title: "Floral Dreams",
    image: "https://images.pexels.com/photos/931796/pexels-photo-931796.jpeg",
    price: "₹1,699",
  },
  {
    id: 5,
    title: "Rustic Charm",
    image: "https://images.pexels.com/photos/1702373/pexels-photo-1702373.jpeg",
    price: "₹1,599",
  },
  {
    id: 6,
    title: "Vintage Romance",
    image: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg",
    price: "₹1,799",
  },
  {
    id: 7,
    title: "Beach Paradise",
    image: "https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg",
    price: "₹1,999",
  },
  {
    id: 8,
    title: "Garden Glory",
    image: "https://images.pexels.com/photos/931795/pexels-photo-931795.jpeg",
    price: "₹1,599",
  },
  {
    id: 9,
    title: "Contemporary Class",
    image: "https://images.pexels.com/photos/1702372/pexels-photo-1702372.jpeg",
    price: "₹1,399",
  },
  {
    id: 10,
    title: "Divine Union",
    image: "https://images.pexels.com/photos/1702371/pexels-photo-1702371.jpeg",
    price: "₹1,899",
  },
];

const WeddingCards = ({ showAll = false }) => {
  const navigate = useNavigate();

  const handleCardClick = (card) => {
    const titleSlug = card.title.toLowerCase().replace(/\s+/g, "-");
    navigate(`/wedding-invitations/wedding/${titleSlug}`);
  };

  if (showAll) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Wedding Cards</h2>
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
        <h2 className="text-2xl font-bold text-gray-800">Wedding Cards</h2>
        <Link
          to="/wedding-invitations/wedding-cards"
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

export default WeddingCards;
