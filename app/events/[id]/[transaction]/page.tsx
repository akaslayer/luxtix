import Navbar from "@/components/Navbar";
import Transaction from "./_components/Transaction";
import Footer from "@/components/Footer";

function page() {
  return (
    <div>
      <Navbar />
      <Transaction />;
      <Footer />
    </div>
  );
}

export default page;
