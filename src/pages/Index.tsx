
import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
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
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check if user has set a theme preference
    const storedTheme = localStorage.getItem('dashboard-theme');
    
    // Only force dark theme if no user preference exists
    if (!storedTheme) {
      setTheme('dark');
    }
  }, [setTheme]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col bg-background"
    >
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <GetStarted />
        <Education />
        <Testimonials />
        <FeaturedCourses />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </motion.div>
  );
};

export default Index;
