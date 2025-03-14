
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import ToolFilters from './ToolFilters';
import CategoryFilters from './CategoryFilters';

type DifficultiesState = {
  beginner: boolean;
  intermediate: boolean;
  advanced: boolean;
};

interface CourseFiltersProps {
  difficulties: DifficultiesState;
  setDifficulties: React.Dispatch<React.SetStateAction<DifficultiesState>>;
  selectedTools: string[];
  setSelectedTools: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  clearAllFilters: () => void;
}

const CourseFilters = ({
  difficulties,
  setDifficulties,
  selectedTools,
  setSelectedTools,
  selectedCategories,
  setSelectedCategories,
  clearAllFilters
}: CourseFiltersProps) => {
  const [isDifficultyOpen, setIsDifficultyOpen] = useState(true);

  return (
    <div className="w-full lg:w-64 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Filters</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            className="h-8 px-2 text-xs"
          >
            Clear all
          </Button>
        </div>

        {/* Tool filters */}
        <ToolFilters
          selectedTools={selectedTools}
          setSelectedTools={setSelectedTools}
        />

        {/* Category filters */}
        <CategoryFilters
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />

        {/* Difficulty filter */}
        <div className="border-t border-border pt-4">
          <button 
            className="flex justify-between items-center w-full text-left mb-2"
            onClick={() => setIsDifficultyOpen(!isDifficultyOpen)}
          >
            <span className="text-sm font-medium">Difficulty</span>
            <ChevronDown 
              className={`h-4 w-4 transition-transform ${isDifficultyOpen ? 'rotate-180' : ''}`} 
            />
          </button>
          
          {isDifficultyOpen && (
            <div className="space-y-2 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="beginner" 
                  checked={difficulties.beginner}
                  onCheckedChange={(checked) => {
                    setDifficulties({
                      ...difficulties,
                      beginner: !!checked
                    });
                  }}
                />
                <label htmlFor="beginner" className="text-sm cursor-pointer">
                  Beginner
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="intermediate" 
                  checked={difficulties.intermediate}
                  onCheckedChange={(checked) => {
                    setDifficulties({
                      ...difficulties,
                      intermediate: !!checked
                    });
                  }}
                />
                <label htmlFor="intermediate" className="text-sm cursor-pointer">
                  Intermediate
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="advanced" 
                  checked={difficulties.advanced}
                  onCheckedChange={(checked) => {
                    setDifficulties({
                      ...difficulties,
                      advanced: !!checked
                    });
                  }}
                />
                <label htmlFor="advanced" className="text-sm cursor-pointer">
                  Advanced
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseFilters;
