import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const Photo = () => {
  const navigate = useNavigate();
  const carouselRef = useRef(null);

  const scrollLeft = () => {
    carouselRef.current.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  const categories = [
    {
      id: "groom-dress",
      title: "Groom Wedding Dress",
      img: "https://img.freepik.com/free-photo/stylish-groom_1157-13809.jpg?t=st=1735470802~exp=1735474402~hmac=f69641f4dbe5a3bdf65df433fb306569d38dc194e7cb3312ca64194d9b7fdd95&w=996",
    },
    {
      id: "couple-outfits",
      title: "Couple Outfits",
      img: "https://cdn.pixabay.com/photo/2023/05/26/12/31/couple-8019370_1280.jpg",
    },
    {
      id: "wedding-sarees",
      title: "Wedding Sarees",
      img: "https://img.freepik.com/free-photo/beautiful-young-woman-wearing-sari_23-2149502963.jpg?t=st=1735470961~exp=1735474561~hmac=acdd6821dce13e70e51a10c30e3db823f9c1bc8bfb57ff3ac3103078f9d2800a&w=996",
    },

    {
      id: "mehndi-designs",
      title: "Mehndi Designs",
      img: "https://cdn.pixabay.com/photo/2019/07/24/10/43/mehndi-design-4359883_1280.jpg",
    },
    {
      id: "wedding-hairstyles",
      title: "Wedding Hairstyles",
      img: "https://cdn.pixabay.com/photo/2016/04/26/22/31/bride-1355473_1280.jpg",
    },
    {
      id: "bride-wedding-dresses",
      title: "Bride Wedding Dresses",
      img: "https://cdn.pixabay.com/photo/2016/11/14/04/25/bride-1822587_640.jpg",
    },
    {
      id: "wedding-decoration",
      title: "Wedding Decoration",
      img: "https://cdn.pixabay.com/photo/2016/11/23/17/56/flowers-1854075_1280.jpg",
    },
    {
      id: "wedding-jewellery",
      title: "Wedding Jewellery",
      img: "https://cdn.pixabay.com/photo/2018/02/27/03/15/gold-3184582_1280.jpg",
    },
  ];

  const handleCategoryClick = (id) => {
    navigate(`/gallery-layout/${id}`);
    window.scrollTo(0, 0); // Scroll to top after navigating
  };

  return (
    <div className="relative mt-12 mx-10 lg:mx-20">
      <br />
      <br />
      <h2 className="font-serif text-3xl text-center font-bold text-pink-700 mb-8">
        Gallery
      </h2>

      {/* Scroll Left Button */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-pink-500 text-white p-3 rounded-full hover:bg-pink-700 z-10"
      >
        ←
      </button>

      <div
        className="carousel carousel-end rounded-box overflow-x-auto scrollbar-hide flex"
        ref={carouselRef}
      >
        {categories.map((category) => (
          <div key={category.id} className="carousel-item relative w-80">
            <div
              onClick={() => handleCategoryClick(category.id)}
              className="cursor-pointer"
            >
              <img
                src={category.img}
                alt={category.title}
                className="w-full h-80 object-cover transition-transform duration-500 ease-in-out hover:scale-105"
              />
            </div>
            <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-2 text-center">
              <h3>{category.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll Right Button */}
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-pink-500 text-white p-3 rounded-full hover:bg-pink-700 z-10"
      >
        →
      </button>
      <br />
    </div>
  );
};

export default Photo;
