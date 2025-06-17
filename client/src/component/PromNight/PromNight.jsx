import React from "react";
import { motion } from "framer-motion";

const MasqueradeProm = () => {
  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <div
        className="relative md:h-screen h-[330px] flex items-center justify-center text-center bg-cover bg-center px-4"
        style={{ backgroundImage: "url('PromNight.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10">
          <motion.h1
            className="text-3xl md:text-5xl font-extrabold text-yellow-400"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Prom Night 2025
          </motion.h1>
          <p className="mt-4 text-sm md:text-lg">
            🎭 Unmask the Magic | Find Your Mystery Match | Dance Under the
            Stars 🌟
          </p>
          <p className="mt-2 text-sm md:text-lg font-semibold">
            Date: 18/04/2025 | Venue: Tom Tom SkyBar & Club, Navi Mumbai
          </p>
          <a
            href="https://universitysolutions.xyz/product/prom-night/"
            rel="noopener noreferrer"
          >
            <motion.button
              className="mt-6 md:px-6 md:py-3 px-3 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg"
              whileHover={{ scale: 1.1 }}
            >
              🎟 Book Your Tickets Now!
            </motion.button>
          </a>
        </div>
      </div>

      {/* Event Details */}
      <section className="py-16 px-6 bg-gray-900 text-center">
        <h2 className="text-4xl font-bold text-yellow-400">
          🎭 What’s Included?
        </h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            "Mystery Match Game – Find Your Prom Date 💌",
            "Couple Dance Show💃🕺",
            "Electrifying DJ Night & Dance Floor 🎶",
            "Romantic & Fun Couple Games 💃",
            "Buffet Dinner & Luxury Mocktails 🍽️",
            "Prom King & Queen Crowning 👑",
            "😂 Hilarious MC-Hosted Fun!",
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 bg-gray-800 rounded-lg shadow-md"
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-lg font-semibold">{feature}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Event Rules */}
      <section className="py-16 bg-gray-900 text-center">
        <h2 className="text-4xl font-bold text-yellow-400">
          📜 Event Rules & Guidelines
        </h2>
        <div className="mt-8 px-6 max-w-3xl mx-auto text-left">
          {[
            "⏳ Entry Time: Gates close at 7:30 PM. Late entries will not be allowed.",
            "🚫 No Outside Food & Drinks: Only food & drinks provided at the venue are allowed.",
            "⚠️ Behavior Policy: Misconduct will result in removal from the event.",
            "🎟 Coupons for Food Access: Guests with food-inclusive tickets will receive a coupon.",
            "🍽 On-Spot Food Purchase: Didn't book food? Pay ₹400 extra at the venue for the buffet.",
            "⛔ No Refunds: Tickets are non-refundable but can be transferred to another person.",
            "🆔 ID Verification: Entry allowed only with a valid college ID or government ID.",
          ].map((rule, index) => (
            <motion.div
              key={index}
              className="p-4 bg-gray-800 rounded-lg mb-4 shadow-md"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-lg">{rule}</p>
            </motion.div>
          ))}
        </div>
      </section>
      {/* Contact Section */}
      <section className="py-16 bg-gray-800 text-center">
        <h2 className="text-4xl font-bold text-yellow-400">
          📞 Contact & Support
        </h2>
        <p className="mt-4 text-lg">
          📱 WhatsApp:{" "}
          <a href="tel:+91XXXXXXXXXX" className="text-yellow-400">
            +91 9321887852/+91 9321505018
          </a>
        </p>
        <p className="mt-2 text-lg">
          📧 Email:{" "}
          <a href="mailto:info@dreamwedz.com" className="text-yellow-400">
            dream.wedzz@gmail.com
          </a>
        </p>
        <p className="mt-2 text-lg">
          📲 Follow us on Instagram:{" "}
          <a
            href="https://instagram.com/yourhandle"
            className="text-yellow-400"
          >
            @dreamwedzofficial
          </a>
        </p>
        <a
          href="https://universitysolutions.xyz/product/prom-night/"
          rel="noopener noreferrer"
        >
          <button className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg">
            🎟 Book Your Spot Now!
          </button>
        </a>
      </section>
    </div>
  );
};

export default MasqueradeProm;
