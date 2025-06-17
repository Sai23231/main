import { useDispatch, useSelector } from 'react-redux'
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import SearchResults from "../src/component/SearchBar/Search.jsx";
import VendorRegistration from "./component/VendorRegistration/VendorRegistration.jsx";
import DetailsPage from "./component/Vendors/InviteGifts/Detail.jsx";
// import Dashboard from "./component/Navbar/Dashboard.jsx";
import AdminDashboard from "./component/AdminDashboard/Admin.jsx";
import Example from "./component/Cards/wcategory.jsx";
import Home from "./component/home/Home.jsx";
import Menu from "./component/Menue/Menu.jsx";
import Questionnaire from "./component/Questionaire/Questionaire.jsx";
import Root from "./component/Root/Root.jsx";
import Testimonials from "./component/Testimonials/testimonials.jsx";
import Userlogin from "./component/UserLogin/userlogin.jsx";
import VendorLogin from "./component/VendorLogin/vendorlogin.jsx";
import InvitationStore from "./component/Vendors/InviteGifts/IG.jsx";
import InviteVendor from "./component/Vendors/InviteStore/Invite.jsx";
import PaymentPage from "./component/Vendors/InviteGifts/Payment.jsx";
import Vendors from "./component/Vendors/Vendors.jsx";
import Venue from "./component/Venue/Venue.jsx";
import "./index.css";
import ThemeDetails from "./component/Cards/themes.jsx";
import ErrorElement from "./pages/Errorpage/ErrorElement.jsx";
import Allcategory from "./component/SearchBar/allcity/allcategory.jsx";
import WishlistPage from "./component/Vendors/InviteGifts/wishlist.jsx";
import Blogs from "./component/Blog/blogsection.jsx";
import Profile from "./component/Navbar/myprofile.jsx";
import VendorDashboard from "./component/VendorDashboard/VendorDashboard.jsx";
import SearchComponent from "../src/component/SearchBar/Search.jsx";
import GalleryLayout from "./component/photo/GalleryLayout.jsx";
import CustomerSupport from "./component/footer/CustomerSupport.jsx";
import WeddingPackages from "./component/pricing plans/Pricing.jsx";
import BookingForm from "./component/pricing plans/Bookingform.jsx";
import SubHome from "./component/home/SuBHome.jsx";
import BudgetManager from "./component/Weddingplanner/Budget.jsx";
import GuestListManager from "./component/Weddingplanner/GuestManager.jsx";
import CollaborativeEventDashboard from "./component/Weddingplanner/TaskDashboard.jsx";
import WeddingPlannerChecklist from "./component/Weddingplanner/Checklist.jsx";
import PricingTable from "./component/pricing plans/pricingplans.jsx";
import AssociatedEvents from "./component/OtherEvents/Events.jsx";
import StudentAmbassadorProgram from "./component/Referral/StudentAmbassador.jsx";
import VenueDetails from "./component/Booking/VenueDetails/VenueDetails.jsx";
import VendorDetails from "./component/Booking/VendorsDetails/VendorsDetails.jsx";
import VendorCategory from "./component/Booking/VendorsDetails/VendorCategory.jsx";
import MasqueradeProm from "./component/PromNight/PromNight.jsx";
import RSVPPage from "./component/Weddingplanner/Rsvp.jsx";
import ForgotPassword from "./component/UserLogin/ForgotPass.jsx";
import ResetPassword from "./component/UserLogin/ResetPass.jsx";
import StartupGrind from "./component/OtherEvents/Diamonds.jsx";
import SharedTaskView from "./component/Weddingplanner/SharedTaskView.jsx";
import UserDashboard from "./component/UserDashboard/UserDashboard.jsx";
import InviteHome from "./component/EInvites/InviteHome.jsx";
import WeddingCards from "./component/EInvites/WeddingCards.jsx";
import VideoCards from "./component/EInvites/VideoCards.jsx";
import SaveDateCards from "./component/EInvites/SaveDateCards.jsx";
import PreviewPage from "./component/EInvites/PreviewPage";
import CustomisationCard from "./component/EInvites/CustomisationCard.jsx";
import DreamSponsorFeature from "./component/Event/EventDashboard.jsx";
import Protected from "./component/Root/Protected.jsx";

