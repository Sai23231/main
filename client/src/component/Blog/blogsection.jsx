import React from "react";
import { NavLink } from "react-router-dom";

const BlogCard = ({ to, imgSrc, alt, title, description }) => (
  <div className="group relative cursor-pointer items-center rounded-2xl justify-center overflow-hidden transition-shadow hover:shadow-xl hover:shadow-black/30 mx-auto">
    <div className="h-[30rem] w-[24rem]">
      <img
        className="h-full w-full object-cover transition-transform duration-500 group-hover:rotate-3 group-hover:scale-125"
        src={imgSrc}
        alt={alt}
        aria-label={alt}
      />
    </div>
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black transition-opacity duration-300 group-hover:from-black/80 group-hover:via-black/80 group-hover:to-black/80"></div>
    <div className="absolute inset-0 flex flex-col items-center justify-end px-4 pb-3 text-center transition-all duration-500 group-hover:pb-10">
      <NavLink to={to} aria-label={`Read about ${title}`}>
        <h1 className="font-serif text-xl font-bold text-white">{title}</h1>
      </NavLink>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="mb-3 text-sm italic text-white">{description}</p>
        <NavLink to={to} aria-label={`Go to ${title}`}>
          <button className="rounded-full bg-neutral-900 py-2 px-3.5 font-serif text-sm capitalize text-white shadow shadow-black/60 hover:bg-neutral-800 transition">
            Read More
          </button>
        </NavLink>
      </div>
    </div>
  </div>
);

