import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ListingDetailContent from "@/components/listings/detail/ListingDetailContent";
import { getListingById } from "@/actions/listings";
import { getBetaListingById, isBetaListing } from "@/lib/beta-listings";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Beta ilanlar Supabase'e gitmeden mock data'dan döner
  const listing = isBetaListing(id)
    ? getBetaListingById(id)
    : await getListingById(id);

  if (!listing) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <ListingDetailContent listing={listing} />
      <Footer />
    </div>
  );
}
