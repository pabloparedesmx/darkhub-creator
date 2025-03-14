
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import FeaturedCourses from '@/components/home/FeaturedCourses';
import Pricing from '@/components/home/Pricing';
import GetStarted from '@/components/home/GetStarted';
import FAQ from '@/components/home/FAQ';
import Testimonials from '@/components/home/Testimonials';
import Education from '@/components/home/Education';
import Workshops from '@/components/home/Workshops';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <FeaturedCourses />
        <Education />
        <Workshops />
        <Pricing />
        <Testimonials />
        <FAQ />
        <GetStarted />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
