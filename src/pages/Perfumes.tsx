import Navbar from "@/components/Navbar";
import PerfumeGrid from "@/components/PerfumeGrid";
import FooterSection from "@/components/FooterSection";

const Perfumes = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <PerfumeGrid />
      </main>
      <FooterSection />
    </div>
  );
};

export default Perfumes;