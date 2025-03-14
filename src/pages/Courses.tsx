
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Course } from '@/components/ui/CourseCard';
import CourseFilters from '@/components/courses/CourseFilters';
import CourseSearch from '@/components/courses/CourseSearch';
import CourseSort from '@/components/courses/CourseSort';
import CourseGrid from '@/components/courses/CourseGrid';
import { useCourseFilters } from '@/hooks/useCourseFilters';
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const Courses = () => {
  const [coursesData, setCoursesData] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch all courses from Supabase
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // First fetch all courses
        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select(`
            id, 
            title, 
            description, 
            slug, 
            icon,
            is_pro,
            is_free,
            is_tutorial,
            difficulty,
            categories(name)
          `)
          .order('created_at', { ascending: false });
        
        if (coursesError) throw coursesError;
        
        // Then fetch course-tool relationships
        const { data: courseToolsData, error: courseToolsError } = await supabase
          .from('course_tools')
          .select('course_id, tool_id');
        
        if (courseToolsError) throw courseToolsError;
        
        // Create a map of course IDs to tool IDs
        const courseToolsMap: Record<string, string[]> = {};
        courseToolsData.forEach(item => {
          if (!courseToolsMap[item.course_id]) {
            courseToolsMap[item.course_id] = [];
          }
          courseToolsMap[item.course_id].push(item.tool_id);
        });
        
        // Transform data to match Course interface
        const transformedCourses: Course[] = coursesData.map(course => {
          const badges: Array<'tutorial' | 'pro' | 'free'> = [];
          if (course.is_pro) badges.push('pro');
          if (course.is_free) badges.push('free');
          if (course.is_tutorial) badges.push('tutorial');
          
          return {
            id: course.id,
            title: course.title,
            description: course.description,
            badges,
            slug: course.slug,
            icon: course.icon || '📚',
            difficulty: course.difficulty as 'beginner' | 'intermediate' | 'advanced',
            toolName: course.categories ? course.categories.name : undefined,
            toolIds: courseToolsMap[course.id] || [] // Add tool IDs for filtering
          };
        });
        
        setCoursesData(transformedCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast({
          title: "Error",
          description: "Failed to load courses",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourses();
  }, [toast]);

  const {
    searchTerm,
    setSearchTerm,
    courses,
    filters,
    setFilters,
    categories,
    setCategories,
    difficulties,
    setDifficulties,
    selectedTools,
    setSelectedTools,
    clearAllFilters,
    setSortOrder
  } = useCourseFilters(coursesData);

  const handleSortChange = (value: string) => {
    setSortOrder(value);
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

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters sidebar */}
              <CourseFilters 
                filters={filters}
                setFilters={setFilters}
                categories={categories}
                setCategories={setCategories}
                difficulties={difficulties}
                setDifficulties={setDifficulties}
                selectedTools={selectedTools}
                setSelectedTools={setSelectedTools}
                clearAllFilters={clearAllFilters}
              />

              {/* Main content */}
              <div className="flex-1">
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CourseSearch 
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                  <CourseSort onSortChange={handleSortChange} />
                </div>

                <CourseGrid 
                  courses={courses}
                  coursesData={coursesData}
                  clearAllFilters={clearAllFilters}
                />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default Courses;
