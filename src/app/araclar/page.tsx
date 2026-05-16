import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SearchResults from "@/components/search/SearchResults";

interface PageProps {
  searchParams: Promise<{
    brand?: string;
    series?: string;
    model?: string;
    year_min?: string;
    year_max?: string;
    price_min?: string;
    price_max?: string;
    mileage_max?: string;
    city?: string;
    district?: string;
    fuel_type?: string;
    transmission?: string;
    body_type?: string;
    damage_status?: string;
    color?: string;
    reasoning?: string;
  }>;
}

export default async function AraclarPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />

      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-40 left-1/4 w-[600px] h-[600px] opacity-[0.08]"
          style={{
            background: "radial-gradient(circle, rgba(184,134,11,1) 0%, transparent 60%)",
            filter: "blur(100px)"
          }}
        />
        <div 
          className="absolute top-1/3 -right-40 w-[500px] h-[500px] opacity-[0.06]"
          style={{
            background: "radial-gradient(circle, rgba(218,165,32,1) 0%, transparent 60%)",
            filter: "blur(100px)"
          }}
        />
      </div>

      <main className="flex-1 pt-20 pb-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <SearchResults filters={params} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
