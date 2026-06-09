import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import FeaturedSites from "@/components/home/FeaturedSites";
import IndiaMap from "@/components/home/IndiaMap";
import WhyHeritageAI from "@/components/home/WhyHeritageAI";
import Statistics from "@/components/home/Statistics";
import CTA from "@/components/home/CTA";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeaturedSites />
      <IndiaMap />
      <WhyHeritageAI />
      <Statistics />
      <CTA />
      <Footer />
    </>
  );
}