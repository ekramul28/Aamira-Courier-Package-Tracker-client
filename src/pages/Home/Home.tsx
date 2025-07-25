import React from "react";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks";

import CTASection from "./CTASection";
import { Testimonials } from "./Testimonial";

const Home = () => {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <Testimonials />
      <CTASection />
    </div>
  );
};

export default Home;
