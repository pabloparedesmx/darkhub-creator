
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CourseCard, { Course } from '@/components/ui/CourseCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, Search, X } from 'lucide-react';

// Mock course data
const coursesData: Course[] = [
  {
    id: '1',
    title: 'Use Grok 3 DeepSearch to do product research on X',
    description: 'How to use Grok 3\'s DeepSearch more to do detailed product research quickly.',
    badges: ['tutorial', 'pro'],
    slug: 'grok-3-deepsearch-product-research',
    icon: '🔍',
    toolName: 'Grok'
  },
  {
    id: '2',
    title: 'Build a simple to-do list app using Bolt',
    description: 'A walkthrough building in Bolt—perfect if you\'re just starting out creating apps using AI.',
    badges: ['tutorial', 'free'],
    slug: 'build-todo-app-bolt',
    icon: '📝',
    toolName: 'Bolt'
  },
  {
    id: '3',
    title: 'Build an app with AI coding tool Bolt',
    description: 'A walkthrough on how to build a waitlist signup web app with login functionality using Bolt.',
    badges: ['tutorial', 'pro'],
    slug: 'build-app-ai-coding-bolt',
    icon: '🤖',
    toolName: 'Bolt'
  },
  {
    id: '4',
    title: 'Upscale images for better resolution',
    description: 'Learn how to upscale images using Topaz Lab\'s Gigapixel.',
    badges: ['tutorial', 'pro'],
    slug: 'upscale-images-better-resolution',
    icon: '🖼️',
    toolName: 'Topaz Lab'
  },
  {
    id: '5',
    title: 'Build an app with AI coding tool Create',
    description: 'A walkthrough on how to build an app using Create',
    badges: ['tutorial', 'pro'],
    slug: 'build-app-ai-coding-create',
    icon: '🧠',
    toolName: 'Create'
  },
  {
    id: '6',
    title: 'Monitoring and improving the sales pipeline',
    description: 'Monitor your sales performance and engagement data to create insightful reports using Claude.',
    badges: ['tutorial', 'pro'],
    slug: 'monitoring-sales-pipeline',
    icon: '📊',
    toolName: 'Claude'
  },
  {
    id: '7',
    title: 'Google Gemini for data analysis',
    description: 'Learn how to use Google Gemini to analyze complex datasets quickly and effectively.',
    badges: ['tutorial', 'free'],
    slug: 'google-gemini-data-analysis',
    icon: '🔎',
    toolName: 'Google Gemini'
  },
  {
    id: '8',
    title: 'Microsoft Copilot for content creation',
    description: 'Accelerate your writing process using Microsoft Copilot to draft, edit, and refine various content formats.',
    badges: ['tutorial', 'pro'],
    slug: 'microsoft-copilot-content-creation',
    icon: '✍️',
    toolName: 'Microsoft Copilot'
  }
];

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState<Course[]>(coursesData);
  const [filters, setFilters] = useState({
    all: true,
    courses: false,
    tutorials: false,
    free: false,
    pro: false
  });

  // Filter category options
  const [categories, setCategories] = useState({
    aiTools: false,
    writing: false,
    coding: false,
    dataAnalysis: false,
    contentCreation: false
  });

  // Difficulty options
  const [difficulties, setDifficulties] = useState({
    beginner: false,
    intermediate: false,
    advanced: false
  });

  // Category accordion
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isDifficultyOpen, setIsDifficultyOpen] = useState(false);

  useEffect(() => {
    // Apply filters
    let filteredCourses = coursesData;

    // Apply search term filter
    if (searchTerm) {
      filteredCourses = filteredCourses.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filters (free/pro)
    if (!filters.all) {
      if (filters.free && !filters.pro) {
        filteredCourses = filteredCourses.filter(course => 
          course.badges.includes('free')
        );
      } else if (filters.pro && !filters.free) {
        filteredCourses = filteredCourses.filter(course => 
          course.badges.includes('pro')
        );
      }
    }

    setCourses(filteredCourses);
  }, [searchTerm, filters]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilters({
      all: true,
      courses: false,
      tutorials: false,
      free: false,
      pro: false
    });
    setCategories({
      aiTools: false,
      writing: false,
      coding: false,
      dataAnalysis: false,
      contentCreation: false
    });
    setDifficulties({
      beginner: false,
      intermediate: false,
      advanced: false
    });
  };

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
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Browse all courses & tutorials</h1>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters sidebar */}
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

            {/* Main content */}
            <div className="flex-1">
              <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="w-full sm:w-auto relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search tutorials and courses"
                    className="pl-10 pr-4 py-2 w-full sm:w-80 bg-secondary/50 hover:bg-secondary/80 focus:bg-secondary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setSearchTerm('')}
                    >
                      <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  )}
                </div>
                <div className="w-full sm:w-auto flex items-center">
                  <span className="text-sm text-muted-foreground mr-2">Sort</span>
                  <select className="py-2 px-3 rounded-md bg-secondary/50 text-sm border border-border focus:outline-none focus:ring-1 focus:ring-primary">
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="az">A-Z</option>
                    <option value="za">Z-A</option>
                  </select>
                </div>
              </div>

              <div className="text-sm text-muted-foreground mb-6">
                Showing {courses.length} of {coursesData.length}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <CourseCard course={course} />
                  </motion.div>
                ))}
              </div>

              {courses.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No courses match your filters. Try adjusting your search criteria.</p>
                  <Button 
                    variant="outline" 
                    onClick={clearAllFilters}
                    className="mt-4"
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default Courses;
