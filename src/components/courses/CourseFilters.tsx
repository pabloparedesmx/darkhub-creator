
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

type FiltersState = {
  all: boolean;
  courses: boolean;
  tutorials: boolean;
  free: boolean;
  pro: boolean;
};

type CategoriesState = {
  aiTools: boolean;
  writing: boolean;
  coding: boolean;
  dataAnalysis: boolean;
  contentCreation: boolean;
};

type DifficultiesState = {
  beginner: boolean;
  intermediate: boolean;
  advanced: boolean;
};

interface CourseFiltersProps {
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
  categories: CategoriesState;
  setCategories: React.Dispatch<React.SetStateAction<CategoriesState>>;
  difficulties: DifficultiesState;
  setDifficulties: React.Dispatch<React.SetStateAction<DifficultiesState>>;
  clearAllFilters: () => void;
}

const CourseFilters = ({
  filters,
  setFilters,
  categories,
  setCategories,
  difficulties,
  setDifficulties,
  clearAllFilters
}: CourseFiltersProps) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isDifficultyOpen, setIsDifficultyOpen] = useState(false);

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

        {/* Type filters */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="all" 
              checked={filters.all}
              onCheckedChange={(checked) => {
                if (checked) {
                  setFilters({
                    all: true,
                    courses: false,
                    tutorials: false,
                    free: false,
                    pro: false
                  });
                }
              }}
            />
            <label htmlFor="all" className="text-sm font-medium cursor-pointer">
              All
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="courses" 
              checked={filters.courses}
              onCheckedChange={(checked) => {
                setFilters({
                  ...filters,
                  all: false,
                  courses: !!checked
                });
              }}
            />
            <label htmlFor="courses" className="text-sm font-medium cursor-pointer">
              Courses
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="tutorials" 
              checked={filters.tutorials}
              onCheckedChange={(checked) => {
                setFilters({
                  ...filters,
                  all: false,
                  tutorials: !!checked
                });
              }}
            />
            <label htmlFor="tutorials" className="text-sm font-medium cursor-pointer">
              Tutorials
            </label>
          </div>

          {/* Price type */}
          <div className="flex items-center mt-2">
            <div className="flex items-center mr-4 space-x-2">
              <Checkbox 
                id="free" 
                checked={filters.free}
                onCheckedChange={(checked) => {
                  setFilters({
                    ...filters,
                    all: false,
                    free: !!checked
                  });
                }}
              />
              <label htmlFor="free" className="text-sm font-medium cursor-pointer">
                Free
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="pro" 
                checked={filters.pro}
                onCheckedChange={(checked) => {
                  setFilters({
                    ...filters,
                    all: false,
                    pro: !!checked
                  });
                }}
              />
              <label htmlFor="pro" className="text-sm font-medium cursor-pointer">
                Pro
              </label>
            </div>
          </div>
        </div>

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

        {/* Categories filter */}
        <div className="border-t border-border pt-4">
          <button 
            className="flex justify-between items-center w-full text-left mb-2"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          >
            <span className="text-sm font-medium">Categories</span>
            <ChevronDown 
              className={`h-4 w-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} 
            />
          </button>
          
          {isCategoryOpen && (
            <div className="space-y-2 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="aiTools" 
                  checked={categories.aiTools}
                  onCheckedChange={(checked) => {
                    setCategories({
                      ...categories,
                      aiTools: !!checked
                    });
                  }}
                />
                <label htmlFor="aiTools" className="text-sm cursor-pointer">
                  AI Tools
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="writing" 
                  checked={categories.writing}
                  onCheckedChange={(checked) => {
                    setCategories({
                      ...categories,
                      writing: !!checked
                    });
                  }}
                />
                <label htmlFor="writing" className="text-sm cursor-pointer">
                  Writing
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="coding" 
                  checked={categories.coding}
                  onCheckedChange={(checked) => {
                    setCategories({
                      ...categories,
                      coding: !!checked
                    });
                  }}
                />
                <label htmlFor="coding" className="text-sm cursor-pointer">
                  Coding
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="dataAnalysis" 
                  checked={categories.dataAnalysis}
                  onCheckedChange={(checked) => {
                    setCategories({
                      ...categories,
                      dataAnalysis: !!checked
                    });
                  }}
                />
                <label htmlFor="dataAnalysis" className="text-sm cursor-pointer">
                  Data Analysis
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="contentCreation" 
                  checked={categories.contentCreation}
                  onCheckedChange={(checked) => {
                    setCategories({
                      ...categories,
                      contentCreation: !!checked
                    });
                  }}
                />
                <label htmlFor="contentCreation" className="text-sm cursor-pointer">
                  Content Creation
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
