import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { ClipboardDocumentListIcon, GlobeAltIcon, GiftIcon, UsersIcon, CheckCircleIcon, CurrencyRupeeIcon, HeartIcon, Cog6ToothIcon, ChatBubbleLeftRightIcon, CameraIcon, PencilIcon, SparklesIcon, CakeIcon, MusicalNoteIcon, SpeakerWaveIcon, PaintBrushIcon, BookOpenIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { clearLoggedInUser, selectLoggedInUser, setLoggedInUser } from "../UserLogin/authSlice";
import toast from "react-hot-toast";

const Navbar = () => {
  const [userRole, setUserRole] = useState('');
  const [isVenuesDropdownOpen, setIsVenuesDropdownOpen] = useState(false);
  const [isVendorsDropdownOpen, setIsVendorsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileVenuesOpen, setIsMobileVenuesOpen] = useState(false);
  const [isMobileVendorsOpen, setIsMobileVendorsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isPlanningToolsDropdownOpen, setIsPlanningToolsDropdownOpen] = useState(false);
const [isMobilePlanningToolsOpen, setIsMobilePlanningToolsOpen] = useState(false);
const [hoveredTool, setHoveredTool] = useState(null);

  const navigate = useNavigate();
  // const token = localStorage.getItem("token");
  // const email = localStorage.getItem("email")
  const userSignedIn = useSelector(selectLoggedInUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/check-auth`, 
          {}, { withCredentials: true }
        );
        if (res.data.role == 'user'){
          dispatch(setLoggedInUser(res.data.user));
        } else {
          dispatch(setLoggedInUser(res.data.vendor));
        }
        setUserRole(res.data.role); // 'user' or 'vendor'
      } catch (err) {
        console.error(err.response.data.message);
      }
    };
    checkUserRole()
  },[navigate])

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate("/userlogin");
  };

  const handleLogout = async() => {
    // localStorage.removeItem("token");
    // localStorage.removeItem("email");
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/logout`, {}, { withCredentials: true });
      const { data } = res;
      if (data.success) {
        toast.success("Logged out successfully!")
        dispatch(clearLoggedInUser());
        navigate("/userlogin");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong.";
      toast.error(errorMessage);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMobileVenues = () => {
    setIsMobileVenuesOpen(!isMobileVenuesOpen);
  };

  const toggleMobileVendors = () => {
    setIsMobileVendorsOpen(!isMobileVendorsOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };
  const toggleMobilePlanningTools = () => {
    setIsMobilePlanningToolsOpen(!isMobilePlanningToolsOpen);
  };

  const handleNavLinkClick = () => {
    setIsProfileDropdownOpen(false);
  };
  
  const navLink = (
    <>
      <NavLink
        to="/best-event-planner"
        className={({ isActive }) =>
          isActive
            ? "font-serif block rounded-md px-3 py-2 text-lg font-semibold text-pink-900"
            : "font-serif block rounded-md px-3 py-2 text-lg font-semibold text-pink-700 hover:text-pink-900"
        }
      >
        Home
      </NavLink>
      <NavLink to="/Wedplan" className={({ isActive }) => 
        isActive ? "font-serif block rounded-md px-3 py-2 text-lg font-semibold text-pink-900" : 
        "font-serif block rounded-md px-3 py-2 text-lg font-semibold text-pink-700 hover:text-pink-900"}>
        WedPlan
      </NavLink>
   {/* Changed By Harsh Jain -- Added Planning Tools dropdown under PlanWise with comprehensive list of planning tools and features */}
   {/* Planning Tools Dropdown (Desktop) */}
    <div
      className="hidden lg:block relative"
      onMouseEnter={() => setIsPlanningToolsDropdownOpen(true)}
      onMouseLeave={() => setIsPlanningToolsDropdownOpen(false)}
    >
      <NavLink
        to="/wedding-planning-services"
        className={({ isActive }) =>
          isActive
            ? "font-serif block rounded-md px-3 py-2 text-lg font-semibold text-pink-900"
            : "font-serif block rounded-md px-3 py-2 text-lg font-semibold text-pink-700 hover:text-pink-900"
        }
      >
        Services 
      </NavLink>
      <div
        className={`absolute left-0 mt-2 bg-white rounded-2xl shadow-2xl z-[5] w-[700px] p-0 transition-all duration-300 ease-in-out border border-pink-100 font-[Inter] ${
          isPlanningToolsDropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        style={{ fontFamily: 'Inter, Montserrat, Poppins, sans-serif' }}
      >
        <div className="flex w-full">
          {/* Left: Tools List */}
          <div className="w-1/2 p-6 pr-4 border-r border-gray-100">
            <div className="flex items-center mb-4">
              <span className="text-lg font-bold text-gray-900">Planning tools</span>
              <span className="ml-2 text-xl">→</span>
            </div>
            <ul className="space-y-3">
              {[
                { name: "Event-Checklist", path: "/event-checklist", icon: CheckCircleIcon, description: "Organize your tasks and keep track of everything leading up to your wedding day." },
                { name: "Budget Advisor", path: "/budgetplanner", icon: CurrencyRupeeIcon, description: "Manage your wedding expenses and stay within your budget with our planning tool." },
                { name: "Guest list & RSVPs", path: "/guestmanager", icon: UsersIcon, description: "Easily manage your guest list, track RSVPs, and organize seating arrangements." },
                { name: "Collaboration-Tool", path: "/collaboration-tool", icon: ClipboardDocumentListIcon, description: "Visualize your wedding planning progress and manage tasks effectively." },
              ].map((tool) => (
                <li key={tool.name}
                  onMouseEnter={() => setHoveredTool(tool)}
                  onMouseLeave={() => setHoveredTool(null)}
                >
                  <NavLink
                    to={tool.path}
                    className={({ isActive }) =>
                      (isActive
                        ? "flex items-center gap-3 px-3 py-2 rounded-lg bg-pink-50 text-pink-700 font-semibold shadow-sm"
                        : "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-800 hover:bg-pink-100 hover:text-pink-700 transition duration-150 ease-in-out font-medium") +
                      " text-base font-[Inter]"
                    }
                  >
                    <tool.icon className="h-5 w-5 text-pink-400 flex-shrink-0" />
                    {tool.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-1/2 p-6 flex flex-col gap-4">
            {/* Promotional Boxes - Always visible */}
            <div className="text-xs font-bold tracking-widest text-gray-700 mb-2">MAKE PLANNING A LITTLE EASIER</div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-yellow-100 rounded-lg p-2 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-pink-200 rounded mb-2"></div>
                <div className="text-xs font-semibold text-gray-800 text-center">Take the style quiz</div>
              </div>
              <div className="bg-orange-100 rounded-lg p-2 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-pink-200 rounded mb-2"></div>
                <div className="text-xs font-semibold text-gray-800 text-center">Get The App</div>
              </div>
              <div className="bg-pink-50 rounded-lg p-2 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-yellow-200 rounded mb-2"></div>
                <div className="text-xs font-semibold text-gray-800 text-center">Explore Budget Advisor</div>
              </div>
            </div>

            {/* Description Area - Visible on hover */}
            {hoveredTool && (
              <div className="mt-4 p-4 bg-pink-50 rounded-lg border border-pink-100">
                <span className="text-lg font-bold text-gray-900">{hoveredTool.name}</span>
                <p className="text-gray-700 mt-1">{hoveredTool.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

     {/* Venues Dropdown (Desktop) */}
    <div
      className="hidden lg:block relative"
      onMouseEnter={() => setIsVenuesDropdownOpen(true)}
      onMouseLeave={() => setIsVenuesDropdownOpen(false)}
    >
      <NavLink
        to="/wedding-venues"
        className={({ isActive }) =>
          isActive
            ? "font-serif block rounded-md px-3 py-2 text-lg font-semibold text-pink-900"
            : "font-serif block rounded-md px-3 py-2 text-lg font-semibold text-pink-700 hover:text-pink-900"
        }
      >
        Venues
      </NavLink>
      <div
        className={`absolute left-0 mt-2 bg-white rounded-2xl shadow-2xl z-[5] w-[320px] px-4 py-4 transition-all duration-300 ease-in-out border border-pink-200 font-[Inter] venues-scrollbar ${
          isVenuesDropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        style={{ fontFamily: 'Inter, Montserrat, Poppins, sans-serif', maxHeight: '70vh', overflowY: 'auto' }}
        tabIndex={0}
        aria-label="Venue locations dropdown"
      >
        <div className="mb-3">
          <span className="text-lg font-bold text-gray-900">Venues</span>
        </div>
        {/* <input
          type="text"
          placeholder="Search venues..."
          className="w-full mb-3 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
          // Add search logic in the future
        /> */}
        <ul className="space-y-2">
          {[
            "mumbai",
            "kalwa",
            "thane",
            "mulund",
            "kalyan",
            "dombivli",
            "ghatkopar",
            "airoli",
            "bhandup",
          ].map((venue) => (
            <li key={venue}>
              <NavLink
                to={`/wedding-venues/${venue}`}
                className={({ isActive }) =>
                  (isActive
                    ? "flex items-center gap-2 px-3 py-2 rounded-lg bg-pink-50 text-pink-700 font-semibold shadow-sm"
                    : "flex items-center gap-2 px-3 py-2 rounded-lg text-gray-800 hover:bg-pink-100 hover:text-pink-700 transition duration-150 ease-in-out font-medium") +
                  " text-base font-[Inter]"
                }
              >
                <span className="h-7 w-7 rounded-full bg-pink-200 flex items-center justify-center text-pink-600 font-bold text-base mr-2">{venue.charAt(0)}</span>
                {venue.charAt(0).toUpperCase() + venue.slice(1)}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="mt-4 text-center">
          {/* Changed By Harsh Jain -- Removed "See all venues" button */}
        </div>
      </div>
    </div>

    {/* Vendors Dropdown (Desktop) */}
    <div
      className="hidden lg:block relative"
      onMouseEnter={() => setIsVendorsDropdownOpen(true)}
      onMouseLeave={() => setIsVendorsDropdownOpen(false)}
    >
      <NavLink
        to="/vendors"
        className={({ isActive }) =>
          isActive
            ? "font-serif block rounded-md px-3 py-2 text-lg font-semibold text-pink-900"
            : "font-serif block rounded-md px-3 py-2 text-lg font-semibold text-pink-700 hover:text-pink-900"
        }
      >
        Vendors
      </NavLink>
      <div
        className={`absolute left-0 mt-2 bg-white rounded-2xl shadow-2xl z-[5] w-[500px] p-0 transition-all duration-300 ease-in-out border border-pink-100 font-[Inter] ${
          isVendorsDropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        style={{ fontFamily: 'Inter, Montserrat, Poppins, sans-serif' }}
      >
        <div className="p-6 pb-2">
          <div className="flex items-center mb-4">
            <span className="text-lg font-bold text-gray-900">Vendors</span>
          </div>
          <ul className="grid grid-cols-2 gap-x-8 gap-y-4">
            {[
              { name: "Photographer", path: "/vendors/photographer", icon: CameraIcon },
              { name: "Mehndi Artist", path: "/vendors/mehndi", icon: PencilIcon },
              { name: "Makeup Artist", path: "/vendors/makeup", icon: SparklesIcon },
              { name: "Caterers", path: "/vendors/caterers", icon: CakeIcon },
              { name: "DJs", path: "/vendors/dj", icon: MusicalNoteIcon },
              { name: "Bands", path: "/vendors/band", icon: SpeakerWaveIcon },
              { name: "Decorators", path: "/vendors/decorators", icon: PaintBrushIcon },
              { name: "Pandits", path: "/vendors/pandit", icon: BookOpenIcon },
              { name: "Invites & Gifts", path: "/vendors/invite", icon: GiftIcon },
              { name: "Fashion Wear", path: "/vendors/fashion", icon: ShoppingBagIcon },
            ].map((vendor) => (
              <li key={vendor.name}>
                <NavLink
                  to={vendor.path}
                  className={({ isActive }) =>
                    (isActive
                      ? "flex items-center gap-3 px-3 py-2 rounded-lg bg-pink-50 text-pink-700 font-semibold shadow-sm"
                      : "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-800 hover:bg-pink-100 hover:text-pink-700 transition duration-150 ease-in-out font-medium") +
                    " text-base font-[Inter]"
                  }
                >
                  <vendor.icon className="h-5 w-5 text-pink-400 flex-shrink-0" />
                  {vendor.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    {/* Mobile Dropdowns */}
    {/* Mobile Dropdown for Planning Tools */}
    <div className="lg:hidden">
      <Link
        to="/wedding-planning-services"
        className="font-serif rounded-md px-3 py-2 text-lg font-semibold text-pink-700 hover:text-pink-900 flex items-center justify-between w-full"
        onClick={toggleMobilePlanningTools}
      >
        PlanWise
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transform transition-transform ${
            isMobilePlanningToolsOpen ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Link>
      {isMobilePlanningToolsOpen && (
        <ul className="bg-gradient-to-br from-pink-100 via-white to-yellow-100 rounded-2xl shadow-2xl p-5 border border-pink-200 flex flex-col gap-2 overflow-x-auto font-[Inter]" style={{ fontFamily: 'Inter, Montserrat, Poppins, sans-serif' }}>
          {[
            { name: "Event-Checklist", path: "/event-checklist", icon: CheckCircleIcon, description: "Organize your tasks and keep track of everything leading up to your wedding day." },
            { name: "Budget Advisor", path: "/budgetplanner", icon: CurrencyRupeeIcon, description: "Manage your wedding expenses and stay within your budget with our planning tool." },
            { name: "Guest list & RSVPs", path: "/guestmanager", icon: UsersIcon, description: "Easily manage your guest list, track RSVPs, and organize seating arrangements." },
            { name: "Collaboration-Tool", path: "/collaboration-tool", icon: ClipboardDocumentListIcon, description: "Visualize your wedding planning progress and manage tasks effectively." },
          ].map((tool) => (
            <li key={tool.name} className="flex flex-col items-center justify-center px-3 min-w-[90px] border-b border-gray-200">
              <tool.icon className="h-7 w-7 text-pink-400 mb-1" />
              <NavLink
                to={tool.path}
                className="block px-2 py-1 rounded-lg text-gray-800 hover:bg-pink-100 hover:text-pink-900 transition duration-150 ease-in-out font-medium text-xs text-center font-[Inter]"
              >
                {tool.name}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </div>

      <div className="lg:hidden">
        <Link to="/wedding-venues"
          className="font-serif rounded-md px-3 py-2 text-lg font-semibold text-pink-700 hover:text-pink-900 flex items-center justify-between w-full"
          onClick={toggleMobileVenues}
        >
          Venues
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transform transition-transform ${
              isMobileVenuesOpen ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Link>
        {isMobileVenuesOpen && (
          <ul className="bg-gradient-to-br from-pink-100 via-white to-yellow-100 rounded-2xl shadow-2xl p-5 border border-pink-200 flex flex-col gap-2 overflow-x-auto font-[Inter]" style={{ fontFamily: 'Inter, Montserrat, Poppins, sans-serif' }}>
            {[
            "mumbai",
            "kalwa",
            "thane",
            "mulund",
            "kalyan",
            "dombivli",
            "ghatkopar",
            "airoli",
            "bhandup",
          ].map((venue) => (
              <li key={venue} className="flex flex-col items-center justify-center px-3 min-w-[90px] border-b border-gray-200">
                <span className="h-7 w-7 mb-1 rounded-full bg-pink-200 flex items-center justify-center text-pink-600 font-bold text-base">{venue.charAt(0)}</span>
                <NavLink
                  to={`/wedding-venues/${venue}`}
                  className="block px-2 py-1 rounded-lg text-gray-800 hover:bg-pink-100 hover:text-pink-900 transition duration-150 ease-in-out font-medium text-xs text-center font-[Inter]"
                >
                  {venue.charAt(0).toUpperCase() + venue.slice(1)}
                </NavLink>
              </li>
            ))}
          </ul>
        )}

        <Link to="/vendors"
          className="font-serif rounded-md px-3 py-2 text-lg font-semibold text-pink-700 hover:text-pink-900 flex items-center justify-between w-full"
          onClick={toggleMobileVendors}
        >
          Vendors
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transform transition-transform ${
              isMobileVendorsOpen ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Link>
        {isMobileVendorsOpen && (
          <ul className="bg-gradient-to-br from-pink-100 via-white to-yellow-100 rounded-2xl shadow-2xl p-5 border border-pink-200 flex flex-col gap-2 overflow-x-auto font-[Inter]" style={{ fontFamily: 'Inter, Montserrat, Poppins, sans-serif' }}>
            {[
              { name: "Photographer", path: "/vendors/photographer", icon: CameraIcon },
              { name: "Mehndi Artist", path: "/vendors/mehndi", icon: PencilIcon },
              { name: "Makeup Artist", path: "/vendors/makeup", icon: SparklesIcon },
              { name: "Caterers", path: "/vendors/caterers", icon: CakeIcon },
              { name: "DJs", path: "/vendors/dj", icon: MusicalNoteIcon },
              { name: "Bands", path: "/vendors/band", icon: SpeakerWaveIcon },
              { name: "Decorators", path: "/vendors/decorators", icon: PaintBrushIcon },
              { name: "Pandits", path: "/vendors/pandit", icon: BookOpenIcon },
              { name: "Invites & Gifts", path: "/vendors/invite", icon: GiftIcon },
              { name: "Fashion Wear", path: "/vendors/fashion", icon: ShoppingBagIcon },
            ].map((vendor) => (
              <li key={vendor.name} className="flex flex-col items-center justify-center px-3 min-w-[90px] border-b border-gray-200">
                <vendor.icon className="h-7 w-7 text-pink-400 mb-1" />
                <NavLink
                  to={vendor.path}
                  className="block px-2 py-1 rounded-lg text-gray-800 hover:bg-pink-100 hover:text-pink-900 transition duration-150 ease-in-out font-medium text-xs text-center font-[Inter]"
                >
                  {vendor.name}
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </div>
   
      <NavLink to="/blogs" className={({ isActive }) => 
        isActive ? "font-serif block rounded-md px-3 py-2 text-lg font-semibold text-pink-900" : 
        "font-serif block rounded-md px-3 py-2 text-lg font-semibold text-pink-700 hover:text-pink-900"}>
        Blogs
      </NavLink>
      <NavLink to="/testimonials" className={({ isActive }) => 
        isActive ? "font-serif block rounded-md px-3 py-2 text-lg font-semibold text-pink-900" : 
        "font-serif block rounded-md px-3 py-2 text-lg font-semibold text-pink-700 hover:text-pink-900"}>
        Testimonials
      </NavLink>
      <NavLink to="/wedding-invitations" className={({ isActive }) => 
        isActive ? "font-serif block rounded-md px-3 py-2 text-lg font-semibold text-pink-900" : 
        "font-serif block rounded-md px-3 py-2 text-lg font-semibold text-pink-700 hover:text-pink-900"}>
        E-Invites
      </NavLink>
    </>
  );

  return (
    <div className="navbar bg-base-600 flex items-center justify-between lg:px-3 lg:py-3 p-2">
      {/* Mobile Menu Button */}
      <div className="navbar-start flex lg:hidden">
        <button className="btn btn-ghost" onClick={toggleMobileMenu} aria-label="Open Menu">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </button>
      </div>

      {/* Logo */}
      <div className="flex items-left space-x-3 px-10 lg:px-8 sm:px-2 lg:text-left text-left">
  <a className="flex items-center space-x-2 sm:space-x-3" href="/">
    <img src="/d.ico" className="h-8 sm:h-10" alt="DreamWedz Logo" />
    <span className="text-lg text-left sm:text-2xl text-yellow-400 font-serif">DreamWedz</span>
  </a>
</div>


      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50">
          <div className="fixed inset-y-0 left-0 bg-white w-70 p-4">
            <button className="absolute top-4 right-4" onClick={toggleMobileMenu}>
              ✕
            </button>
            <div className="space-y-4">{navLink}</div>
          </div>
        </div>
      )}

      {/* Desktop Navbar */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-8">{navLink}</ul>
      </div>
      
      

      {/* Profile / Login Button */}
      <div className="navbar-end flex items-center space-x-2 lg:space-x-10">
  {/* Search Button (hidden on mobile) */}
  <Link
    className="rounded-lg bg-pink-600 px-1 py-1 md:px-2 md:py-2  font-medium text-white outline-none hover:bg-pink-700 "
    aria-label="Search"
    to="/search"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="currentColor"
    >
      <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
    </svg>
  </Link>

  {!userSignedIn ? (
    <button
  className="md:w-10 md:h-10 w-8 h-8 flex items-center justify-center bg-pink-700 hover:bg-pink-800 text-white rounded-full"
  onClick={handleLogin}
  aria-label="Log In"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-6 h-6"
  >
    <path
      fillRule="evenodd"
      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
      clipRule="evenodd"
    />
  </svg>
</button>

) : (
  <>
    <div className="relative">
      <button
        className="flex items-center gap-1 hover:text-orange-600 mx-8 sm:mx-4"
        onClick={toggleProfileDropdown}
        aria-label="Profile Menu"
      >
      <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full flex items-center justify-center dark:bg-gray-600">
     <span className="bg-pink-700 text-white text-lg font-bold flex items-center justify-center w-8 h-8 rounded-full">
      {userSignedIn.email ? userSignedIn.email.charAt(0).toUpperCase() : "?"}
     </span>
     </div>

      </button>

      {/* Profile Dropdown Menu */}
      <ul
        className={`absolute right-0 top-10 mb-0 bg-gray-200 rounded-lg shadow-lg z-[5] w-[200px] p-2 opacity-0 transition-opacity duration-300 ease-in-out ${
          isProfileDropdownOpen
            ? "opacity-100 pointer-events-auto"
            : "pointer-events-none"
        }`}
      >
        <li>
          <NavLink
            className="block p-2 rounded-md text-gray-800 hover:bg-pink-300 hover:text-gray-900 transition duration-150 ease-in-out"
            to={`${userRole === 'vendor' ? '/vendor-dashboard' : '/user-dashboard'}`}
            onClick={handleNavLinkClick}
          >
            My Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            className="block p-2 rounded-md text-gray-800 hover:bg-pink-300 hover:text-gray-900 transition duration-150 ease-in-out"
            to="/profile"
            onClick={handleNavLinkClick}
          >
            My Profile
          </NavLink>
        </li>
        <li>
          <NavLink
            className="block p-2 rounded-md text-gray-800 hover:bg-pink-300 hover:text-gray-900 transition duration-150 ease-in-out"
            to="/myprofile/wishlist"
            onClick={handleNavLinkClick}
          >
            My Wishlist
          </NavLink>
        </li>
        <li>
          <button
            className="block w-full text-left p-2 rounded-md text-gray-800 hover:bg-pink-300 hover:text-gray-900 transition duration-150 ease-in-out"
            onClick={() => {
              handleLogout();
              handleNavLinkClick();
            }}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  </>
)}


</div>


    </div>
  );
};

export default Navbar;
