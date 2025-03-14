
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Layout } from '@/components/layout/Layout';
import { Search, X, ExternalLink, SortAsc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tool } from '@/types/admin';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';

const Tools = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'name' | 'created_at'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Function to handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Function to clear search
  const clearSearch = () => {
    setSearchQuery('');
  };

  // Fetch all tools
  const { data: tools, isLoading, error } = useQuery({
    queryKey: ['tools', sortOption, sortDirection],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order(sortOption, { ascending: sortDirection === 'asc' });

      if (error) throw error;
      return data as Tool[];
    }
  });

  // Filter tools based on search query
  const filteredTools = tools?.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Function to handle sort changes
  const handleSortChange = (option: 'name' | 'created_at') => {
    if (sortOption === option) {
      // Toggle direction if same option
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new option and default to ascending
      setSortOption(option);
      setSortDirection('asc');
    }
  };

  // Function to render favicon (either as emoji or image)
  const renderFavicon = (favicon: string) => {
    // Check if the favicon is a URL (starts with http:// or https:// or has image extensions)
    const isUrl = /^(https?:\/\/|www\.)|(\.(png|jpg|jpeg|svg|webp|ico)$)/i.test(favicon);
    
    if (isUrl) {
      return (
        <Avatar className="h-12 w-12 mr-4">
          <img src={favicon} alt="Tool icon" className="h-full w-full object-contain" />
          <AvatarFallback>🔧</AvatarFallback>
        </Avatar>
      );
    }
    
    // If not a URL, render as emoji
    return <span className="text-3xl mr-4">{favicon || '🔧'}</span>;
  };

  // Show loading state
  if (isLoading) {
    return <Layout>
      <div className="container py-16">
        <h1 className="text-3xl font-bold mb-2">Tools</h1>
        <p className="text-muted-foreground mb-8">
          All the AI tools we teach in our tutorials.
        </p>
        <LoadingState message="Loading tools..." />
      </div>
    </Layout>;
  }

  // Show error state
  if (error) {
    return <Layout>
      <div className="container py-16">
        <ErrorState message="Error loading tools" />
      </div>
    </Layout>;
  }

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container py-16"
      >
        <h1 className="text-3xl font-bold mb-2">Tools</h1>
        <p className="text-muted-foreground mb-8">
          All the AI tools we teach in our tutorials.
        </p>

        {/* Search and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search tools..." 
              className="pl-10 pr-10" 
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[100px]">
                <SortAsc className="mr-2 h-4 w-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSortChange('name')}>
                Name {sortOption === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange('created_at')}>
                Date Added {sortOption === 'created_at' && (sortDirection === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Tool Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col"
              >
                <div className="flex items-start mb-4">
                  {renderFavicon(tool.favicon)}
                  <div>
                    <h3 className="text-xl font-semibold">{tool.name}</h3>
                    {tool.has_pro_perk && (
                      <Badge variant="secondary" className="mt-1">
                        Pro perk available
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-muted-foreground mb-4 flex-grow">{tool.description}</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href={tool.url} target="_blank" rel="noopener noreferrer">
                    Visit Tool <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </Button>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No tools found matching your search.</p>
              {searchQuery && (
                <Button variant="outline" onClick={clearSearch} className="mt-4">
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </Layout>
  );
};

export default Tools;
