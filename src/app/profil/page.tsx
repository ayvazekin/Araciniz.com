import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import IndividualDashboard from "@/components/profile/IndividualDashboard";
import CorporateDashboard from "@/components/profile/CorporateDashboard";

export default async function ProfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Profil bilgilerini çek
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // İlanları çek
  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const stats = {
    active: listings?.filter(l => l.status === "active").length || 0,
    sold: listings?.filter(l => l.status === "sold").length || 0,
    total: listings?.length || 0,
    featured: listings?.filter(l => l.is_featured).length || 0
  };

  const isKurumsal = profile?.account_type === "kurumsal";

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      {isKurumsal ? (
        <CorporateDashboard 
          user={user} 
          profile={profile}
          listings={listings || []} 
          stats={stats}
        />
      ) : (
        <IndividualDashboard 
          user={user} 
          listings={listings || []} 
          stats={stats} 
        />
      )}
      <Footer />
    </div>
  );
}
