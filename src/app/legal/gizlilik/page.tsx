import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GizlilikContent from "@/components/legal/GizlilikContent";

export default function GizlilikPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <GizlilikContent />
      <Footer />
    </div>
  );
}
