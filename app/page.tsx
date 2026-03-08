import Image from "next/image";
import Hero from "@/components/hero-section";
import Features from "@/components/features-1";
import CalltoAction from "@/components/call-to-action";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <CalltoAction />
      <Footer />
    </main>
  );
}
