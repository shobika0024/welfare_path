import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedSchemes from "@/components/FeaturedSchemes";
import Categories from "@/components/Categories";
import NearbyServiceCentres from "@/components/NearbyServiceCentres";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <FeaturedSchemes />
        <Categories />
        <NearbyServiceCentres />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
