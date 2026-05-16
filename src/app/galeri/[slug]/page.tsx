import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GaleriContent from "@/components/galeri/GaleriContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function GaleriPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Galeri profilini çek
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("company_slug", slug)
    .eq("account_type", "kurumsal")
    .single();

  if (!profile) {
    notFound();
  }

  // Galerinin ilanlarını çek
  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .eq("user_id", profile.id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <GaleriContent profile={profile} listings={listings || []} />
      <Footer />
    </div>
  );
}
