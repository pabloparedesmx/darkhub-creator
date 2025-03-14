
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
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Bookmark, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CategoryBadge from '@/components/ui/CategoryBadge';

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
            title: "Curso no encontrado",
            description: "El curso que estás buscando no existe",
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
          description: "No se pudieron cargar los detalles del curso",
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
    return <ErrorState title="Curso No Encontrado" message="El curso que estás buscando no existe o ha sido eliminado." />;
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
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main content area - 2/3 width on desktop */}
            <div className="w-full lg:w-2/3">
              {/* Course Tags Section */}
              <div className="mb-4 space-y-4">
                {/* Tool & Category Tags */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {course.toolName && (
                      <Badge variant="filter" className="border-blue-500/30">
                        {course.toolName}
                      </Badge>
                    )}
                    {course.badges && course.badges.map((badge) => (
                      <CategoryBadge key={badge} type={badge} />
                    ))}
                  </div>
                </div>
                
                {/* Level Badge */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Level</div>
                  <div className="flex">
                    <Badge variant="outline" className="border-blue-500/30 bg-secondary/20">
                      {course.difficulty || 'Beginner'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Course Header with title, breadcrumbs, and description */}
              <CourseHeader course={course} />
              
              {/* Course Tools Section */}
              <CourseTools courseId={course.id} />
            </div>
            
            {/* Right sidebar CTA - 1/3 width on desktop */}
            <div className="w-full lg:w-1/3">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Progress Indicator */}
                <div className="bg-card rounded-lg border dark:border-blue-500/20 p-6 shadow-sm dark:shadow-blue-500/5">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm text-muted-foreground flex items-center">
                      <span className="inline-block w-2 h-2 bg-primary rounded-full mr-2"></span>
                      In Progress
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-secondary/50 rounded-full h-2 mb-6">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button variant="default" className="w-full justify-center" onClick={() => {}}>
                      <Save className="mr-2 h-4 w-4" /> Save
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-center" onClick={() => {}}>
                      <CheckCircle className="mr-2 h-4 w-4" /> Mark as complete
                    </Button>
                  </div>
                </div>
                
                {/* Share Panel */}
                <CourseSharePanel courseTitle={course.title} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default CourseDetails;