const Blog = () => {
  const blogData = [
    {
      to: "/BridalHairstyle",
      imgSrc:
        "https://i.pinimg.com/236x/07/2e/f8/072ef824f8e445cff8c1cf3eea837904.jpg",
      alt: "Bridal Hairstyles",
      title: "Top 10 Bridal Hairstyles of 2024",
      description:
        "Discover the trendiest bridal hairstyles for 2024 to make your wedding look unforgettable!",
    },
    {
      to: "/BridalMakeup",
      imgSrc:
        "https://i.pinimg.com/236x/80/6c/2d/806c2ddf046935dc87e201a3bf693043.jpg",
      alt: "Bridal Makeup",
      title: "Bridal Makeup Trends for 2024",
      description:
        "Glow like never before with these expert bridal makeup tips for your wedding day.",
    },
    {
      to: "/Weddingplan",
      imgSrc:
        "https://i.pinimg.com/236x/f5/17/41/f51741bba7173c9dfda68a7c4d9c932b.jpg",
      alt: "Wedding Songs & Videos",
      title: "Top Wedding Songs & Videos to Set the Mood",
      description:
        "Explore the top wedding songs to make your celebration truly magical.",
    },
    {
      to: "/DecorationIdeas",
      imgSrc:
        "https://i.pinimg.com/236x/08/3a/1a/083a1a80b97e1dbec8c16de5ae9d135c.jpg",
      alt: "Wedding Decoration Ideas",
      title: "Breathtaking Wedding Decoration Ideas",
      description:
        "Elegant decoration ideas to take your wedding to the next level.",
    },
    {
      to: "/DestinationWeddings",
      imgSrc:
        "https://cdn.pixabay.com/photo/2019/05/24/18/41/marriage-4226896_1280.jpg",
      alt: "Destination Weddings",
      title: "Top Destination Wedding Locations for 2025",
      description:
        "Plan the wedding of your dreams at these stunning global destinations.",
    },
    {
      to: "/EcoFriendlyWeddings",
      imgSrc:
        "https://cdn.pixabay.com/photo/2014/09/13/04/59/couple-443600_960_720.jpg",
      alt: "Eco-Friendly Weddings",
      title: "Sustainable & Eco-Friendly Wedding Ideas",
      description:
        "Celebrate love and the planet with these eco-conscious wedding trends for 2025.",
    },
    {
      to: "/WeddingOutfits",
      imgSrc:
        "https://cdn.pixabay.com/photo/2021/08/17/06/19/bride-6552057_960_720.jpg",
      alt: "Wedding Outfits",
      title: "Trendiest Bridal and Groom Outfits of 2025",
      description:
        "Find inspiration for modern yet traditional outfits to shine on your special day.",
    },
    {
      to: "/DIYWeddingIdeas",
      imgSrc:
        "https://img.freepik.com/free-photo/flatlay-wedding-bouquet-ribbons-camera_1304-4725.jpg?t=st=1735393699~exp=1735397299~hmac=19805a287f923be5e6c6d56cabafb50cebae2bb49de5398c761c05a6b303c2a7&w=996",
      alt: "DIY Wedding Ideas",
      title: "Creative DIY Wedding Ideas",
      description:
        "Add a personal touch to your wedding with these fun and creative DIY ideas.",
    },
    {
      to: "/TechInWeddings",
      imgSrc:
        "https://img.freepik.com/free-vector/online-wedding-ceremony_23-2148616169.jpg?t=st=1735393799~exp=1735397399~hmac=2a757160d59ad2b46d8cd44de87816b48e9c48fcc83ba0a6f32d21fabc8b5569&w=740",
      alt: "Tech in Weddings",
      title: "How Technology is Revolutionizing Weddings in 2025",
      description:
        "Explore innovative tech trends like live streaming, 3D invitations, and more.",
    },
    {
      to: "/WeddingWellnessTrends",
      imgSrc:
        "https://files.oaiusercontent.com/file-6Q53cYsmHoAcoo88L3LDYG?se=2024-12-28T14%3A34%3A51Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D46f8e4bc-58fa-4561-851a-e4a9d92fb055.webp&sig=x%2BPCazCUPAw5Z3me4gv/sRZZwi1wYWokMcGV7esv3fc%3D",
      alt: "Wedding Wellness Trends",
      title: "Wedding Wellness Trends for 2025",
      description:
        "Discover how couples are incorporating wellness activities like yoga, spa days, and mindful ceremonies into their wedding celebrations.",
    },
  ];

  return (
    <div className="py-10">
      <h2 className=" text-3xl text-center font-bold mb-4">
        Latest Wedding Blogs
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Stay updated with the latest trends and ideas to make your wedding truly
        unforgettable.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mx-4 lg:mx-16">
        {blogData.map((blog, index) => (
          <BlogCard key={index} {...blog} />
        ))}
      </div>

      {/* Wedding Vision Section */}
      <div className="flex justify-center items-center mt-10">
        {/* Left Side Card */}
        <div className="w-1/3 h-[250px] bg-white shadow-lg rounded-lg p-6 flex flex-col justify-center items-center relative overflow-hidden">
          {/* Default Image */}
          <img
            src="glob.jpeg"
            alt="Image"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-out"
          />

          {/* Hover Image */}
          <img
            src="glob2.jpeg"
            alt="Image"
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 ease-out hover:opacity-100"
          />
        </div>

        {/* Right Side Content */}
        <div className="w-2/3 bg-white shadow-lg rounded-lg p-6 h-auto ml-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Define Your Wedding Vision
          </h2>
          <p className="mt-4 text-gray-600">
            Your wedding day should reflect your unique love story. Discuss key
            elements like theme, style, and overall atmosphere. Choose from
            themes such as rustic, elegant, or modern, and add personal touches
            like family heirlooms, custom vows, or special songs.
            <br />
            <br />
            1.) Rustic – Wooden décor, wildflowers, and outdoor settings.
            <br />
            2.) Elegant – Chandeliers, formal dinners, and classic color
            palettes.
            <br />
            3.) Modern – Geometric designs, sleek furniture, and contemporary
            aesthetics.
            <br />
            <br />
            Personal touches, like family heirlooms or custom vows, make it even
            more special.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Blog;
