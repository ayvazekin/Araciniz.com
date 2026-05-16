import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import KVKKContent from "@/components/legal/KVKKContent";

export default function KVKKPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <KVKKContent />
      <Footer />
    </div>
  );
}
