
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, BookOpen, CheckCircle, Clock, Users, ArrowLeft } from 'lucide-react';
import CategoryBadge from '@/components/ui/CategoryBadge';
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

interface Course {
  id: string;
  title: string;
  description: string;
  badges: Array<'tutorial' | 'pro' | 'free'>;
  slug: string;
  icon?: string;
  category?: {
    name: string;
  };
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  content: string | null;
}

const CourseDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      
      try {
        // Fetch course by slug
        const { data: courseData, error: courseError } = await supabase
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
          .eq('slug', slug)
          .single();
        
        if (courseError) throw courseError;
        
        // Fetch lessons for this course
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('lessons')
          .select('*')
          .eq('course_id', courseData.id)
          .order('order_index', { ascending: true });
        
        if (lessonsError) throw lessonsError;
        
        // Transform data
        const badges: Array<'tutorial' | 'pro' | 'free'> = [];
        if (courseData.is_pro) badges.push('pro');
        if (courseData.is_free) badges.push('free');
        if (courseData.is_tutorial) badges.push('tutorial');
        
        setCourse({
          id: courseData.id,
          title: courseData.title,
          description: courseData.description,
          badges,
          slug: courseData.slug,
          icon: courseData.icon,
          // Fix: Handle categories as an array properly
          category: courseData.categories && courseData.categories.length > 0 ? { name: courseData.categories[0].name } : undefined,
          lessons: lessonsData || []
        });
        
        // Check if user is enrolled in this course
        if (user) {
          const { data: enrollmentData, error: enrollmentError } = await supabase
            .from('enrollments')
            .select('*')
            .eq('user_id', user.id)
            .eq('course_id', courseData.id)
            .single();
          
          if (!enrollmentError && enrollmentData) {
            setIsEnrolled(true);
          }
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        toast({
          title: "Error",
          description: "Failed to load course details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (slug) {
      fetchCourse();
    }
  }, [slug, toast, user]);

  const handleEnroll = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to enroll in this course",
        variant: "destructive",
      });
      return;
    }
    
    if (!course) return;
    
    setIsEnrolling(true);
    
    try {
      const { error } = await supabase
        .from('enrollments')
        .insert([
          {
            user_id: user.id,
            course_id: course.id,
          }
        ]);
      
      if (error) throw error;
      
      setIsEnrolled(true);
      
      toast({
        title: "Success",
        description: "You've successfully enrolled in this course",
      });
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast({
        title: "Error",
        description: "Failed to enroll in course",
        variant: "destructive",
      });
    } finally {
      setIsEnrolling(false);
    }
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
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : course ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-5xl mx-auto"
            >
              <div className="mb-6">
                <Link to="/courses" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Back to courses
                </Link>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="mb-6">
                    <div className="flex items-center mb-3">
                      {course.badges.map((badge, index) => (
                        <CategoryBadge key={index} type={badge} className="mr-2" />
                      ))}
                      {course.category && (
                        <span className="text-sm text-muted-foreground">{course.category.name}</span>
                      )}
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.title}</h1>
                    <p className="text-lg text-muted-foreground mb-6">{course.description}</p>
                    
                    <div className="flex items-center flex-wrap gap-4 text-sm text-muted-foreground mb-8">
                      <div className="flex items-center">
                        <BookOpen className="mr-1 h-4 w-4" />
                        <span>{course.lessons.length} lessons</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>Approx. {course.lessons.length * 15} mins</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4" />
                        <span>Beginner level</span>
                      </div>
                    </div>
                    
                    {isEnrolled ? (
                      <Link to={`/courses/${course.slug}/learn`}>
                        <Button className="w-full sm:w-auto">
                          Continue Learning
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    ) : (
                      <Button 
                        className="w-full sm:w-auto" 
                        onClick={handleEnroll}
                        disabled={isEnrolling}
                      >
                        {isEnrolling ? 'Enrolling...' : 'Enroll in Course'}
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="mb-12 mt-12">
                    <h2 className="text-2xl font-bold mb-6">Course Content</h2>
                    
                    {course.lessons.length === 0 ? (
                      <p className="text-muted-foreground">No lessons available yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {course.lessons.map((lesson, index) => (
                          <Card key={lesson.id} className="overflow-hidden transition-colors hover:bg-secondary/20">
                            <CardContent className="p-0">
                              <div className="flex items-center p-4">
                                <div className="flex-shrink-0 mr-4">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-foreground text-sm font-medium">
                                    {index + 1}
                                  </div>
                                </div>
                                <div className="flex-grow">
                                  <h3 className="font-medium">{lesson.title}</h3>
                                  {lesson.description && (
                                    <p className="text-sm text-muted-foreground mt-1">{lesson.description}</p>
                                  )}
                                </div>
                                {isEnrolled ? (
                                  <Link 
                                    to={`/courses/${course.slug}/learn?lesson=${lesson.id}`}
                                    className="flex-shrink-0 ml-2"
                                  >
                                    <Button variant="ghost" size="sm">
                                      <ChevronRight className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                ) : (
                                  <div className="flex-shrink-0 ml-2">
                                    <CheckCircle className="h-5 w-5 text-muted-foreground/30" />
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <Card className="sticky top-24 bg-secondary/30 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-background rounded-xl border border-border">
                        {course.icon && (
                          <span className="text-3xl">{course.icon}</span>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold text-center mb-6">{course.title}</h3>
                      
                      <div className="space-y-5 mb-6">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Lessons</span>
                          <span className="font-medium">{course.lessons.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duration</span>
                          <span className="font-medium">Approx. {course.lessons.length * 15} mins</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Level</span>
                          <span className="font-medium">Beginner</span>
                        </div>
                      </div>
                      
                      {isEnrolled ? (
                        <Link to={`/courses/${course.slug}/learn`}>
                          <Button className="w-full">
                            Continue Learning
                          </Button>
                        </Link>
                      ) : (
                        <Button 
                          className="w-full" 
                          onClick={handleEnroll}
                          disabled={isEnrolling}
                        >
                          {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
              <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist or has been removed.</p>
              <Link to="/courses">
                <Button>
                  Browse Courses
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default CourseDetails;
