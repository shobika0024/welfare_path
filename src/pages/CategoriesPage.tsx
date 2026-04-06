import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Categories from "@/components/Categories";

const CategoriesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Categories />
      </main>
      <Footer />
    </div>
  );
};

export default CategoriesPage;
