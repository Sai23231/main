import React from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

function Wishlist() {
  const location = useLocation();
  const wishlist = location.state?.wishlist || [];

  const items = [
    {
      id: 1,
      src: "invite1.png",
      label: "Outfits",
      description: "Elegant outfits for your special day",
      price: "$100",
      type: "image",
    },
    {
      id: 2,
      src: "invite2.png",
      label: "Wedding Sarees",
      description: "Beautiful sarees for the bride and family",
      price: "$200",
      type: "image",
    },
    {
      id: 3,
      src: "invite3.png",
      label: "Wedding Makeup",
      description: "Professional makeup artists for your wedding",
      price: "$150",
      type: "image",
    },
    {
      id: 4,
      src: "invite4.png",
      label: "Mehndi Designs",
      description: "Intricate mehndi designs for brides",
      price: "$80",
      type: "image",
    },
    {
      id: 5,
      src: "invite5.png",
      label: "Wedding Hairstyles",
      description: "Stylish hairstyles for weddings",
      price: "$120",
      type: "image",
    },
    {
      id: 6,
      src: "invite6.png",
      label: "Pre Wedding Shoot",
      description: "Capture your love story before the big day",
      price: "$300",
      type: "image",
    },
    {
      id: 7,
      src: "invite7.png",
      label: "Pre Wedding Shoot",
      description: "Capture your love story before the big day",
      price: "$300",
      type: "image",
    },
    {
      id: 8,
      src: "invite8.png",
      label: "Pre Wedding Shoot",
      description: "Capture your love story before the big day",
      price: "$300",
      type: "image",
    },

    // Video Items
    {
      id: 9,
      video: "invite.mp4",
      label: "Wedding Highlights",
      image: "invite1.png",
      price: "$500",
      type: "video",
    },
    {
      id: 10,
      video: "invite1.mp4",
      label: "Pre-wedding Shoot",
      image: "thumbnail2.png",
      price: "$350",
      type: "video",
    },
    {
      id: 11,
      video: "invite2.mp4",
      label: "Ceremony Moments",
      image: "thumbnail.png",
      price: "$400",
      type: "video",
    },
    {
      id: 12,
      video: "invite3.mp4",
      label: "Moments",
      image: "thumbnail3.png",
      price: "$450",
      type: "video",
    },
  ];

  // Filter the items based on the wishlist IDs
  const wishlistItems = items.filter((item) => wishlist.includes(item.id));

  return (
    <div className="container mx-auto p-8">
      <header className="text-center py-6">
        <h1 className="text-4xl font-bold text-gray-800">Your Wishlist</h1>
        <p className="text-gray-500">
          Here's everything you’ve saved for your special day!
        </p>
      </header>

      {wishlistItems.length > 0 ? (
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <motion.div
                key={item.id}
                className="relative bg-white shadow-lg rounded-md overflow-hidden"
                whileHover={{ scale: 1.03 }}
              >
                {item.type === "image" ? (
                  <div className="w-full h-64 bg-gray-200">
                    <img
                      src={item.src}
                      alt={item.label}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-64 bg-gray-200">
                    <video
                      src={item.video}
                      className="object-cover w-full h-full"
                      muted
                      autoPlay
                      loop
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => e.currentTarget.pause()}
                    />
                    <img
                      src={item.image}
                      alt={item.label}
                      className="absolute inset-0 w-full h-full object-cover opacity-40"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{item.label}</h3>
                  {item.type === "image" && (
                    <>
                      <p className="text-gray-500 text-sm">
                        {item.description}
                      </p>
                      <p className="text-gray-800 font-semibold">
                        {item.price}
                      </p>
                    </>
                  )}
                  {item.type === "video" && (
                    <p className="text-gray-800 font-semibold">{item.price}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      ) : (
        <p className="text-center text-gray-600">Your wishlist is empty.</p>
      )}
    </div>
  );
}

export default Wishlist;
