
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { supabase } from "@/lib/supabase";
import { DbCourse } from '@/types/admin';
import { useToast } from "@/hooks/use-toast";
import CourseHeader from '@/components/course/CourseHeader';
import CourseSharePanel from '@/components/course/CourseSharePanel';
import CourseTools from '@/components/course/CourseTools';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';

interface CourseDetailData extends Omit<DbCourse, 'badges'> {
  badges: Array<'tutorial' | 'pro' | 'free'>;
}

const CourseDetails = () => {
  const { slug } = useParams<{slug: string}>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [course, setCourse] = useState<CourseDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch course data from Supabase
  useEffect(() => {
    const fetchCourse = async () => {
      if (!slug) return;
      
      try {
        setIsLoading(true);
        
        // Fetch course by slug
        const { data, error } = await supabase
          .from('courses')
          .select('*, categories(name)')
          .eq('slug', slug)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (!data) {
          navigate('/courses');
          toast({
            title: "Course not found",
            description: "The course you're looking for doesn't exist",
            variant: "destructive",
          });
          return;
        }
        
        // Create the badges array
        const badges: Array<'tutorial' | 'pro' | 'free'> = [];
        if (data.is_pro) badges.push('pro');
        if (data.is_free) badges.push('free');
        if (data.is_tutorial) badges.push('tutorial');
        
        // Parse description for any HTML content
        const description = data.description || '';
        
        const courseData: CourseDetailData = {
          ...data,
          badges,
          description,
          toolName: data.categories ? (data.categories as any).name : undefined,
        };
        
        setCourse(courseData);
      } catch (error) {
        console.error('Error fetching course:', error);
        toast({
          title: "Error",
          description: "Could not load course details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourse();
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [slug, navigate, toast]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!course) {
    return <ErrorState title="Course Not Found" message="The course you're looking for doesn't exist or has been removed." />;
  }

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
          <div className="max-w-4xl mx-auto">
            {/* Course Header with title, breadcrumbs, and description */}
            <CourseHeader course={course} />
            
            {/* Course Tools Section */}
            <CourseTools courseId={course.id} />
          </div>

          {/* Right side panel for sharing - Added mt-12 to increase vertical spacing */}
          <div className="max-w-4xl mx-auto mt-12">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <CourseSharePanel courseTitle={course.title} />
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default CourseDetails;
