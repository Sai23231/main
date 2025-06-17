import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useReducedMotion } from 'framer-motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const cards = [
  {
    title: "Venue Matcher AI",
    description:
      "Tell us your vibe and budget — our AI recommends perfect venues in your city, complete with availability, decor themes, and vendor ratings.",
    imageUrl: "/venue-matcher.png",
    blobUrl: "/blob-purple.svg",
    imagePosition: "right",
  },
  {
    title: "Dream Budget Planner",
    description:
      "Manage your event expenses smartly with real-time cost tracking, vendor rate comparison, and guest list budgeting. Stay stylish without surprises!",
    imageUrl: "/budget-planner.png",
    blobUrl: "/blob-gold.svg",
    imagePosition: "left",
  },
  {
    title: "Moodboard Generator",
    description:
      "Not sure what theme suits your event? Our tool generates dreamy color palettes, decor layouts, and inspiration boards from your preferences.",
    imageUrl: "/moodboard-ai.png",
    blobUrl: "/blob-blue.svg",
    imagePosition: "right",
  }
];

const Card = ({
  title,
  description,
  imageUrl,
  blobUrl,
  imagePosition,
  cardBackgroundColor,
  cardBorderColor,
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative w-[85vw] sm:w-[400px] md:w-[600px] lg:w-[700px] min-h-[500px] rounded-2xl overflow-hidden shadow-2xl p-6 md:p-10 border-2"
      style={{
        backgroundColor: cardBackgroundColor,
        borderColor: cardBorderColor,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        willChange: 'transform, opacity',
      }}
    >
      <div className={`flex relative h-full flex-col md:flex-row items-center gap-y-6 md:gap-x-8 ${imagePosition === 'right' ? '' : 'md:flex-row-reverse'}`}>
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white font-[Quicksand]">{title}</h2>
          <p className="text-base md:text-lg text-neutral-300 mb-8 max-w-full px-4 md:px-0 font-[Quicksand]">{description}</p>
        </div>
        <div className="relative w-full md:w-1/2 h-64 md:h-[300px] overflow-hidden rounded-xl flex items-center justify-center">
          <img
            src={imageUrl}
            alt={title}
            className="object-contain w-full h-full"
            style={{ objectPosition: 'center center' }}
          />
          {blobUrl && (
            <div
              className="absolute inset-0 opacity-50 mix-blend-overlay"
              style={{
                backgroundImage: `url(${blobUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

const InteractiveCards = () => {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  const scrollbarRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const SCROLLBAR_HEIGHT_PX = 300;
  const INITIAL_SECOND_CARD_Y_PERCENT = 50;
  const INITIAL_THIRD_CARD_Y_PERCENT = 100;
  const CARD_BACKGROUND_COLOR = 'rgb(30, 24, 50)';
  const CARD_BORDER_COLOR = 'rgb(255, 255, 255)';

  useEffect(() => {
    if (prefersReducedMotion || typeof window === 'undefined') return;

    const section = sectionRef.current;
    const scrollbar = scrollbarRef.current;
    const scrollIndicator = document.getElementById("scroll-indicator");

    if (!section || !scrollbar || !scrollIndicator) return;

    const ctx = gsap.context(() => {
      gsap.set(cardRefs.current[0], { yPercent: -55 });
      gsap.set(cardRefs.current[1], { yPercent: INITIAL_SECOND_CARD_Y_PERCENT, opacity: 10 });
      gsap.set(cardRefs.current[2], { yPercent: INITIAL_THIRD_CARD_Y_PERCENT, opacity: 10 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=1500",
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          pinSpacing: true,
          invalidateOnRefresh: true,
        }
      });

      timeline.to(cardRefs.current[1], {
        yPercent: -55,
        opacity: 1,
        rotation: -2,
        ease: "power2.inOut",
      }, 0);

      timeline.to(cardRefs.current[2], {
        yPercent: INITIAL_SECOND_CARD_Y_PERCENT,
        opacity: 1,
        rotation: 2,
        ease: "power2.inOut",
      }, 0);

      timeline.to(cardRefs.current[0], {
        scale: 0.95,
        rotation: 2,
        ease: "power2.inOut",
      }, 0);

      timeline.to(cardRefs.current[2], {
        yPercent: -55,
        opacity: 1,
        rotation: 2,
        ease: "power2.inOut",
      }, 0.2);

      const scrollbarHeight = scrollbar.offsetHeight;
      const indicatorHeight = scrollIndicator.offsetHeight;
      const availableTravelHeight = scrollbarHeight - indicatorHeight;
      const actualTravelDistance = availableTravelHeight / 2;

      gsap.fromTo(scrollIndicator,
        { y: -actualTravelDistance },
        {
          y: actualTravelDistance,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=1500",
            scrub: 0.5,
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={sectionRef} className="w-full min-h-screen flex flex-col items-center justify-center bg-black py-16 md:py-32 relative z-10">
      <div className="w-full relative z-20 min-h-[800px]">
        <div className="absolute -top-16 md:-top-24 left-0 w-full overflow-hidden whitespace-nowrap text-[4vw] md:text-[6vw] font-extrabold text-neutral-700">
          <p className="animate-marquee">PLAN SMART | CELEBRATE BIG | PLAN SMART |</p>
        </div>

        <div className="relative w-full h-full flex items-center justify-center">
          <div className="relative w-full h-full">
            {cards.map((card, i) => (
              <div
                key={i}
                ref={(el) => cardRefs.current[i] = el}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform-gpu origin-center"
                style={{ zIndex: i + 31 }}
              >
                <Card {...card} cardBackgroundColor={CARD_BACKGROUND_COLOR} cardBorderColor={CARD_BORDER_COLOR} />
              </div>
            ))}
          </div>
        </div>

        <div
          ref={scrollbarRef}
          className="absolute right-4 md:right-20 top-1/2 -translate-y-1/2 w-1 bg-neutral-700 rounded-full flex items-center justify-center"
          style={{ height: SCROLLBAR_HEIGHT_PX }}
        >
          <div id="scroll-indicator" className="absolute h-6 w-6 bg-white rounded-full"></div>
        </div>

        <div className="absolute -bottom-16 md:-bottom-24 left-0 w-full overflow-hidden whitespace-nowrap text-[4vw] md:text-[6vw] font-extrabold text-neutral-700">
          <p className="animate-marquee">PLAN SMART | CELEBRATE BIG | PLAN SMART |</p>
        </div>
      </div>

      <style jsx="true">{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap');

        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .font-[Quicksand] {
          font-family: 'Quicksand', sans-serif;
        }
      `}</style>
    </section>
  );
};

export default InteractiveCards;
