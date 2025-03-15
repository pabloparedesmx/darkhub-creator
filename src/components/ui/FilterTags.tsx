
import React from 'react';
import { X } from 'lucide-react';
import { Badge } from './badge';

type FilterTagProps = {
  label: string;
  onRemove: () => void;
};

export function FilterTag({ label, onRemove }: FilterTagProps) {
  return (
    <Badge 
      variant="outline" 
      className="flex items-center gap-1 py-1.5 px-3 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
    >
      {label}
      <button 
        onClick={(e) => {
          e.preventDefault();
          onRemove();
        }} 
        className="ml-1 rounded-full hover:bg-blue-200 p-0.5 transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
}

interface FilterTagsProps {
  activeFilters: {
    id: string;
    label: string;
    onRemove: () => void;
  }[];
}

export function FilterTags({ activeFilters }: FilterTagsProps) {
  if (activeFilters.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {activeFilters.map((filter) => (
        <FilterTag 
          key={filter.id} 
          label={filter.label} 
          onRemove={filter.onRemove} 
        />
      ))}
    </div>
  );
}
