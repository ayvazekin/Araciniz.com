import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HomeContent from "@/components/home/HomeContent";
import { BETA_LISTINGS } from "@/lib/beta-listings";

export default async function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <HomeContent 
        featuredListings={BETA_LISTINGS} 
        user={null} 
        needsOnboarding={false}
      />
      <Footer />
    </div>
  );
}
