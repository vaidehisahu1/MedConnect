import Hero from "../components/Hero";
import SpecialtiesSection from "../components/SpecialtiesSection";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <SpecialtiesSection />
      {/* We can add Top Rated Doctors here later */}
    </div>
  );
}
