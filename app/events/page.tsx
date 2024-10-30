import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroEvent from "./_components/HeroEvent";
import EventsTab from "./_components/EventsTab";

function page() {
  return (
    <div>
      <Navbar />
      <HeroEvent />
      <EventsTab />
      <Footer />
    </div>
  );
}

export default page;
