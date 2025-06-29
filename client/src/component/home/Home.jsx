import Banner from "../Banner/Banner";
import InteractiveCards from "../Banner/InteractiveCards";
import Chooseus from "../Choose/Chooseus";
import DreamSponsorApp from "../Event/EventDashboard";
import EventBuilder from "../pricing plans/CustomPackage";
import SponsorConnect from "../Sponsers/EventDashboard";
import SponsorConnectCard from "../Sponsers/Sponsersbanner";

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <InteractiveCards></InteractiveCards>
<SponsorConnectCard></SponsorConnectCard>
      <Chooseus></Chooseus>

      <br></br>
      <br></br>
    </div>
  );
};

export default Home;
