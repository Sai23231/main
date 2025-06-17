import React, { useState } from "react";
import Packages from "./Pricing";

const PricingTable = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  const pricingPlans = [
   
  ];

  const serviceCategories = [
    { id: "all", name: "All Services" },
    { id: "venue", name: "Venue & Logistics" },
    { id: "food", name: "Food & Beverage" },
    { id: "photo", name: "Photography & Video" },
    { id: "decor", name: "Decor & Styling" },
    { id: "special", name: "Special Services" },
  ];

  const allServices = [
    // Venue & Logistics
    {
      service: "Venue Booking",
      category: "venue",
      fee: "Depends on Location & Capacity",
      description: "Find and book the perfect venue for your event",
      image: "https://images.pexels.com/photos/169189/pexels-photo-169189.jpeg",
      icon: "🏨",
    },
    {
      service: "Guest Accommodation",
      category: "venue",
      fee: "Depends on location",
      description:
        "End-to-end guest accommodation management including hotel bookings",
      image:
        "https://cdn.pixabay.com/photo/2014/06/22/21/49/bedroom-374982_960_720.jpg",
      icon: "🛏️",
    },
    {
      service: "Transportation Coordination",
      category: "venue",
      fee: "Depends on distance",
      description: "Smooth transportation for your guests (buses, cars, etc.)",
      image:
        "https://img.freepik.com/free-vector/passengers-like-approve-autonomos-robotic-driverless-bus_335657-2508.jpg",
      icon: "🚌",
    },

    // Food & Beverage
    {
      service: "Catering Selection",
      category: "food",
      fee: "Starts from ₹500/person",
      description: "Delicious catering options tailored to your preferences",
      image:
        "https://img.freepik.com/free-photo/woman-preparing-delicious-meal-kitchen-side-view_176474-4009.jpg",
      icon: "🍽️",
    },

    // Photography & Video
    {
      service: "Photography & Videography",
      category: "photo",
      fee: "Depends on Package",
      description: "Capture every moment with professional services",
      image:
        "https://cdn.pixabay.com/photo/2018/09/12/12/14/man-3672010_1280.jpg",
      icon: "📷",
    },
    {
      service: "Live Streaming Services",
      category: "photo",
      fee: "Starts at ₹8,000",
      description: "High-quality live stream for virtual guests",
      image:
        "https://img.freepik.com/free-vector/online-wedding-ceremony_23-2148613610.jpg",
      icon: "📹",
    },

    // Decor & Styling
    {
      service: "Decor Customization",
      category: "decor",
      fee: "Starts at ₹10,000",
      description: "Personalized decor themes to match your dream event",
      image:
        "https://cdn.pixabay.com/photo/2016/11/23/17/56/wedding-1854074_1280.jpg",
      icon: "💐",
    },
    {
      service: "Bridal & Groom Styling",
      category: "decor",
      fee: "Starts at ₹20,000",
      description: "Professional styling and makeup services",
      image:
        "https://img.freepik.com/free-photo/professional-makeup-artist-working-with-beautiful-young-woman-man_155003-17428.jpg",
      icon: "💄",
    },
    {
      service: "Bridal/Groom Entry Planning",
      category: "decor",
      fee: "Starts at ₹10,000",
      description: "Grand entry with themes and special effects",
      image:
        "https://img.freepik.com/free-vector/flat-style-wedding-people_24908-57576.jpg",
      icon: "👰",
    },
    {
      service: "Fireworks & Special Effects",
      category: "decor",
      fee: "Starts at ₹10,000",
      description: "Mesmerizing effects to make your event magical",
      image:
        "https://img.freepik.com/free-photo/fireworks-dark-sky-background_1373-2.jpg",
      icon: "🎆",
    },

    // Special Services
    {
      service: "Secret Proposal Planning",
      category: "special",
      fee: "Starts at ₹10,000",
      description: "Plan the perfect surprise proposal with unique setup",
      image:
        "https://img.freepik.com/free-vector/wedding-proposal-illustration_23-2147812320.jpg",
      icon: "💍",
    },
    {
      service: "Marriage Certificate Assistance",
      category: "special",
      fee: "Depends on time needed",
      description: "Simplify the legal formalities for your marriage",
      image:
        "https://img.freepik.com/free-vector/marriage-concept-illustration_114360-2226.jpg",
      icon: "📜",
    },
    {
      service: "Custom Invitation Design",
      category: "special",
      fee: "Starts at ₹599",
      description: "Tailored digital invitations to suit your theme",
      image:
        "https://img.freepik.com/free-vector/hand-drawn-wedding-digital-invitation_23-2149979758.jpg",
      icon: "✉️",
    },
    {
      service: "Invitation Delivery",
      category: "special",
      fee: "Starts at ₹6,000",
      description: "Personalized delivery of your invitations",
      image:
        "https://img.freepik.com/free-vector/cash-delivery-courier-client_23-2148788572.jpg",
      icon: "📬",
    },
    {
      service: "Personalized Guest Experience",
      category: "special",
      fee: "Starts at ₹8,000",
      description: "Make guests feel special with personalized gifts",
      image:
        "https://img.freepik.com/free-photo/party-decoration_23-2148363151.jpg",
      icon: "🎁",
    },
    {
      service: "Baraat & Dhol Services",
      category: "special",
      fee: "Starts at ₹12,000",
      description: "Traditional baraat arrangements with live dhol",
      image:
        "https://img.freepik.com/free-vector/happy-lohri-holiday-festival-punjab-card-design_1035-28018.jpg",
      icon: "🥁",
    },
  ];

  const filteredServices =
    activeCategory === "all"
      ? allServices
      : allServices.filter((service) => service.category === activeCategory);

  const faqs = [
    {
      question: "How far in advance should we book?",
      answer:
        "We recommend booking 6-12 months in advance for full planning services.",
    },
    {
      question: "Can we customize packages?",
      answer:
        "Absolutely! All packages can be tailored to your needs and budget.",
    },
    {
      question: "What's your payment structure?",
      answer:
        "30% deposit to secure your date, with balance in milestone payments.",
    },
  ];

  const handleChoose = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
    setSubmitted(false);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
    setSubmitted(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="font-sans bg-gray-50">
      
<Packages></Packages>
      {/* À La Carte Services */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Individual Services
            </h2>
            <div className="w-20 h-1 bg-pink-500 mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Mix and match services to create your perfect wedding experience
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {serviceCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category.id
                    ? "bg-pink-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.service}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="text-2xl">{service.icon}</span>
                    <h3 className="text-xl font-bold mt-1">
                      {service.service}
                    </h3>
                    <p className="font-medium">Starting at {service.fee}</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <button
                    onClick={() => handleChoose(service)}
                    className="w-full py-2 px-4 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition-all"
                  >
                    Book Service
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Frequently Asked Questions
            </h2>
            <div className="w-20 h-1 bg-pink-500 mx-auto"></div>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Schedule a free consultation with our wedding experts today
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="tel:+919876543210"
              className="flex items-center justify-center bg-white text-pink-600 font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition-all duration-300"
            >
              📞 Call Us Now
            </a>
            <button
              onClick={() => handleChoose({ service: "Consultation" })}
              className="flex items-center justify-center bg-transparent border-2 border-white font-bold py-3 px-6 rounded-full hover:bg-white/10 transition-all duration-300"
            >
              ✉️ Email Inquiry
            </button>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full overflow-hidden shadow-2xl">
            {!isSubmitted ? (
              <>
                <div className="bg-pink-600 text-white p-6">
                  <h3 className="text-2xl font-bold">
                    Inquire About {selectedItem?.plan || selectedItem?.service}
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Wedding Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Your Vision
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Tell us about your dream wedding..."
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-pink-600 text-white font-bold rounded-lg hover:bg-pink-700 transition-all"
                    >
                      Send Inquiry
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center p-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Thank You!
                </h3>
                <p className="text-gray-600 mb-6">
                  We've received your inquiry and will contact you within 24
                  hours to discuss your wedding plans.
                </p>
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-pink-600 text-white font-bold rounded-lg hover:bg-pink-700 transition-all"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingTable;
