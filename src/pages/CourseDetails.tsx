
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
import SummarizeWithGPT from '@/components/course/SummarizeWithGPT';
import CourseTools from '@/components/course/CourseTools';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import { Badge } from '@/components/ui/badge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import SEO from '@/components/ui/SEO';

interface CourseDetailData extends Omit<DbCourse, 'badges'> {
  badges: Array<'tutorial' | 'pro' | 'free'>;
}

const CourseDetails = () => {
  const { slug } = useParams<{ slug: string; }>();
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
        const {
          data,
          error
        } = await supabase.from('courses').select('*, categories(name)').eq('slug', slug).single();
        if (error) {
          throw error;
        }
        if (!data) {
          navigate('/courses');
          toast({
            title: "Curso no encontrado",
            description: "El curso que estás buscando no existe",
            variant: "destructive"
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
          toolName: data.categories ? (data.categories as any).name : undefined
        };
        setCourse(courseData);
      } catch (error) {
        console.error('Error fetching course:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los detalles del curso",
          variant: "destructive"
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

  // Generate a short description for SEO
  const seoDescription = course.short_description || 
    `Aprende sobre ${course.title}. ${course.difficulty === 'beginner' ? 'Curso para principiantes' : 
    course.difficulty === 'intermediate' ? 'Nivel intermedio' : 'Nivel avanzado'}.`;

  return (
    <motion.div initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                transition={{ duration: 0.5 }} 
                className="min-h-screen flex flex-col">
      {/* Add SEO component with dynamic course data */}
      <SEO
        title={`${course.title} | AI Makers Tutoriales`}
        description={seoDescription}
        type="article"
      />
      
      <Navbar />
      <main className="flex-grow pt-24 pb-20 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main content area - 2/3 width on desktop */}
            <div className="w-full lg:w-2/3">
              {/* Course Header with title, breadcrumbs, and description */}
              <CourseHeader course={course} />
              
              {/* Course Tags Section - MOVED BELOW the image and content */}
              <div className="mb-10 space-y-6 border-t border-b py-6 border-gray-100">
                {/* Tool & Category Tags */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">Etiquetas</div>
                  <div className="flex flex-wrap gap-2">
                    {course.toolName && (
                      <Badge variant="outline" className="border-blue-500/30">
                        Contenido
                      </Badge>
                    )}
                    {course.badges && course.badges.map(badge => (
                      <CategoryBadge key={badge} type={badge} />
                    ))}
                  </div>
                </div>
                
                {/* Level Badge */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">Nivel</div>
                  <div className="flex">
                    <Badge variant="outline" className="border-blue-500/30 bg-secondary/20">
                      {course.difficulty === 'beginner' ? 'Principiante' : 
                       course.difficulty === 'intermediate' ? 'Intermedio' : 
                       course.difficulty === 'advanced' ? 'Avanzado' : 'Principiante'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Course Tools Section */}
              <CourseTools courseId={course.id} />
            </div>
            
            {/* Right sidebar CTA - 1/3 width on desktop */}
            <div className="w-full lg:w-1/3">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* GPT Summarization Widget */}
                <SummarizeWithGPT 
                  courseTitle={course.title} 
                  courseContent={course.description} 
                />
                
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
