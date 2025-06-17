import React from "react";
import { motion } from "framer-motion";

const StartupGrind = () => {
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Reduced particle count for mobile
  const particleCount = window.innerWidth < 768 ? 10 : 20;

  return (
    <div className="bg-gradient-to-b from-[#0a0a23] via-[#3a0a3a] to-[#8f004f] text-white min-h-screen">
      {/* Enhanced Responsive Navigation */}
      <nav className="sticky top-0 z-50 bg-[#0a0a23]/90 backdrop-blur-md flex flex-row md:flex-row justify-center items-center md:space-x-6 space-y-2 md:space-y-0 py-3 md:py-4 border-b border-pink-500/30 shadow-lg">
        {[
          { id: "event-info", icon: "", label: "" },
          { id: "event-info", icon: "", label: "About" },
          { id: "schedule", icon: "", label: "Schedule" },

          { id: "community-links", icon: "", label: "Community" },
        ].map((tab) => (
          <motion.button
            key={tab.id}
            className="px-3 py-1 md:px-4 md:py-2 text-pink-400 font-medium hover:text-white transition-all flex items-center group text-sm md:text-base"
            onClick={() => scrollToSection(tab.id)}
            whileHover={{ scale: 1.05 }}
          >
            <span className="mr-2 group-hover:scale-110 transition-transform">
              {tab.icon}
            </span>
            <span className="border-b-2 border-transparent group-hover:border-pink-400 transition-all">
              {tab.label}
            </span>
          </motion.button>
        ))}
      </nav>

      {/* Hero Section with Responsive Particles */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/Startup1.png')] bg-cover bg-center opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a23] via-transparent to-transparent" />

        {/* Responsive particles */}
        {[...Array(particleCount)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-pink-400/20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              size: Math.random() * 5 + 2,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              width: `${Math.random() * 5 + 2}px`,
              height: `${Math.random() * 5 + 2}px`,
            }}
          />
        ))}

        <div className="relative z-10 px-4 sm:px-6 max-w-6xl mx-auto">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-white mb-4 sm:mb-6"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-500">
              STARTUP GRIND
            </span>
            <br />
            <motion.span
              className="text-pink-400 text-3xl sm:text-4xl md:text-7xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              2025
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 sm:mb-10 max-w-3xl mx-auto px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            Vidyalankar's Biggest Innnovation Event - Where Ideas Becomes
            Revolution
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="w-full px-4 sm:px-0"
          >
            <a
              href="https://forms.gle/yEDd4dx8w3f5fBpw5"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full sm:w-auto"
            >
              <button className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                <span className="mr-2">🚀</span>
                <span>Pre-Register Now</span>
                <span className="ml-2 animate-pulse">→</span>
              </button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Event Info Section */}
      <section
        id="event-info"
        className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-[#0a0a23] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute inset-0 bg-[url('/circuit-board.svg')] bg-repeat opacity-30" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 sm:mb-16 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Vidyalankar's Innovation Stage
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-[#1a1a40]/80 p-6 sm:p-8 rounded-xl border border-pink-500/20 shadow-lg backdrop-blur-sm">
                <h3 className="text-xl sm:text-2xl font-semibold text-pink-400 mb-3 sm:mb-4">
                  About The Event
                </h3>
                <p className="text-base sm:text-lg leading-relaxed">
                  This is an event taking place in Vidyalankar to promote the
                  culture of Innovation in their student population and faculty.
                  The event is held on the college campus in collaboration with
                  Mission Unicorn ideation lab. This will be the biggest
                  innovation event Vidyalankar has hosted, and which will happen
                  for a whole month of August.
                </p>
                <p className="mt-3 sm:mt-4 text-base sm:text-lg leading-relaxed">
                  In the period of whole month there will be a main pitch
                  contest happening as follows:
                </p>
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {[
                {
                  icon: "👩‍💼",
                  title: "Investors mentorship and guidance",
                  desc: "Network with successful founders",
                },
                {
                  icon: "🤝",
                  title: "Find Co-Founders",
                  desc: "Build your dream team",
                },
                {
                  icon: "💰",
                  title: "Awards and Cash price",
                  desc: "Awards & cash prizes for the top 3 teams",
                },
                {
                  icon: "🚀",
                  title: "Funding Opportunities",
                  desc: "Opportunity to get real funding & start your venture",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="p-4 sm:p-6 bg-[#1a1a40]/80 rounded-xl border border-pink-500/20 hover:border-pink-500/40 transition-all shadow-md hover:shadow-lg"
                  whileHover={{ y: -5 }}
                >
                  <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">
                    {item.icon}
                  </div>
                  <h4 className="text-lg sm:text-xl font-semibold text-pink-400">
                    {item.title}
                  </h4>
                  <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-300">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section
        id="schedule"
        className="py-12 sm:py-16 lg:py-20 bg-[#1a1a40] relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-20" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 sm:mb-16 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Event Timeline
          </motion.h2>

          <div className="relative">
            {/* Timeline line - hidden on mobile */}
            <div className="hidden md:block absolute left-6 md:left-1/2 h-full w-1 bg-gradient-to-b from-pink-500 to-purple-600 -translate-x-1/2" />

            {[
              {
                step: "Pre-Registration",
                desc: " submit your innovative ideas",
                month: "May",
              },
              {
                step: "Satellite Centers",
                desc: "Pitch your idea and get feedback",
                month: "June",
              },
              {
                step: "Team Registration",
                desc: "Formal team registration process begins",
                month: "June",
              },
              {
                step: "Pitching Rounds",
                desc: "Multiple rounds to evaluate ideas based on feasibility and impact",
                month: "August",
              },
              {
                step: "Final Showdown",
                desc: "Expert judges and audience determine top three winning ideas",
                month: "August",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="mb-8 sm:mb-10 w-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="relative bg-[#292952] p-4 sm:p-6 rounded-xl shadow-lg border border-pink-500/20 hover:border-pink-500/40 transition-all">
                  {/* Timeline dot - shown on mobile */}
                  <div className="md:hidden absolute -left-2 top-6 w-3 h-3 rounded-full bg-pink-500 border-2 border-white" />
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg sm:text-xl font-bold text-pink-400">
                      {item.step}
                    </h3>
                    <span className="px-2 sm:px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-xs sm:text-sm">
                      {item.month}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-gray-300">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Speakers Section */}

      {/* Community Links Section */}
      <section
        id="community-links"
        className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-[#1a1a40] to-[#0a0a23] relative overflow-hidden px-4 sm:px-6"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/circuit-board.svg')] bg-repeat opacity-20" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Join Our Community
          </motion.h2>

          <motion.div
            className="bg-[#1a1a40]/80 p-6 sm:p-8 rounded-xl border border-pink-500/20 shadow-lg backdrop-blur-sm mb-8 sm:mb-12"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col items-center justify-center text-center space-y-3 sm:space-y-4">
              <p className="font-medium text-sm sm:text-xl">WhatsApp Group</p>
              <a
                href="https://chat.whatsapp.com/LQN5RfypzmiGjWM0zkzXj2"
                className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base break-all"
              >
                https://chat.whatsapp.com/LQN5RfypzmiGjWM0zkzXj2
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="w-full px-4 sm:px-0"
          >
            <h3 className="text-xl sm:text-2xl font-semibold text-pink-400 mb-4 sm:mb-6">
              Ready to Join the Innovation Revolution?
            </h3>
            <a
              href="https://your-preregister-link.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full sm:w-auto"
            >
              <button className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto">
                <span className="mr-2">🚀</span>
                <span>Pre-Register Now</span>
                <span className="ml-2 animate-pulse">→</span>
              </button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 bg-[#0a0a23] border-t border-pink-500/20 text-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-gray-400 text-sm sm:text-base">
            © {new Date().getFullYear()} Startup Grind - Vidyalankar. All rights
            reserved.
          </p>
          <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">
            In collaboration with Mission Unicorn Ideation Lab
          </p>
        </div>
      </footer>
    </div>
  );
};

export default StartupGrind;
