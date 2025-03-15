
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Course } from '@/components/ui/CourseCard';
import CourseFilters from '@/components/courses/CourseFilters';
import CourseSearch from '@/components/courses/CourseSearch';
import CourseSort from '@/components/courses/CourseSort';
import CourseGrid from '@/components/courses/CourseGrid';
import { useCourseFilters } from '@/hooks/useCourseFilters';
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { FilterTags } from '@/components/ui/FilterTags';
import SEO from '@/components/ui/SEO';

const Courses = () => {
  const [coursesData, setCoursesData] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [tools, setTools] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<Record<string, string>>({});

  // Fetch all courses from Supabase
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // First fetch all courses
        const { data: coursesData, error: coursesError } = await supabase.from('courses').select(`
            id, 
            title, 
            description, 
            slug, 
            icon,
            is_pro,
            is_free,
            difficulty,
            category_id
          `).order('created_at', { ascending: false });
        if (coursesError) throw coursesError;

        // Then fetch course-tool relationships
        const { data: courseToolsData, error: courseToolsError } = await supabase.from('course_tools').select('course_id, tool_id, tools(id, name, favicon)');
        if (courseToolsError) throw courseToolsError;

        // Create a map of course IDs to tool IDs and tool data
        const courseToolsMap: Record<string, string[]> = {};
        const courseToolInfoMap: Record<string, { name?: string; icon?: string; }> = {};
        courseToolsData.forEach(item => {
          // Add tool ID to the course's tool IDs array
          if (!courseToolsMap[item.course_id]) {
            courseToolsMap[item.course_id] = [];
          }
          courseToolsMap[item.course_id].push(item.tool_id);

          // Set the first tool's info as the course's tool info if not already set
          if (!courseToolInfoMap[item.course_id] && item.tools) {
            const toolInfo = item.tools as any; // Type assertion to access properties

            // Remove "Herramienta: " prefix from name if it exists
            let toolName = toolInfo.name;
            if (toolName && toolName.startsWith('Herramienta: ')) {
              toolName = toolName.replace('Herramienta: ', '');
            }
            courseToolInfoMap[item.course_id] = {
              name: toolName,
              icon: toolInfo.favicon
            };
          }
        });

        // Transform data to match Course interface
        const transformedCourses: Course[] = coursesData.map(course => {
          const badges: Array<'pro' | 'free'> = [];
          if (course.is_pro) badges.push('pro');
          if (course.is_free) badges.push('free');

          // Get the tool info for this course, if any
          const toolInfo = courseToolInfoMap[course.id] || {};
          return {
            id: course.id,
            title: course.title,
            description: course.description,
            badges,
            slug: course.slug,
            icon: course.icon || '📚',
            difficulty: course.difficulty as 'beginner' | 'intermediate' | 'advanced',
            toolName: toolInfo.name,
            toolIcon: toolInfo.icon,
            toolIds: courseToolsMap[course.id] || [],
            categoryId: course.category_id
          };
        });
        setCoursesData(transformedCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast({
          title: "Error",
          description: "Failed to load courses",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, [toast]);

  // Fetch tools and categories for filter tag display
  useEffect(() => {
    const fetchToolsAndCategories = async () => {
      try {
        // Fetch all tools
        const { data: toolsData, error: toolsError } = await supabase.from('tools').select('id, name');
        if (toolsError) throw toolsError;

        // Create a map of tool IDs to names, removing "Herramienta: " prefix if it exists
        const toolsMap: Record<string, string> = {};
        toolsData.forEach(tool => {
          let name = tool.name;
          if (name && name.startsWith('Herramienta: ')) {
            name = name.replace('Herramienta: ', '');
          }
          toolsMap[tool.id] = name;
        });
        setTools(toolsMap);

        // Fetch all categories
        const { data: categoriesData, error: categoriesError } = await supabase.from('categories').select('id, name');
        if (categoriesError) throw categoriesError;

        // Create a map of category IDs to names
        const categoriesMap: Record<string, string> = {};
        categoriesData.forEach(category => {
          categoriesMap[category.id] = category.name;
        });
        setCategories(categoriesMap);
      } catch (error) {
        console.error('Error fetching tools and categories:', error);
      }
    };
    fetchToolsAndCategories();
  }, []);

  const {
    searchTerm,
    setSearchTerm,
    courses,
    difficulties,
    setDifficulties,
    selectedTools,
    setSelectedTools,
    selectedCategories,
    setSelectedCategories,
    clearAllFilters,
    setSortOrder
  } = useCourseFilters(coursesData);

  const handleSortChange = (value: string) => {
    setSortOrder(value);
  };

  // Generate active filters array for filter tags
  const getActiveFilters = () => {
    const filters = [];

    // Add search term filter
    if (searchTerm) {
      filters.push({
        id: 'search',
        label: `Search: ${searchTerm}`,
        onRemove: () => setSearchTerm('')
      });
    }

    // Add difficulty filters
    Object.entries(difficulties).filter(([_, isSelected]) => isSelected).forEach(([difficulty]) => {
      filters.push({
        id: `difficulty-${difficulty}`,
        label: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`,
        onRemove: () => {
          setDifficulties(prev => ({
            ...prev,
            [difficulty]: false
          }));
        }
      });
    });

    // Add tool filters
    selectedTools.forEach(toolId => {
      // Get the tool name from our tools map
      const toolName = tools[toolId] || `Tool ${toolId.substring(0, 4)}`;
      filters.push({
        id: `tool-${toolId}`,
        label: toolName,
        onRemove: () => {
          setSelectedTools(prev => prev.filter(id => id !== toolId));
        }
      });
    });

    // Add category filters  
    selectedCategories.forEach(categoryId => {
      // Get the category name from our categories map
      const categoryName = categories[categoryId] || `Category ${categoryId.substring(0, 4)}`;
      filters.push({
        id: `category-${categoryId}`,
        label: categoryName,
        onRemove: () => {
          setSelectedCategories(prev => prev.filter(id => id !== categoryId));
        }
      });
    });
    return filters;
  };

  return (
    <Layout>
      {/* Add SEO component */}
      <SEO
        title="Tutoriales de IA | AI Makers"
        description="Navega por nuestra colección de tutoriales sobre herramientas de IA. Aprende a usar distintas tecnologías de forma efectiva."
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container py-16"
      >
        <div className="mt-8 mb-12">
          <h1 className="text-3xl font-bold mb-6">Tutoriales de IA</h1>
          <p className="text-muted-foreground mb-10">
            Navega por nuestros tutoriales de IA
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* Filters sidebar */}
            <div className="md:col-span-3 space-y-8">
              <CourseFilters 
                difficulties={difficulties} 
                setDifficulties={setDifficulties} 
                selectedTools={selectedTools} 
                setSelectedTools={setSelectedTools} 
                selectedCategories={selectedCategories} 
                setSelectedCategories={setSelectedCategories} 
                clearAllFilters={clearAllFilters} 
              />
            </div>

            {/* Main content */}
            <div className="md:col-span-9">
              <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CourseSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <CourseSort onSortChange={handleSortChange} />
              </div>
              
              {/* Filter Tags */}
              <FilterTags activeFilters={getActiveFilters()} />

              <CourseGrid courses={courses} coursesData={coursesData} clearAllFilters={clearAllFilters} />
            </div>
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default Courses;
