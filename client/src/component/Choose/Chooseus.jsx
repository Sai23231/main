import AOS from "aos";
import "aos/dist/aos.css";

AOS.init({
  duration: 1000, // Animation duration in milliseconds
  offset: 200, // Offset (in pixels) from the top of the viewport to start the animation
  delay: 50, // Delay (in milliseconds) before animations start
  easing: "ease", // Easing type ('linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out')
});

const Chooseus = () => {
  return (
    <div className="container w-11/12 mx-auto mt-12 bg-white p-7">
      <div className="flex flex-col-reverse lg:flex-row justify-center items-center gap-8">
        <div data-aos="fade-up">
          <h3 className="font-serif text-4xl font-bold mb-5">OUR STORY</h3>
          <p className="font-serif text-black">
            Dreamwedz began with a passion to bring joy, love, and elegance to
            every wedding. We believe that each couple deserves a wedding that
            speaks to their heart and tells their unique love story. Our mission
            is to transform wedding planning from a stressful task into an
            enjoyable experience, focusing on what truly matters—celebrating
            love. We saw couples overwhelmed with the complexities of wedding
            planning and knew there had to be a better way. Dreamwedz was
            created to offer a seamless planning process with a personal touch,
            powered by technology that simplifies logistics, provides clarity,
            and makes every step of the journey enjoyable. Whether you’re
            seeking full-service wedding planning or prefer to handle things
            yourself, Dreamwedz is here to support you. With our transparent
            pricing and expert guidance, we ensure that every detail is crafted
            with care and precision. Our platform helps you create unforgettable
            moments, filled with joy, elegance, and lasting memories. But
            Dreamwedz is more than just wedding planning. We offer individual
            services like guest accommodation, transportation, and other event
            logistics, ensuring no detail is overlooked. Every moment of your
            celebration is handled with the utmost attention, so you can focus
            on the joy of your day. From intimate weddings to grand
            celebrations, Dreamwedz is your partner in creating extraordinary,
            timeless experiences. Let us help you make your dream wedding a
            reality.
          </p>
        </div>
        <div data-aos="fade-down">
          <img
            src="https://i.ibb.co/B4DZCzm/al-elmes-ULHx-Wq8reao-unsplash.jpg"
            className=""
            alt="Dreamwedz"
          />
        </div>
      </div>
    </div>
  );
};

export default Chooseus;
