import Navbar from "@/components/Navbar";
import ScentRotaryLab from "@/components/ScentRotaryLab";
import FooterSection from "@/components/FooterSection";

const DigitalScentLabPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <ScentRotaryLab />
      </main>
      <FooterSection />
    </div>
  );
};

export default DigitalScentLabPage;