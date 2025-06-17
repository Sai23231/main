import React, { useState } from "react";
import { Wedcard } from "../Cards/wedcard";

const testimonialsData = [
  {
    name: "Farewell Team",
    role: "Event Attendees",
    image: "Farewell.jpeg",
    text: "The farewell was beautifully organized. It was a heartfelt and memorable event for everyone.",
    email: "Vasudevclasses@gmail.com",

    rating: 5,
  },
  {
    name: "Priyanka and Donendra",
    role: "Newlyweds",
    image: "MarriagePD.JPG",
    text: "Dreamwedz turned our wedding into a fairy tale. Every detail was perfect, and the team went above and beyond to make our day special!",
    email: "priyankalad123@gmail.com",

    rating: 5,
  },
];

const TestimonialCard = ({ testimonial }) => (
  <li className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
    <a className="cursor-pointer">
      <div className="flex items-center space-x-4">
        <img
          src={testimonial.image}
          className="w-16 h-16 bg-center bg-cover border rounded-full object-cover"
          alt={testimonial.name}
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {testimonial.name}
          </h3>
          <p className="text-gray-500 text-md">{testimonial.role}</p>
          <div className="flex mt-1">
            {[...Array(testimonial.rating)].map((_, i) => (
              <span key={i} className="text-yellow-400">
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-4 text-gray-700 text-md">{testimonial.text}</p>
      <p className="mt-2 text-gray-400 text-sm">Email: {testimonial.email}</p>
    </a>
  </li>
);

const Testimonials = () => {
  const [reviews, setReviews] = useState(testimonialsData);
  const [newReview, setNewReview] = useState({
    name: "",
    email: "",
    text: "",
    rating: 5,
  });
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  const handleRatingChange = (rating) => {
    setNewReview({ ...newReview, rating });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newReview.name && newReview.email && newReview.text) {
      setReviews([
        ...reviews,
        {
          ...newReview,
          role: "Anonymous",
          image: "https://via.placeholder.com/64",
          link: "#",
        },
      ]);
      setNewReview({ name: "", email: "", text: "", rating: 5 });
      setSuccessMessage("Your review has been submitted successfully!");
      setTimeout(() => setSuccessMessage(""), 5000);
    }
  };

  return (
    <div>
      <div
        className="hero h-[450px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://cdn.pixabay.com/photo/2014/11/13/17/04/heart-529607_1280.jpg)",
        }}
      >
        <div className="hero-overlay bg-opacity-0"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl text-black font-bold">
              Write A Review
            </h1>
            <p className="text-3xl text-black font-semibold md:text-center md:text-2xl">
              See what others are saying!
            </p>
          </div>
        </div>
      </div>

      <section id="testimonies" className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-4 sm:mx-8 md:mx-10 lg:mx-20 xl:mx-auto">
          <div className="mb-12 space-y-5 md:mb-16 text-center">
            <div className="inline-block px-3 py-1 text-sm font-semibold text-indigo-100 rounded-lg bg-[#202c47] bg-opacity-60">
              Words from Others
            </div>
            <h1 className="text-3xl font-semibold text-black md:text-5xl">
              It's not just us.
            </h1>
            <p className="text-gray-600">
              Join <strong>{reviews.length}+</strong> happy customers who love
              our service!
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {reviews.map((review, index) => (
              <TestimonialCard key={index} testimonial={review} />
            ))}
          </div>
        </div>
      </section>

      <Wedcard></Wedcard>

      <div className="py-10 bg-white">
        <div className="max-w-lg mx-4 sm:mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-5">
            Write A Review
          </h2>
          {successMessage && (
            <p className="text-green-500 mb-4 text-center">{successMessage}</p>
          )}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-gray-50 p-6 rounded-lg shadow-md"
          >
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newReview.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={newReview.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              name="text"
              placeholder="Your Review"
              value={newReview.text}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              required
            />
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => handleRatingChange(star)}
                  className={`text-2xl ${
                    newReview.rating >= star
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
