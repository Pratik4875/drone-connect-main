import { CallToAction } from "@/sections/CallToAction";
import FAQ from "@/sections/FAQ";
import { Footer } from "@/sections/Footer";
import { Header } from "@/sections/Header";
import { Hero } from "@/sections/Hero";
import { ProductShowcase } from "@/sections/ProductShowcase";
import { Testimonials } from "@/sections/Testimonials";

export default function Home() {
  console.log("[Node.js only] ENV_VARIABLE:", process.env.ENV_VARIABLE);

  return (
    <div className="">
      <Header />
      <Hero />
      <ProductShowcase />
      <Testimonials />
      <FAQ />
      <CallToAction />
      <Footer />
    </div>
  );
}
