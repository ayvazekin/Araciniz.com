import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import KullanimKosullariContent from "@/components/legal/KullanimKosullariContent";

export default function KullanimKosullariPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <KullanimKosullariContent />
      <Footer />
    </div>
  );
}