import { checkAuthAsync, selectUserChecked } from "./component/UserLogin/authSlice.js";
import { useEffect } from 'react';
import SponsorConnect from './component/Sponsers/EventDashboard.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorElement />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/promnight",
        element: <MasqueradeProm />,
      },
      {
        path: "/sponserconnect",
        element: <SponsorConnect/>,
      },
      {
        path: "/best-event-planner",
        element: <SubHome />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/search",
        element: <SearchComponent />,
      },
      {
        path: "/guestmanager",
        element: <Protected><GuestListManager /></Protected>,
      },
      {
        path: "/guest/:id",
        element: <RSVPPage />,
      },
      {
        path: "/budgetplanner",
        element: <Protected><BudgetManager /></Protected>,
      },
      {
        path: "/wedding-planning-services",
        element: <PricingTable />,
      },
      {
        path: "/collaboration-tool",
        element: <Protected><CollaborativeEventDashboard/></Protected>,
      },
      {
        path: "/event-dashboard",
        element: <DreamSponsorFeature />,
      },
      {
        path: "/task/:taskId",
        element: <SharedTaskView />,
      },
      {
        path: "/Event-Checklist",
        element: <Protected><WeddingPlannerChecklist /></Protected>,
      },
      {
        path: "/best-event-planning-services",
        element: <AssociatedEvents />,
      },
      {
        path: "/startup-grind",
        element: <StartupGrind />,
      },
      {
        path: "/search",
        element: <Example />,
      },
      {
        path: "/studentambassador",
        element: <StudentAmbassadorProgram />,
      },
      {
        // Check its needed or not ??
        path: "/:themeId",
        element: <ThemeDetails />,
      },
      {
        path: "/wishlist",
        element: <WishlistPage />,
      },
      {
        path: "/wedding-venues",
        element: <Venue />,
      },
      {
        path: "/wedding-venues/:city",
        element: <Venue />,
      },

      {
        // Check its needed or not ??
        path: "/menu",
        element: <Menu />,
      },

      {
        path: "/vendors",
        element: <Vendors />,
      },
      {
        path: "/signup",
        element: <VendorRegistration />,
      },
      {
        path: "/blogs",
        element: <Blogs />,
      },
      {
        //modification needed
        path: "/payment",
        element: <PaymentPage />,
      },
      // {
      //   path: "/dashboard",
      //   element: <Dashboard />,
      // },
      {
        path: "/user-dashboard",
        element: <Protected><UserDashboard /></Protected>,
      },
      {
        path: "/admin/dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "/userlogin",
        element: <Userlogin />,
      },
      {
        path: "/vendorlogin",
        element: <VendorLogin />,
      },
      {
        path: "/vendor-dashboard",
        element: <Protected><VendorDashboard /></Protected>,
      },
      {
        path: "/forgotpassword",
        element: <ForgotPassword />,
      },
      {
        path: "/resetPassword",
        element: <ResetPassword />,
      },
      {
        path: "/Cities/Categories",
        element: <Allcategory />,
      },
      {
        path: "/detail", //e-invites
        element: <DetailsPage />,
      },
      {
        //modification needed
        path: "/testimonials",
        element: <Testimonials />,
      },
      {
        path: "/invite",
        element: <InvitationStore />,
      },
      {
        path: "/invitevendor",
        element: <InviteVendor />,
      },
      {
        path: "/Wedplan",
        element: <Protected><Questionnaire /></Protected>,
      },
      {
        //modification needed
        path: "/:city/:vendorType",
        element: <SearchResults />,
      },
      {
        path: "/wedding-venue/:id",
        element: <VenueDetails />,
      },
      {
        path: "/vendors/:category",
        element: <VendorCategory />,
      },

      {
        path: "/vendors/:category/:id",
        element: <VendorDetails />,
      },
      {
        path: "/support",
        element: <CustomerSupport />,
      },
      {
        path: "/gallery-layout/:id",
        element: <GalleryLayout />,
      },
      {
        path: "/weddingpackage",
        element: <WeddingPackages />,
      },
      {
        path: "/pricingplans",
        element: <BookingForm />,
      },
      {
        path: "/wedding-invitations",
        element: <InviteHome />,
        children: [
          {
            path: "wedding-cards",
            element: <WeddingCards showAll={true} />,
          },
          {
            path: "video-cards",
            element: <VideoCards showAll={true} />,
          },
          {
            path: "save-date-cards",
            element: <SaveDateCards showAll={true} />,
          },
        ],
      },
      {
        path: "/wedding-cards",
        element: <WeddingCards />,
      },
      {
        path: "/video-cards",
        element: <VideoCards />,
      },
      {
        path: "/save-date-cards",
        element: <SaveDateCards />,
      },
      {
        path: "/wedding-invitations/:cardType/:titleSlug",
        element: <PreviewPage />,
      },
      {
        path: "/customise/:cardType/:titleSlug",
        element: <CustomisationCard />,
      },
    ],
  },
]);

function App() {
  const dispatch = useDispatch();
  const userChecked = useSelector(selectUserChecked);

  useEffect(() => {
    dispatch(checkAuthAsync());
  }, [dispatch]);

  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <div className="App">
          {userChecked && (
            <>
              <RouterProvider router={router} />
              <Toaster />
            </>
          )}
        </div>
      </GoogleOAuthProvider>
    </>
  )
}

export default App
