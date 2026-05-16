import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HomeContent from "@/components/home/HomeContent";
import { getFeaturedListings } from "@/actions/listings";
import { checkOnboardingStatus } from "@/actions/profile";

export default async function Home() {
  const { needsOnboarding, user } = await checkOnboardingStatus();
  
  // Sadece vitrine alınan ilanları çek (is_featured = true)
  const featuredListings = await getFeaturedListings(12);

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <HomeContent 
        featuredListings={featuredListings} 
        user={user} 
        needsOnboarding={needsOnboarding}
      />
      <Footer />
    </div>
  );
}
