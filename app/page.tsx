import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Categories from "./_components/Categories";
import PopularEvents from "./_components/PopularEvents";
import OnlineEvents from "./_components/OnlineEvents";
import Hero from "./_components/Hero";
import CTA from "./_components/CTA";

function page() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Categories />
      <PopularEvents />
      <OnlineEvents />
      <CTA />
      <Footer />
    </div>
  );
}

export default page;
