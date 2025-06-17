import { motion } from "framer-motion";

// Inline SVG Icons (or replace with custom ones)
const CurrencyDollarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    className="text-green-500 w-16 h-16"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
    />
  </svg>
);

const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    className="text-gray-600 w-16 h-16"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
    />
  </svg>
);

const GiftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-yellow-500 w-16 h-16"
  >
    <path d="M9.375 3a1.875 1.875 0 0 0 0 3.75h1.875v4.5H3.375A1.875 1.875 0 0 1 1.5 9.375v-.75c0-1.036.84-1.875 1.875-1.875h3.193A3.375 3.375 0 0 1 12 2.753a3.375 3.375 0 0 1 5.432 3.997h3.943c1.035 0 1.875.84 1.875 1.875v.75c0 1.036-.84 1.875-1.875 1.875H12.75v-4.5h1.875a1.875 1.875 0 1 0-1.875-1.875V6.75h-1.5V4.875C11.25 3.839 10.41 3 9.375 3ZM11.25 12.75H3v6.75a2.25 2.25 0 0 0 2.25 2.25h6v-9ZM12.75 12.75v9h6.75a2.25 2.25 0 0 0 2.25-2.25v-6.75h-9Z" />
  </svg>
);

const SparklesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-yellow-500 w-16 h-16"
  >
    <path
      fill-rule="evenodd"
      d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
      clip-rule="evenodd"
    />
  </svg>
);

const TrophyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-yellow-500 w-16 h-16"
  >
    <path
      fill-rule="evenodd"
      d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 0 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.346A6.707 6.707 0 0 1 9.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 0 0-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 0 1-1.112-3.173 6.73 6.73 0 0 0 2.743-1.347 6.753 6.753 0 0 0 6.139-5.6.75.75 0 0 0-.585-.858 47.077 47.077 0 0 0-3.07-.543V2.62a.75.75 0 0 0-.658-.744 49.22 49.22 0 0 0-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 0 0-.657.744Zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 0 1 3.16 5.337a45.6 45.6 0 0 1 2.006-.343v.256Zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 0 1-2.863 3.207 6.72 6.72 0 0 0 .857-3.294Z"
      clip-rule="evenodd"
    />
  </svg>
);

const UsersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    className="text-gray-500 w-16 h-16"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
    />
  </svg>
);

const StudentAmbassadorProgram = () => {
  const handleApplyNow = () => {
    window.open(
      "https://docs.google.com/forms/d/e/1FAIpQLSfefME3J77mxy1Ia7IT7zOj5BtchSVsPqsMGxVCY3qvuN1odA/viewform?usp=dialog",
      "_blank"
    );
  };

  return (
    <section className="flex flex-col items-center bg-gradient-to-r from-gray-200 to-gray-300 py-12 px-6 md:py-16 md:px-8  w-full">
      <h2 className="text-2xl md:text-4xl font-extrabold text-black text-center mb-6 md:mb-8 tracking-wide drop-shadow-xl animate-pulse">
        Dreamwedz Ambassador Program
      </h2>
      <div className="max-w-4xl text-center p-6 md:p-10 bg-white shadow-xl rounded-xl w-full transition-all transform hover:scale-105">
        <p className="text-gray-700 text-base md:text-lg mb-4 md:mb-6">
          Take your leadership to the next level! Join the Dreamwedz Ambassador
          Program and unlock a world of opportunities, rewards, and recognition.
        </p>
        <p className="text-gray-800 text-lg md:text-xl font-bold mb-3 md:mb-4">
          🎁 Why Become an Ambassador?
        </p>
        <ul className="text-gray-700 text-sm md:text-base md:text-md mt-4 list-disc list-inside text-left space-y-2 md:space-y-3 mx-auto max-w-lg">
          <li>
            💸 Earn{" "}
            <span className="font-bold text-green-600">₹500-₹3,000</span> per
            event referral.
          </li>
          <li>
            🏆 Get featured as the{" "}
            <span className="font-bold text-blue-500">
              "Event of the Month"
            </span>{" "}
            on our website.
          </li>
          <li>
            🎟 Receive{" "}
            <span className="font-bold text-purple-500">exclusive invites</span>{" "}
            to Dreamwedz workshops & events.
          </li>
          <li>
            🎉 Unlock{" "}
            <span className="font-bold text-red-500">special discounts</span> on
            Dreamwedz services.
          </li>
          <li>
            🚀 Top ambassadors get a chance{" "}
            <span className="font-bold text-yellow-500">
              to get extra perks{" "}
            </span>{" "}
            and benefits.
          </li>
        </ul>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-8 md:mt-10 w-full">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="flex flex-col items-center"
          >
            <CurrencyDollarIcon />
            <p className="text-md text-gray-600 mt-2">Cash Rewards</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="flex flex-col items-center"
          >
            <StarIcon />
            <p className="text-md text-gray-600 mt-2">Recognition & Features</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="flex flex-col items-center"
          >
            <GiftIcon />
            <p className="text-md text-gray-600 mt-2">
              Exclusive Event Invites
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="flex flex-col items-center"
          >
            <SparklesIcon />
            <p className="text-md text-gray-600 mt-2">Special Discounts</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="flex flex-col items-center"
          >
            <TrophyIcon />
            <p className="text-md text-gray-600 mt-2">Exclusive Rewards</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="flex flex-col items-center"
          >
            <UsersIcon />
            <p className="text-md text-gray-600 mt-2">
              Networking Opportunities
            </p>
          </motion.div>
        </div>
        <button
          className="bg-pink-600 text-white px-6 md:px-10 py-3 md:py-4 rounded-full shadow-lg text-lg md:text-xl font-semibold hover:bg-pink-700 transition-all mt-6 md:mt-8 hover:scale-105 w-full max-w-xs md:max-w-sm"
          onClick={handleApplyNow}
        >
          📋 Apply Now & Start Earning!
        </button>
        <div className="text-gray-600 text-sm md:text-base mt-6 md:mt-8 w-full">
          <p className="text-center">
            ✅ Gain leadership experience & grow your professional network! 🤝
          </p>
          <p className="text-center mt-2">
            ✅ Promote Dreamwedz & earn exciting rewards! 🎉
          </p>
          <p className="text-center mt-2">
            ✅ Be part of an exclusive community of like-minded groups! 🚀
          </p>
        </div>
        <div className="mt-8 text-center text-gray-700 text-xs md:text-sm w-full">
          <p>
            By applying, you agree to the{" "}
            <a className="text-blue-600">Terms & Conditions</a> of the Dreamwedz
            Ambassador Program.
          </p>
        </div>
      </div>
    </section>
  );
};

export default StudentAmbassadorProgram;
