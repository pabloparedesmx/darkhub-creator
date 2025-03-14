
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
import { Tool } from '@/types/admin';
import { supabase } from "@/lib/supabase";
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
    // Force dark theme for the futuristic AI look
    document.documentElement.classList.add('dark');
  }, []);

  const [featuredTools, setFeaturedTools] = useState<Tool[]>([]);
  
  // Fetch a few tools to showcase
  useEffect(() => {
    const fetchTools = async () => {
      try {
        const { data, error } = await supabase
          .from('tools')
          .select('*')
          .limit(6);
        
        if (error) throw error;
        
        setFeaturedTools(data || []);
      } catch (error) {
        console.error('Error fetching tools:', error);
      }
    };
    
    fetchTools();
  }, []);

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
        
        {/* New Featured Tools Section */}
        {featuredTools.length > 0 && (
          <section className="py-16 px-4">
            <div className="container mx-auto">
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Discover AI Tools</h2>
                <p className="text-muted-foreground">
                  Browse our curated collection of the most powerful AI tools to enhance your workflow and productivity.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {featuredTools.map((tool) => (
                  <motion.div
                    key={tool.id}
                    whileHover={{ y: -5 }}
                    className="bg-card rounded-lg border border-border p-4 h-full flex flex-col"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-md flex items-center justify-center bg-primary/10 text-xl mr-3">
                        {tool.favicon || '🔧'}
                      </div>
                      <h3 className="font-medium">{tool.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground flex-grow">
                      {tool.description}
                    </p>
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 text-sm text-primary hover:underline inline-flex items-center"
                    >
                      Visit website
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </motion.div>
                ))}
              </div>
              
              <div className="text-center">
                <Link to="/tools">
                  <Button size="lg">
                    View All Tools
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}
        
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
