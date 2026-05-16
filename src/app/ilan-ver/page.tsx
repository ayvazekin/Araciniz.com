import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ListingFormWrapper from "@/components/listings/create/ListingFormWrapper";

export default async function CreateListingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-20 relative">
        {/* Background Glows */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute -top-40 -left-40 w-[500px] h-[500px] opacity-[0.08]"
            style={{
              background: "radial-gradient(circle, rgba(184,134,11,1) 0%, transparent 60%)",
              filter: "blur(100px)"
            }}
          />
          <div 
            className="absolute -top-40 -right-40 w-[500px] h-[500px] opacity-[0.08]"
            style={{
              background: "radial-gradient(circle, rgba(184,134,11,1) 0%, transparent 60%)",
              filter: "blur(100px)"
            }}
          />
        </div>

        <div className="max-w-2xl mx-auto px-6 relative z-10">
          <ListingFormWrapper />
        </div>
      </main>

      <Footer />
    </div>
  );
}
