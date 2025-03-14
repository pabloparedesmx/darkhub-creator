
import { useEffect } from 'react';
import Hero from '@/components/home/Hero';
import FeaturedCourses from '@/components/home/FeaturedCourses';
import GetStarted from '@/components/home/GetStarted';
import Testimonials from '@/components/home/Testimonials';
import Education from '@/components/home/Education';
import FAQ from '@/components/home/FAQ';
import Pricing from '@/components/home/Pricing';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/use-theme';

const Index = () => {
  const { setTheme } = useTheme();
  
  // Scroll to top on page load and force dark theme
  useEffect(() => {
    window.scrollTo(0, 0);
    // Always force dark theme on homepage
    setTheme('dark');
  }, [setTheme]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col bg-background"
    >
      <main className="flex-grow">
        <Hero />
        <GetStarted />
        <Education />
        <Testimonials />
        <FeaturedCourses />
        <Pricing />
        <FAQ />
      </main>
    </motion.div>
  );
};

export default Index;
