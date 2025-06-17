import React from "react";
import { useNavigate } from "react-router-dom";

const Vendors = () => {
  const navigate = useNavigate();

  const categories = [
    {
      name: "Photographer 📸",
      link: "photographer",
      img: "https://cdn.pixabay.com/photo/2016/11/29/04/54/photographer-1867417_1280.jpg",
      description: "Capture timeless memories with professional photographers.",
    },
    {
      name: "Mehndi Artist 🌿",
      link: "mehndi",
      img: "https://cdn.pixabay.com/photo/2017/10/08/16/06/mehndi-2830425_1280.jpg",
      description: "Add elegance with intricate Mehndi designs.",
    },
    {
      name: "Make-Up Artist 💄",
      link: "makeup",
      img: "https://cdn.pixabay.com/photo/2017/05/31/22/49/makeup-2361910_1280.jpg",
      description: "Look radiant with expert makeup artists.",
    },
    {
      name: "Caterers 🍲",
      link: "caterers",
      img: "https://cdn.pixabay.com/photo/2014/04/05/11/27/buffet-315691_960_720.jpg",
      description: "Delight guests with the best cuisines.",
    },

    {
      name: "DJ/Bands 🎶",
      link: "dj",
      img: "https://cdn.pixabay.com/photo/2016/11/22/19/15/hand-1850120_960_720.jpg",
      description: "Set the vibe with lively DJs and bands.",
    },
    {
      name: "Decorators ✨",
      link: "decorators",
      img: "https://cdn.pixabay.com/photo/2016/11/23/17/56/beach-1854076_1280.jpg",
      description: "Create stunning venues with expert decorators.",
    },
    {
      name: "Pandits 🕉️",
      link: "pandits",
      img: "https://cdn.pixabay.com/photo/2023/12/22/19/56/hinduism-8464313_1280.jpg",
      description: "Perform sacred rituals with experienced pandits.",
    },
    {
      name: "Invites & Gifts 🎁",
      link: "invite",
      img: "https://cdn.pixabay.com/photo/2017/08/06/07/16/wedding-2589803_640.jpg",
      description: "Share joy with beautiful invites and gifts.",
    },
  ];

  const handleNavigation = (link) => {
    navigate(`/vendors/${link}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mx-8">
      <h1 className="font-serif text-4xl text-center bg-clip-text bg-gradient-to-r text-black">
        Vendor Categories
      </h1>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 my-8">
        {categories.map((category, index) => (
          <div
            key={index}
            className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 dark:bg-gray-800 dark:border-gray-700 cursor-pointer"
            onClick={() => handleNavigation(category.link)}
          >
            <img
              className="rounded-t-lg w-full h-54 object-cover"
              src={category.img}
              alt={category.name}
            />
            <div className="p-5">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 hover:text-pink-500 transition dark:text-white">
                {category.name}
              </h5>
              <p className="text-sm text-gray-600 italic dark:text-gray-300">
                {category.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vendors;
