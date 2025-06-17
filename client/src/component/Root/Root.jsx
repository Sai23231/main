import Navbar from "../Navbar/Navbar";
import Footer from "../footer/Footer";
import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import gsap from "gsap";

const Root = () => {
  const nodeRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (nodeRef.current) {
      gsap.fromTo(nodeRef.current, { opacity: 0 }, { opacity: 1, duration: 1 });
    }
  }, [location]);

  // Check if the current location is the homepage or any event-related pages
  const isHomepage = location.pathname === "/";
  const isEventPage = location.pathname.includes(
    "/best-event-planning-services"
  ); // Adjust the condition to match event routes
  const isEventPage2 = location.pathname.includes("/startup-grind"); // Adjust the condition to match event routes

  return (
    <div ref={nodeRef} className="container w-12/12 mx-auto">
      {/* Render Navbar only if not on the homepage or event-related pages */}
      {!isHomepage && !isEventPage && !isEventPage2 && <Navbar />}
      <Outlet location={location} />
      {!isEventPage2 && <Footer />}
    </div>
  );
};

export default Root;
