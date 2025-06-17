import { Link } from "react-router-dom";

const Allcategory = () => {
  return (
    <section className="w-full h-auto bg-white p-8 overflow-x-hidden">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <Link
              to="/"
              className="inline-flex items-center text-lg font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
            >
              Home
            </Link>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg
                className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                All Wedding Categories in Mumbai
              </span>
            </div>
          </li>
        </ol>
      </nav>
      <br />
      <h2 className="font-serif text-3xl text-left font-bold text-gray-700 mb-8">
        Wedding Categories
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
        {cards.map((card) => (
          <Link
            target="_blank"
            to={`/${card.id}`}
            key={card.id}
            className="relative w-full h-64 md:h-80 overflow-hidden inline-block transition-transform duration-300 hover:scale-105"
          >
            <div
              style={{
                backgroundImage: `url(${card.url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="absolute inset-0 rounded-2xl"
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent p-4 flex flex-col justify-end">
              <h3 className="text-white text-xl font-bold mb-2">
                {card.title}
              </h3>
              <p className="text-white text-base">{card.content}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Allcategory;

const cards = [
  {
    url: "https://media.istockphoto.com/id/1349713297/photo/portrait-of-pretty-young-indian-girl-wearing-traditional-saree-gold-jewellery-and-bangles.jpg?s=2048x2048&w=is&k=20&c=n_e6LE7t_R9c9orn1rcIER_5x4_-K6WuJL_Sc5-Zyd0=",
    title: "A Dreamy Bridal Make-Up",
    content:
      "From traditional to modern, see how our bride achieved the perfect look for her big day.",
    id: "makeup",
  },
  {
    url: "p3.png",
    title: "Capturing Memories in Mumbai",
    content:
      "Explore how these photographers captured the magic of a Mumbai wedding with stunning photos.",
    id: 2,
  },
  {
    url: "https://media.istockphoto.com/id/937784568/photo/henna-design.jpg?s=2048x2048&w=is&k=20&c=_x2FoDctv6RhA-m04Sr0LDAEr8hGiY8hz8Cc8S9uz6o=",
    title: "Artistry in Mehndi",
    content:
      "Discover the intricate designs and stories behind the bridal mehndi at this colorful celebration.",
    id: 3,
  },
  {
    url: "https://cdn.pixabay.com/photo/2019/01/26/02/09/buffet-3955616_960_720.jpg",
    title: "A Feast to Remember",
    content:
      "Check out how this couple's catering choice added a delicious touch to their wedding feast.",
    id: 4,
  },
  {
    url: "https://cdn.pixabay.com/photo/2016/03/27/20/54/wedding-reception-1284245_960_720.jpg",
    title: "Transforming Spaces in Mumbai",
    content:
      "See how decorators turned this venue into a stunning wedding space with their creative touches.",
    id: 5,
  },
  {
    url: "https://cdn.pixabay.com/photo/2016/03/27/22/13/love-1284492_1280.jpg",
    title: "Invitations with a Personal Touch",
    content:
      "Explore unique invitation designs that set the tone for this couple's special day.",
    id: 6,
  },
  {
    url: "https://cdn.pixabay.com/photo/2023/10/28/11/52/dj-8347229_960_720.jpg",
    title: "Music That Moved the Crowd",
    content:
      "From DJs to live bands, see how music created unforgettable moments at this lively wedding.",
    id: 7,
  },
];
