import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Bell, Search, CreditCard, Home, Settings, User, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import CourseCard, { Course } from '@/components/ui/CourseCard';
import { FilterTags } from '@/components/ui/FilterTags';

const UserDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [showAll, setShowAll] = useState(true);
  const [showCourses, setShowCourses] = useState(false);
  const [showPro, setShowPro] = useState(false);
  
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'Use Grok 3 DeepSearch to do product research on X',
      description: 'How to use Grok 3\'s DeepSearch more to do detailed product research quickly.',
      badges: ['pro', 'free'],
      slug: 'grok-product-research',
      toolName: 'Grok',
      toolIcon: '🤖',
    },
    {
      id: '2',
      title: 'Build a simple to-do list app using Bolt',
      description: 'A walkthrough building in Bolt—perfect if you\'re just starting out creating apps using AI.',
      badges: ['free'],
      slug: 'bolt-todo-app',
      toolName: 'Bolt',
      toolIcon: '⚡',
    },
    {
      id: '3',
      title: 'Build an app with AI coding tool Bolt',
      description: 'A walkthrough on how to build a waitlist signup web app with login functionality using Bolt.',
      badges: ['pro', 'free'],
      slug: 'bolt-ai-coding',
      toolName: 'Bolt',
      toolIcon: '⚡',
    },
    {
      id: '4',
      title: 'Upscale images for better resolution',
      description: 'Learn how to upscale images using Topaz Lab\'s Gigapixel.',
      badges: ['pro', 'free'],
      slug: 'upscale-images',
      toolName: 'Topaz Lab',
      toolIcon: '🖼️',
    },
    {
      id: '5',
      title: 'Build an app with AI coding tool Create',
      description: 'A walkthrough on how to build an app using Create',
      badges: ['pro', 'free'],
      slug: 'create-ai-coding',
      toolName: 'Create',
      toolIcon: '✨',
    },
    {
      id: '6',
      title: 'Monitoring and improving the sales pipeline',
      description: 'Monitor your sales performance and engagement data to create insightful reports using Claude.',
      badges: ['pro', 'free'],
      slug: 'sales-pipeline',
      toolName: 'Claude',
      toolIcon: '📊',
    },
  ]);

  // Filter courses based on search term and filter toggles
  useEffect(() => {
    let filtered = courses;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.toolName && course.toolName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply type filters (only if not showing all)
    if (!showAll) {
      if (showCourses && !showPro) {
        filtered = filtered.filter(course => !course.badges.includes('pro'));
      } else if (!showCourses && showPro) {
        filtered = filtered.filter(course => course.badges.includes('pro'));
      } else if (!showCourses && !showPro) {
        // If nothing selected, show nothing
        filtered = [];
      }
    }
    
    setFilteredCourses(filtered);
  }, [searchTerm, courses, showAll, showCourses, showPro]);

  const clearFilters = () => {
    setSearchTerm('');
    setShowAll(true);
    setShowCourses(false);
    setShowPro(false);
  };

  const handleFilterToggle = (filter: 'all' | 'courses' | 'pro') => {
    if (filter === 'all') {
      setShowAll(true);
      setShowCourses(false);
      setShowPro(false);
    } else {
      setShowAll(false);
      if (filter === 'courses') {
        setShowCourses(prev => !prev);
      } else if (filter === 'pro') {
        setShowPro(prev => !prev);
      }
    }
  };

  // Generate active filters for filter tags
  const getActiveFilters = () => {
    const filters = [];
    
    if (searchTerm) {
      filters.push({
        id: 'search',
        label: `Search: ${searchTerm}`,
        onRemove: () => setSearchTerm('')
      });
    }
    
    if (!showAll) {
      if (showCourses) {
        filters.push({
          id: 'courses',
          label: 'Courses',
          onRemove: () => {
            if (!showPro) {
              setShowAll(true);
            }
            setShowCourses(false);
          }
        });
      }
      
      if (showPro) {
        filters.push({
          id: 'pro',
          label: 'Pro Content',
          onRemove: () => {
            if (!showCourses) {
              setShowAll(true);
            }
            setShowPro(false);
          }
        });
      }
    }
    
    return filters;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Dashboard</h1>
            <ThemeToggle />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-3">
              <Card className="bg-secondary/30 backdrop-blur-sm mb-6">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center pt-4 pb-6">
                    <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mb-4">
                      <User className="w-12 h-12 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold mb-1">John Doe</h2>
                    <p className="text-muted-foreground text-sm">john@example.com</p>
                  </div>
                  
                  <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start">
                      <Home className="mr-2 h-5 w-5" />
                      Dashboard
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="mr-2 h-5 w-5" />
                      Profile
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <CreditCard className="mr-2 h-5 w-5" />
                      Subscription
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Bell className="mr-2 h-5 w-5" />
                      Notifications
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="mr-2 h-5 w-5" />
                      Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-secondary/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Subscription</CardTitle>
                  <CardDescription>You are on the Pro plan</CardDescription>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="bg-primary/10 p-4 rounded-md mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Pro Plan</span>
                      <span className="font-semibold">$49/mo</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">Renews on Aug 15, 2023</p>
                    <Button size="sm" variant="outline" className="w-full">Manage Subscription</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-9">
              <Tabs defaultValue="courses">
                <TabsList className="mb-6">
                  <TabsTrigger value="courses">My Courses</TabsTrigger>
                  <TabsTrigger value="saved">Saved</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="courses">
                  <div className="space-y-4">
                    {/* Course browse header */}
                    <h2 className="text-2xl font-bold">Browse all courses & tutorials</h2>
                    
                    {/* Filters and search row */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 my-4">
                      <div className="space-y-3 w-full sm:w-auto">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">Filters</h3>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={clearFilters}
                            className="h-8 px-2 text-xs"
                          >
                            Clear all
                          </Button>
                        </div>
                        
                        {/* Type filters */}
                        <div className="flex flex-wrap gap-3">
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="all" 
                              checked={showAll}
                              onChange={() => handleFilterToggle('all')}
                              className="mr-2"
                            />
                            <label htmlFor="all" className="text-sm cursor-pointer">
                              All
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="courses" 
                              checked={showCourses}
                              onChange={() => handleFilterToggle('courses')}
                              className="mr-2"
                              disabled={showAll}
                            />
                            <label htmlFor="courses" className="text-sm cursor-pointer">
                              Courses
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="pro" 
                              checked={showPro}
                              onChange={() => handleFilterToggle('pro')}
                              className="mr-2"
                              disabled={showAll}
                            />
                            <label htmlFor="pro" className="text-sm cursor-pointer">
                              Pro Content
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-full sm:w-auto relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Search tutorials and courses"
                          className="pl-10 pr-8 py-2 w-full sm:w-80"
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
                        <select className="py-2 px-3 rounded-md bg-secondary/50 text-sm border border-border">
                          <option>Newest</option>
                          <option>Oldest</option>
                          <option>A-Z</option>
                          <option>Z-A</option>
                        </select>
                      </div>
                    </div>

                    {/* Filter Tags - now placed directly below the search bar */}
                    <FilterTags activeFilters={getActiveFilters()} />
                    
                    {/* Displaying count */}
                    <div className="text-sm text-muted-foreground">
                      Showing {filteredCourses.length} of {courses.length}
                    </div>
                    
                    {/* Course grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                      {filteredCourses.map((course, index) => (
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
                    
                    {filteredCourses.length === 0 && (
                      <div className="text-center py-10">
                        <p className="text-muted-foreground">No courses match your filters. Try adjusting your search criteria.</p>
                        <Button 
                          variant="outline" 
                          onClick={clearFilters}
                          className="mt-4"
                        >
                          Clear all filters
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="saved">
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">You haven't saved any courses yet.</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your personal details</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="firstName">First Name</label>
                            <Input id="firstName" defaultValue="John" />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="lastName">Last Name</label>
                            <Input id="lastName" defaultValue="Doe" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email">Email</label>
                          <Input id="email" type="email" defaultValue="john@example.com" />
                        </div>
                        <Button type="button">Save Changes</Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboard;
