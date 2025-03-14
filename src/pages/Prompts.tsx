import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PromptGrid } from '@/components/prompts/PromptGrid';
import CategoryFilters from '@/components/courses/CategoryFilters';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { PromptWithCategory } from '@/types/prompt';
import ErrorState from '@/components/ui/ErrorState';
import LoadingState from '@/components/ui/LoadingState';

const Prompts = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch prompts with categories
  const { data: prompts, error, isLoading } = useQuery({
    queryKey: ['prompts', selectedCategories, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('prompts')
        .select(`
          *,
          categories (
            name
          )
        `);
      
      // Filter by categories if selected
      if (selectedCategories.length > 0) {
        query = query.in('category_id', selectedCategories);
      }
      
      // Filter by search query if provided
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PromptWithCategory[];
    }
  });
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Function to clear search
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  if (error) {
    return <ErrorState message="Error loading prompts" />;
  }
  
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container py-8"
      >
        <h1 className="text-3xl font-bold mb-4">Prompts</h1>
        <p className="text-muted-foreground mb-8">
          Explora nuestra colección de prompts organizados por categoría
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Sidebar with filters */}
          <div className="md:col-span-3 space-y-6">
            <div className="rounded-lg border p-4 bg-card">
              <h3 className="font-semibold mb-4">Filtros</h3>
              <CategoryFilters 
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
              />
            </div>
          </div>
          
          {/* Main content */}
          <div className="md:col-span-9">
            {/* Search bar */}
            <div className="flex gap-4 items-center mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Buscar prompts..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              {searchQuery && (
                <Button variant="ghost" onClick={clearSearch}>
                  Clear
                </Button>
              )}
            </div>
            
            {/* Prompt grid */}
            {isLoading ? (
              <LoadingState message="Cargando prompts..." />
            ) : prompts && prompts.length > 0 ? (
              <PromptGrid prompts={prompts} />
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No se encontraron prompts</h3>
                <p className="text-muted-foreground">
                  {selectedCategories.length > 0 || searchQuery 
                    ? "Intenta ajustando tus filtros de búsqueda"
                    : "No hay prompts disponibles en este momento"}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Prompts;
