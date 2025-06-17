import { useParams, Link } from "react-router-dom";
import { useState } from "react";

const ThemeDetails = () => {
  const { themeId } = useParams();
  const theme = themeData[themeId];

  if (!theme)
    return <p className="text-center text-red-500 text-xl">Theme not found!</p>;

  const [activePin, setActivePin] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header Section */}
      <div className="max-w-5xl mx-auto mb-8 text-center">
        <h1 className="text-4xl font-bold text-pink-700 font-serif mb-4">
          {theme.title}
        </h1>
        <p className="text-lg text-gray-700">{theme.description}</p>
      </div>

      {/* Key Features Section */}
      <div className="max-w-5xl mx-auto mb-8">
        <h2 className="text-2xl font-semibold text-pink-700 mb-4">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-bold text-gray-800">Venues</h3>
            <ul className="list-disc list-inside text-gray-600">
              {theme.features.venues.map((venue, index) => (
                <li key={index}>{venue}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Decor Ideas</h3>
            <ul className="list-disc list-inside text-gray-600">
              {theme.features.decor.map((decor, index) => (
                <li key={index}>{decor}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Dress Code</h3>
            <ul className="list-disc list-inside text-gray-600">
              {theme.features.dressCode.map((dress, index) => (
                <li key={index}>{dress}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Pinterest Pin Gallery */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {theme.pins.map((pin, index) => (
          <div
            key={index}
            className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div
              dangerouslySetInnerHTML={{ __html: pin }}
              className="cursor-pointer"
              onClick={() => setActivePin(pin)}
            ></div>
          </div>
        ))}
      </div>

      {/* Pinterest Pin Modal */}
      {activePin && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div
            dangerouslySetInnerHTML={{ __html: activePin }}
            className="bg-white p-4 rounded-lg max-w-full max-h-full overflow-auto"
          ></div>
          <button
            onClick={() => setActivePin(null)}
            className="absolute top-4 right-4 text-white text-3xl"
          >
            &times;
          </button>
        </div>
      )}

      {/* Back to Themes Button */}
      <div className="flex justify-center mt-8">
        <Link to="/themes" className="text-pink-700 underline text-lg">
          Back to Themes
        </Link>
      </div>
    </div>
  );
};

export default ThemeDetails;

const themeData = {
  "traditional-indian-wedding": {
    title: "Royal Palace Wedding",
    description:
      "Inspired by the grandeur of Indian palaces, this theme is perfect for couples wanting to feel like royalty on their big day. With ornate decorations, regal attire, and historical venues, this theme is timeless.",
    features: {
      venues: ["Udaipur Palaces", "Jaipur Forts", "Hyderabad Palaces"],
      decor: [
        "Luxurious chandeliers",
        "Royal seating arrangements",
        "Floral installations",
      ],
      dressCode: ["Regal sherwanis", "Intricate lehengas"],
    },
    pins: [
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=45317539992765316" height="330" width="345" frameborder="0" scrolling="no" ></iframe>',
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=1090715603481400280" height="330" width="345" frameborder="0" scrolling="no" ></iframe>',
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=309763280638981322" height="330" width="345" frameborder="0" scrolling="no" ></iframe>',
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=50032245854453446" height="714" width="345" frameborder="0" scrolling="no" ></iframe>',
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=20969954510691390" height="714" width="345" frameborder="0" scrolling="no" ></iframe>',
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=32580797301442072" height="714" width="345" frameborder="0" scrolling="no" ></iframe>',
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=624452304585628097" height="330" width="345" frameborder="0" scrolling="no" ></iframe>',
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=27866091437782524" height="332" width="345" frameborder="0" scrolling="no" ></iframe>',
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=288582288634063716" height="330" width="345" frameborder="0" scrolling="no" ></iframe>',
    ],
  },
  "fairytale-wedding": {
    title: "Bollywood Glam Wedding",
    description:
      "This theme takes inspiration from Bollywood cinema, featuring vibrant colors, larger-than-life decorations, and unforgettable entertainment.",
    features: {
      venues: ["Lavish banquet halls", "Themed resorts", "Outdoor stages"],
      decor: ["Bright lighting", "Theatrical props", "Bold color schemes"],
      dressCode: ["Bollywood-style sarees", "Designer tuxedos"],
    },
    pins: [
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=148196643982162326" height="498" width="345" frameborder="0" scrolling="no" ></iframe>',
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=10977592835153548" height="529" width="345" frameborder="0" scrolling="no" ></iframe>',
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=120471358775794967" height="532" width="345" frameborder="0" scrolling="no" ></iframe>',
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=741968107397642587" height="531" width="345" frameborder="0" scrolling="no" ></iframe>',
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=254031235226841181" height="618" width="345" frameborder="0" scrolling="no" ></iframe>',
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=362821313750664543" height="618" width="345" frameborder="0" scrolling="no" ></iframe>',
    ],
  },
  "beach-wedding": {
    title: "Tropical Beach Wedding",
    description:
      "Beach weddings are perfect for couples seeking a serene and picturesque setting. With soft sand, ocean views, and minimalistic decor, this theme is ideal for intimate celebrations.",
    features: {
      venues: ["Goa Beaches", "Kerala Backwaters", "Andaman Islands"],
      decor: ["Seashell accents", "Tropical flowers", "Bamboo seating"],
      dressCode: ["Flowy beach dresses", "Light linen suits"],
    },
    pins: [
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=299348706498919860" height="618" width="345" frameborder="0" scrolling="no" ></iframe>',
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=351912465617590" height="618" width="345" frameborder="0" scrolling="no" ></iframe>',
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=464433780340821213" height="617" width="345" frameborder="0" scrolling="no" ></iframe>',
    ],
  },

  "bohemian-wedding": {
    title: "Traditional South Wedding",
    description:
      "Perfect for free-spirited couples, this theme features natural settings, rustic decor, and a relaxed ambiance.",
    features: {
      venues: ["Forest clearings", "Riverside meadows", "Rustic farms"],
      decor: ["Macrame backdrops", "Wildflower bouquets", "Vintage rugs"],
      dressCode: ["Flowy bohemian dresses", "Casual chic"],
    },
    pins: [
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=1026468940060863396" height="714" width="345" frameborder="0" scrolling="no" ></iframe>',
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=13370130138303582" height="714" width="345" frameborder="0" scrolling="no" ></iframe>',
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=702420873167348110" height="714" width="345" frameborder="0" scrolling="no" ></iframe>',
    ],
  },
  "vintage-wedding": {
    title: "Punjabi Wedding",
    description:
      "Step back in time with this charming theme featuring antique decor, soft pastels, and elegant vintage vibes.",
    features: {
      venues: ["Historic manors", "Botanical gardens", "Charming vineyards"],
      decor: ["Antique table settings", "Lace accents", "Soft pastel flowers"],
      dressCode: ["Vintage-inspired gowns", "Classic tuxedos"],
    },
    pins: [
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=102938475659832" height="330" width="345" frameborder="0" scrolling="no" ></iframe>',
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=203948576938274" height="330" width="345" frameborder="0" scrolling="no" ></iframe>',
    ],
  },
  "royal-wedding": {
    title: "Mughal Garden Wedding",
    description:
      "Step back in time with this charming theme featuring antique decor, soft pastels, and elegant vintage vibes.",
    features: {
      venues: ["Historic manors", "Botanical gardens", "Charming vineyards"],
      decor: ["Antique table settings", "Lace accents", "Soft pastel flowers"],
      dressCode: ["Vintage-inspired gowns", "Classic tuxedos"],
    },
    pins: [
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=102938475659832" height="330" width="345" frameborder="0" scrolling="no" ></iframe>',
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=203948576938274" height="330" width="345" frameborder="0" scrolling="no" ></iframe>',
    ],
  },
  "garden-wedding": {
    title: "Rajwada Theme Wedding",
    description:
      "Step back in time with this charming theme featuring antique decor, soft pastels, and elegant vintage vibes.",
    features: {
      venues: ["Historic manors", "Botanical gardens", "Charming vineyards"],
      decor: ["Antique table settings", "Lace accents", "Soft pastel flowers"],
      dressCode: ["Vintage-inspired gowns", "Classic tuxedos"],
    },
    pins: [
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=102938475659832" height="330" width="345" frameborder="0" scrolling="no" ></iframe>',
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=203948576938274" height="330" width="345" frameborder="0" scrolling="no" ></iframe>',
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=203948576938274" height="330" width="345" frameborder="0" scrolling="no" ></iframe>',
    ],
  },
  "celestial-wedding": {
    title: "Celestial Wedding",
    description:
      "Step back in time with this charming theme featuring antique decor, soft pastels, and elegant vintage vibes.",
    features: {
      venues: ["Historic manors", "Botanical gardens", "Charming vineyards"],
      decor: ["Antique table settings", "Lace accents", "Soft pastel flowers"],
      dressCode: ["Vintage-inspired gowns", "Classic tuxedos"],
    },
    pins: [
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=102938475659832" height="330" width="345" frameborder="0" scrolling="no" ></iframe>',
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=203948576938274" height="330" width="345" frameborder="0" scrolling="no" ></iframe>',
    ],
  },
  "eco-wedding": {
    title: "Eco-Friendly Wedding",
    description:
      "Step back in time with this charming theme featuring antique decor, soft pastels, and elegant vintage vibes.",
    features: {
      venues: ["Historic manors", "Botanical gardens", "Charming vineyards"],
      decor: ["Antique table settings", "Lace accents", "Soft pastel flowers"],
      dressCode: ["Vintage-inspired gowns", "Classic tuxedos"],
    },
    pins: [
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=102938475659832" height="330" width="345" frameborder="0" scrolling="no" ></iframe>',
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=203948576938274" height="330" width="345" frameborder="0" scrolling="no" ></iframe>',
    ],
  },
  "art-wedding": {
    title: "Art Inspired Wedding",
    description:
      "Step back in time with this charming theme featuring antique decor, soft pastels, and elegant vintage vibes.",
    features: {
      venues: ["Historic manors", "Botanical gardens", "Charming vineyards"],
      decor: ["Antique table settings", "Lace accents", "Soft pastel flowers"],
      dressCode: ["Vintage-inspired gowns", "Classic tuxedos"],
    },
    pins: [
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=102938475659832" height="330" width="345" frameborder="0" scrolling="no" ></iframe>',
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=203948576938274" height="330" width="345" frameborder="0" scrolling="no" ></iframe>',
    ],
  },
  "sports-wedding": {
    title: "Sports Inspired Wedding",
    description:
      "Step back in time with this charming theme featuring antique decor, soft pastels, and elegant vintage vibes.",
    features: {
      venues: ["Historic manors", "Botanical gardens", "Charming vineyards"],
      decor: ["Antique table settings", "Lace accents", "Soft pastel flowers"],
      dressCode: ["Vintage-inspired gowns", "Classic tuxedos"],
    },
    pins: [
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=102938475659832" height="330" width="345" frameborder="0" scrolling="no" ></iframe>',
      '<iframe src="https://assets.pinterest.com/ext/embed.html?id=203948576938274" height="330" width="345" frameborder="0" scrolling="no" ></iframe>',
    ],
  },
};
