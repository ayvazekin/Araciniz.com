import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MagazaAyarlariContent from "@/components/profile/MagazaAyarlariContent";

export default async function MagazaAyarlariPage() {
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

  // Sadece kurumsal kullanıcılar erişebilir
  if (profile?.account_type !== "kurumsal") {
    redirect("/profil");
  }

  // Şehirleri çek
  const { data: cities } = await supabase
    .from("cities")
    .select("id, name")
    .order("name");

  // Eğer profilde şehir varsa, o şehrin ilçelerini çek
  let districts: { id: number; name: string }[] = [];
  if (profile?.city) {
    const selectedCity = cities?.find(c => c.name === profile.city);
    if (selectedCity) {
      const { data: districtsData } = await supabase
        .from("districts")
        .select("id, name")
        .eq("city_id", selectedCity.id)
        .order("name");
      districts = districtsData || [];
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <MagazaAyarlariContent 
        profile={profile} 
        cities={cities || []}
        districts={districts}
      />
      <Footer />
    </div>
  );
}
