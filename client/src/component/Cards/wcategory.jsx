import React, { useEffect, useRef } from "react";

const Allcategory = () => {
  const carouselRef = useRef(null);

  const cards = [
    {
      url: "royaltheme.jpg",
      title: "Royal Palace Wedding",
      content:
        "Inspired by the grandeur of Indian palaces, this theme is perfect for couples wanting ....",
      id: "traditional-indian-wedding",
    },
    {
      url: "bollywood.jpg",
      title: "Bollywood Glam Wedding",
      content:
        "This theme is inspired by Indian cinema and includes dramatic decor, vibrant colors ....",
      id: "fairytale-wedding",
    },
    {
      url: "temple.jpg",
      title: "Traditional South Indian Temple Wedding",
      content:
        "This theme is inspired by South Indian customs and takes place in or near ....",
      id: "bohemian-wedding",
    },
    {
      url: "punjabi.jpg",
      title: "Punjabi Wedding",
      content:
        "Known for being larger-than-life, Punjabi weddings are full of fun, energy....",
      id: "vintage-wedding",
    },
    {
      url: "beach.jpg",
      title: "Beach Wedding",
      content:
        "While beach weddings are often associated with Western cultures, particularly....",
      id: "beach-wedding",
    },
    {
      url: "mughal.jpg",
      title: "Mughal Garden Wedding",
      content:
        "Inspired by the grandeur of the Mughal era, this theme features lush gardens....",
      id: "royal-wedding",
    },
    {
      url: "rajwada.jpg",
      title: "Rajwada Theme",
      content:
        "It is a popular choice for couples who want to combine the elegance of Indian royalty....",
      id: "garden-wedding",
    },
    {
      url: "fussion.jpg",
      title: "Fusion Wedding",
      content:
        "Many Indian weddings incorporate both traditional and contemporary elements to honor both....",
      id: "modern-minimalist-wedding",
    },
    {
      url: "https://img.freepik.com/free-photo/stock-photo-romantic-bride-wedding-dress-groom-suit-hugging-face-face-standing-wet-sand-with-sky-reflection-it-clouds-reflecting-ground-making-fantastic-view_132075-10375.jpg?t=st=1734285535~exp=1734289135~hmac=cede39b423bc0c2a376369821c20850b4925ce60a3432f88b28798745e18d14c&w=996",
      title: "Celestial Wedding",
      content:
        "Perfect for stargazers, this theme incorporates dreamy starry decor, cosmic lighting....",
      id: "celestial-wedding",
    },
    {
      url: "https://cdn.pixabay.com/photo/2014/09/13/04/59/couple-443600_640.jpg",
      title: "Eco Friendly Wedding",
      content:
        "This theme focuses on sustainability with eco-friendly decor, minimal waste, and natural elements....",
      id: "eco-wedding",
    },
    {
      url: "https://images.pexels.com/photos/169190/pexels-photo-169190.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      title: "Art-Inspired Wedding",
      content:
        "An artistic wedding theme that features colorful palettes, live paintings, and creative elements....",
      id: "art-wedding",
    },
    {
      url: "https://media.istockphoto.com/id/477778690/photo/soccer-player-and-his-future-bride.jpg?s=612x612&w=0&k=20&c=VGZpzNNnyyNB1Xu-y30eOxxXWGaPDqmuKUT-2aodH8A=",
      title: "Sports-Inspired Wedding",
      content:
        "Incorporate sports-themed décor like a cricket pitch mandap or football cake..",
      id: "sports-wedding",
    },
  ];

  useEffect(() => {
    const carousel = carouselRef.current;
    let scrollAmount = 0;
    let animationFrame;

    const smoothScroll = () => {
      if (carousel) {
        const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
        scrollAmount += 0.5; // Adjust scrolling speed

        if (scrollAmount > maxScrollLeft) {
          scrollAmount = 0; // Reset scroll position
        }

        carousel.scrollTo({ left: scrollAmount });
        animationFrame = requestAnimationFrame(smoothScroll);
      }
    };

    animationFrame = requestAnimationFrame(smoothScroll);

    return () => cancelAnimationFrame(animationFrame); // Cleanup on component unmount
  }, []);

  return (
    <div className="md:mx-10 mx-2">
      <section className="w-full h-auto bg-white p-8 overflow-hidden">
        <h2 className="font-serif text-3xl text-center font-bold text-pink-700 mb-8">
          Browse Popular Wedding Themes
        </h2>

        <div
          ref={carouselRef}
          className="flex overflow-x-scroll gap-6 scrollbar-hide h-60"
        >
          {cards.map((card) => (
            <div
              key={card.id}
              style={{
                backgroundImage: `url(${card.url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="relative flex-none w-[300px] h-68 rounded-xl shadow-lg"
            >
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <div className="text-center text-white p-4">
                  <h3 className="text-lg font-bold">{card.title}</h3>
                  <p className="text-sm mt-2">{card.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Allcategory;
