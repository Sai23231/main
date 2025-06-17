const EventDetails = ({ eventId, onClose }) => {
  const event = eventDetails[eventId];

  if (!event) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-3xl shadow-lg w-full max-w-4xl relative overflow-y-auto max-h-screen">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 bg-pink-700 text-white rounded-full px-2 py-1"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Event Title */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl font-bold text-pink-700 mb-4">
            {event.title}
          </h1>
          <p className="text-gray-700 text-lg">{event.description}</p>
        </div>

        {/* Main Image */}
        <div
          style={{
            backgroundImage: `url(${event.mainImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="h-96 w-full rounded-3xl mb-8 shadow-lg"
        ></div>

        {/* How We Work Section */}
        <div className="bg-white p-6 rounded-3xl shadow-lg mb-8">
          <h2 className="text-gray-800 text-2xl font-bold mb-4">
            How We Made It Special
          </h2>
          <p className="text-gray-600 text-lg">{event.howWeWork}</p>
        </div>

        {/* Photo Gallery */}
        <div className="bg-white p-6 rounded-3xl shadow-lg mb-8">
          <h2 className="text-gray-800 text-2xl font-bold mb-4">Gallery</h2>
          <div className="grid grid-cols-2 gap-4">
            {event.gallery.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Gallery Image ${index + 1}`}
                className="w-full h-58 object-cover rounded-xl shadow-lg"
              />
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-white p-6 rounded-3xl shadow-lg">
          <h2 className="text-gray-800 text-2xl font-bold mb-4">Testimonial</h2>
          <p className="text-gray-600 text-lg italic">"{event.testimonial}"</p>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;

const eventDetails = {
  1: {
    title: "Farewell Bharari",
    description:
      "An unforgettable farewell event that celebrated cherished memories and marked the beginning of a new journey for our beloved students. The evening was filled with heartfelt emotions, nostalgic moments, and an abundance of joy, leaving everyone inspired for the future.",
    mainImage: "Farewell.jpeg",
    howWeWork:
      "We partnered with faculty and student representatives to craft an extraordinary farewell, themed 'Soaring to New Heights.' From vibrant decor featuring motivational quotes to a personalized photo booth, every detail resonated with the students' aspirations. Emotional speeches, an awards ceremony, and a heartfelt farewell video left a lasting impression. Guests enjoyed a thoughtfully curated menu and entertainment that brought laughter and joy. Our meticulous planning ensured a seamless, stress-free experience for everyone involved.",
    gallery: [
      "Farewell1.jpeg",
      "Farewell2.jpeg",
      "Farewell3.JPG",
      "Farewell5.JPG",
    ],
    testimonial:
      "The farewell was beautifully organized. It was a heartfelt and memorable event for everyone.",
  },
  2: {
    title: "Engagement of Priyanka and Donendra: A Peacock-Themed Fairytale",
    description:
      "Step into a mesmerizing world where love meets elegance. Priyanka and Donendra's engagement was a breathtaking fusion of traditional aesthetics and modern charm, with every detail thoughtfully crafted to symbolize their union and grace.",
    mainImage: "EngagementPD.JPG",
    howWeWork:
      "Drawing inspiration from Priyanka and Donendra's love for peacocks, we designed a serene and vibrant atmosphere with a color palette of pink, white, and teal. Majestic peacock feathers adorned the decor, creating an enchanting backdrop. A custom photo booth captured candid moments with loved ones, while handcrafted treats and live music added a touch of magic. Behind the scenes, our team worked tirelessly to ensure every detail unfolded seamlessly, culminating in a ring ceremony that left everyone mesmerized.",
    gallery: [
      "EngagementPD1.JPG",
      "EngagementPD2.JPG",
      "EngagementPD3.JPG",
      "EngagementPD4.JPG",
    ],
    testimonial:
      "Every detail spoke of our love story. From the decor to the music, it felt like stepping into a dream. Thank you for making our engagement the most magical day of our lives!",
  },
  3: {
    title:
      "Wedding of Priyanka and Donendra: A Traditional Hindu Marathi Celebration",
    description:
      "A grand celebration of love and culture, blending the richness of Marathi traditions with modern elegance. Priyanka and Donendra's wedding was a day filled with vibrant rituals, heartfelt moments, and unparalleled joy.",
    mainImage: "MarriagePD.JPG",
    howWeWork:
      "To honor the essence of a traditional Hindu Marathi wedding, we immersed ourselves in understanding every ritual and custom. The floral mandap was a masterpiece, vibrant with hues symbolizing love and unity. Traditional music and dance added authenticity, while personalized touches like handcrafted wedding favors made guests feel cherished. The grand entrance of the couple was unforgettable, with dhol players and flower showers creating an electrifying moment. Our dedication ensured a seamless and joyous celebration for all.",
    gallery: [
      "WeddingPD.JPG",
      "WeddingPD1.JPG",
      "WeddingPD2.JPG",
      "WeddingPD3.JPG",
      "WeddingPD4.JPG",
      "WeddingPD5.JPG",
    ],
    testimonial:
      "Our wedding was everything we had envisioned and more. Every detail honored our traditions and captured the essence of our love. Thank you for making it the most joyous and memorable day of our lives!",
  },
};
