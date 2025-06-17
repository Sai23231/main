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
    title: "Floral Save the Date",
    image:
      "https://images.pexels.com/photos/5876616/pexels-photo-5876616.jpeg",
    price: "₹999",
  },
  {
    id: 2,
    title: "Minimalist Calendar",
    image:
      "https://images.pexels.com/photos/5876617/pexels-photo-5876617.jpeg",
    price: "₹899",
  },
  {
    id: 3,
    title: "Rustic Romance",
    image:
      "https://images.pexels.com/photos/5876618/pexels-photo-5876618.jpeg",
    price: "₹1,199",
  },
  {
    id: 4,
    title: "Modern Elegance",
    image:
      "https://images.pexels.com/photos/5876619/pexels-photo-5876619.jpeg",
    price: "₹1,099",
  },
  {
    id: 5,
    title: "Vintage Charm",
    image:
      "https://images.pexels.com/photos/5876620/pexels-photo-5876620.jpeg",
    price: "₹1,299",
  },
  {
    id: 6,
    title: "Beach Paradise",
    image:
      "https://images.pexels.com/photos/5876621/pexels-photo-5876621.jpeg",
    price: "₹1,399",
  },
  {
    id: 7,
    title: "Garden Dreams",
    image:
      "https://images.pexels.com/photos/5876622/pexels-photo-5876622.jpeg",
    price: "₹1,199",
  },
  {
    id: 8,
    title: "Royal Announcement",
    image:
      "https://images.pexels.com/photos/5876623/pexels-photo-5876623.jpeg",
    price: "₹1,499",
  },
  {
    id: 9,
    title: "Watercolor Beauty",
    image:
      "https://images.pexels.com/photos/5876624/pexels-photo-5876624.jpeg",
    price: "₹1,299",
  },
  {
    id: 10,
    title: "Classic Calendar",
    image:
      "https://images.pexels.com/photos/5876625/pexels-photo-5876625.jpeg",
    price: "₹999",
  },
];

const SaveDateCards = ({ showAll = false }) => {
  const navigate = useNavigate();

  const handleCardClick = (card) => {
    const titleSlug = card.title.toLowerCase().replace(/\s+/g, "-");
    navigate(`/wedding-invitations/save-date/${titleSlug}`);
  };

  if (showAll) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Save the Date Cards
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
        <h2 className="text-2xl font-bold text-gray-800">Save the Date</h2>
        <Link
          to="/wedding-invitations/save-date-cards"
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

export default SaveDateCards;
