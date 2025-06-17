import React from "react";
import { useNavigate } from "react-router-dom";

const BlogCard = ({ to, imgSrc, alt, title, description }) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(to);
    window.scrollTo(0, 0); // Scroll to the top after navigation
  };

  return (
    <div
      className="w-full bg-base border border-gray-200 rounded-lg shadow-lg  overflow-hidden relative group mx-auto sm:mx-4  flex flex-col md:flex-row transition-transform duration-300 ease-in-out transform hover:scale-105"
      onClick={handleNavigation}
    >
      <div className="relative w-full md:w-2/5 h-[200px] md:h-auto overflow-hidden cursor-pointer">
        <img
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          src={imgSrc}
          alt={alt}
        />
      </div>
      <div className="relative w-full md:w-3/5 p-3 flex flex-col justify-center">
        <h5 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 hover:text-gray-400  cursor-pointer">
          {title}
        </h5>
        <p className="text-gray-700  mt-2 transition-all duration-500 ease-in-out transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
          {description}
        </p>
        <a href="" className="mt-4 inline-flex items-center gap-2">
          <div className="flex justify-center items-center rounded-full bg-primary h-5 w-5 transition-colors duration-300 group-hover:bg-secondary"></div>
          <h2 className="font-bold text-[16px] text-gray-900 ">
            Latest Update
          </h2>
        </a>
      </div>
    </div>
  );
};

const Blog = () => {
  const blogData = [
    {
      to: "/latestblog1",
      imgSrc:
        "https://img.freepik.com/free-photo/hugging-asian-couple-stands-before-beautiful-waterfall-mountains_8353-5613.jpg?t=st=1735468346~exp=1735471946~hmac=7bd63afb83054b866d18b31b0d10ca29f444ddf779346d8100d24d14418f93d1&w=360",
      alt: "Pre-Wedding Photoshoot",
      title: "Creative Pre-Wedding Photoshoot Ideas for 2024",
      description:
        "Capture your love story with stunning visuals and creative concepts! From dreamy destinations to cultural elegance, explore ideas to make your pre-wedding photos unique.",
    },
    {
      to: "/latestblog",
      imgSrc:
        "https://i.pinimg.com/236x/80/6c/2d/806c2ddf046935dc87e201a3bf693043.jpg",
      alt: "Bridal Makeup",
      title: "The Ultimate Bridal Makeup Guide for 2024 Brides",
      description:
        "Discover the latest bridal makeup trends for 2024, from glowy skin to bold eyes. Learn how to enhance your natural beauty and shine on your wedding day with DreamWeds.",
    },
    {
      to: "/latestblog2",
      imgSrc:
        "https://cdn.pixabay.com/photo/2014/09/13/04/59/couple-443600_960_720.jpg",
      alt: "Eco-Friendly Wedding",
      title: "Eco-Friendly Weddings: Sustainable Trends for 2025 Couples",
      description:
        "Discover how to plan a stylish and sustainable wedding in 2025. From green venues to ethical wedding attire, DreamWeds helps you celebrate love while caring for the planet.",
    },
    {
      to: "/latestblog3",
      imgSrc:
        "https://img.freepik.com/free-photo/portrait-bride-groom-posing-near-wedding-tropical-arch-beach-blue-sky-sea-wedding-couple_158538-9505.jpg?ga=GA1.1.1454009339.1722876500&semt=ais_hybrid",
      alt: "Destination Weddings",
      title: "Top Destination Wedding Locations in India You Can’t Miss",
      description:
        "Planning a destination wedding? Discover the most sought-after locations in India for a dreamy wedding. From royal palaces to serene beaches, let DreamWeds guide you to your perfect wedding venue.",
    },
  ];

  return (
    <div className="container mx-auto my-10 sm:mx-2 px-10">
      <h2 className="font-serif text-3xl text-center font-bold text-pink-700 mb-8">
        Trending Wedding Ideas
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10">
        {blogData.map((blog, index) => (
          <BlogCard key={index} {...blog} />
        ))}
      </div>
    </div>
  );
};

export default Blog;
