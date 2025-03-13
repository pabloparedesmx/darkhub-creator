
import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CourseCard, { Course } from '@/components/ui/CourseCard';
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const FeaturedCourses = () => {
  const containerRef = useRef(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Fetch up to 5 featured courses
        const { data, error } = await supabase
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
            categories(name)
          `)
          .limit(5);
        
        if (error) throw error;
        
        // Transform data to match Course interface
        const transformedCourses: Course[] = data.map(course => {
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
            // Fix: Access the first item's name in the categories array, if it exists
            toolName: course.categories && course.categories[0] ? course.categories[0].name : undefined
          };
        });
        
        setCourses(transformedCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast({
          title: "Error",
          description: "Failed to load featured courses",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourses();
  }, [toast]);

  return (
    <section className="py-20 px-4" ref={containerRef}>
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Most popular courses
          </h2>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No courses found. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCourses;
