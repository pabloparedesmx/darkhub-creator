import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ChevronDown, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Category } from '@/types/admin';
import { supabase } from "@/lib/supabase";

interface CategoryFiltersProps {
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

const CategoryFilters = ({
  selectedCategories,
  setSelectedCategories
}: CategoryFiltersProps) => {
  const [isOpen, setIsOpen] = useState(true); // Changed to true to make it open by default
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const {
          data,
          error
        } = await supabase.from('categories').select('*').order('name');
        if (error) throw error;
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(category => category.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const clearCategoryFilters = () => {
    setSelectedCategories([]);
  };

  if (isLoading) {
    return <div className="border-t border-border pt-4">
        <div className="flex justify-between items-center w-full text-left mb-2">
          <span className="text-sm font-medium">Categories</span>
          <ChevronDown className="h-4 w-4" />
        </div>
        <div className="animate-pulse space-y-2 mt-2">
          <div className="h-5 bg-muted rounded w-3/4"></div>
          <div className="h-5 bg-muted rounded w-2/3"></div>
          <div className="h-5 bg-muted rounded w-1/2"></div>
        </div>
      </div>;
  }

  if (categories.length === 0) {
    return null;
  }

  return <div className="border-t border-border pt-4">
      <button className="flex justify-between items-center w-full text-left mb-2" onClick={() => setIsOpen(!isOpen)}>
        <span className="text-sm font-medium">Categorías</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && <div className="space-y-2 mt-2">
          {selectedCategories.length > 0 && <Button variant="ghost" size="sm" onClick={clearCategoryFilters} className="h-7 px-2 text-xs text-slate-950 bg-zinc-300 hover:bg-zinc-200">Borrar Filtros</Button>}
          
          {categories.length > 5 && <div className="relative mb-3">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search categories..." className="pl-8 py-1 h-8 text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>}
          
          {filteredCategories.length === 0 ? <p className="text-xs text-muted-foreground py-1">No categories match your search</p> : filteredCategories.map(category => <div key={category.id} className="flex items-center space-x-2">
                <Checkbox id={`category-${category.id}`} checked={selectedCategories.includes(category.id)} onCheckedChange={() => handleCategoryToggle(category.id)} />
                <label htmlFor={`category-${category.id}`} className="text-sm cursor-pointer flex items-center">
                  {category.name}
                  <span className="ml-1 text-xs text-muted-foreground">({category.count})</span>
                </label>
              </div>)}
        </div>}
    </div>;
};

export default CategoryFilters;
