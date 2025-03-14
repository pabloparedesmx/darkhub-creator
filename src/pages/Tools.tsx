
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Tool } from '@/types/admin';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ToolGrid from '@/components/tools/ToolGrid';

const Tools = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('tools')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        setTools(data || []);
        setFilteredTools(data || []);
      } catch (error) {
        console.error('Error fetching tools:', error);
        toast({
          title: "Error",
          description: "Failed to load tools",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTools();
  }, [toast]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredTools(tools);
    } else {
      const searchTermLower = searchTerm.toLowerCase();
      const filtered = tools.filter(tool => 
        tool.name.toLowerCase().includes(searchTermLower) || 
        tool.description.toLowerCase().includes(searchTermLower)
      );
      setFilteredTools(filtered);
    }
  }, [searchTerm, tools]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col"
    >
      <Navbar />
      <main className="flex-grow pt-24 pb-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">AI Tools</h1>
            <p className="text-muted-foreground mb-6">
              Browse our curated collection of AI tools to enhance your productivity
            </p>
            
            <div className="relative max-w-md mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search tools..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ToolGrid tools={filteredTools} />
          )}
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default Tools;
