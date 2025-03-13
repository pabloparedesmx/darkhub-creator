
import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  X, 
  Check, 
  CheckCircle2, 
  PlayCircleIcon, 
  Home
} from 'lucide-react';
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

interface Course {
  id: string;
  title: string;
  slug: string;
  icon?: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  content: string | null;
  order_index: number;
  completed?: boolean;
}

const CoursePlayer = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [lessonProgress, setLessonProgress] = useState<Record<string, boolean>>({});
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
            slug, 
            icon
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
        
        // Fetch user progress if logged in
        if (user && lessonsData && lessonsData.length > 0) {
          const { data: progressData, error: progressError } = await supabase
            .from('progress')
            .select('*')
            .eq('user_id', user.id)
            .in('lesson_id', lessonsData.map(lesson => lesson.id));
          
          if (!progressError && progressData) {
            const progressMap: Record<string, boolean> = {};
            progressData.forEach(progress => {
              progressMap[progress.lesson_id] = progress.completed;
            });
            setLessonProgress(progressMap);
          }
        }
        
        setLessons(lessonsData || []);
        setCourse({
          id: courseData.id,
          title: courseData.title,
          slug: courseData.slug,
          icon: courseData.icon,
          lessons: lessonsData || []
        });
        
        // Set current lesson either from URL or first lesson
        const lessonId = searchParams.get('lesson');
        
        if (lessonId && lessonsData) {
          const foundLesson = lessonsData.find(l => l.id === lessonId);
          if (foundLesson) {
            setCurrentLesson(foundLesson);
          } else if (lessonsData.length > 0) {
            setCurrentLesson(lessonsData[0]);
            // Update URL if lesson not found
            searchParams.set('lesson', lessonsData[0].id);
            setSearchParams(searchParams);
          }
        } else if (lessonsData && lessonsData.length > 0) {
          setCurrentLesson(lessonsData[0]);
          // Update URL with first lesson
          searchParams.set('lesson', lessonsData[0].id);
          setSearchParams(searchParams);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        toast({
          title: "Error",
          description: "Failed to load course content",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (slug) {
      fetchCourse();
    }
  }, [slug, searchParams, setSearchParams, toast, user]);

  const handleLessonClick = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    searchParams.set('lesson', lesson.id);
    setSearchParams(searchParams);
  };

  const navigateToNextLesson = () => {
    if (!currentLesson || !lessons.length) return;
    
    const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex < lessons.length - 1) {
      const nextLesson = lessons[currentIndex + 1];
      handleLessonClick(nextLesson);
    }
  };

  const navigateToPrevLesson = () => {
    if (!currentLesson || !lessons.length) return;
    
    const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex > 0) {
      const prevLesson = lessons[currentIndex - 1];
      handleLessonClick(prevLesson);
    }
  };

  const markLessonAsComplete = async () => {
    if (!user || !currentLesson) return;
    
    try {
      // Check if progress record exists
      const { data: existingProgress, error: checkError } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', currentLesson.id)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      if (existingProgress) {
        // Update existing progress
        const { error } = await supabase
          .from('progress')
          .update({
            completed: true,
            completed_at: new Date().toISOString()
          })
          .eq('id', existingProgress.id);
        
        if (error) throw error;
      } else {
        // Create new progress record
        const { error } = await supabase
          .from('progress')
          .insert([{
            user_id: user.id,
            lesson_id: currentLesson.id,
            completed: true,
            completed_at: new Date().toISOString()
          }]);
        
        if (error) throw error;
      }
      
      // Update local state
      setLessonProgress({
        ...lessonProgress,
        [currentLesson.id]: true
      });
      
      toast({
        title: "Progress saved",
        description: "Lesson marked as complete",
      });
      
      // Navigate to next lesson if available
      navigateToNextLesson();
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive",
      });
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
      <main className="flex-grow pt-16">
        <div className="flex h-[calc(100vh-64px)]">
          {/* Sidebar */}
          <div
            className={`bg-secondary/20 border-r border-border h-full overflow-y-auto transition-all ${
              sidebarOpen ? 'w-80' : 'w-0'
            } fixed md:relative z-10`}
          >
            <div className="p-4 flex items-center justify-between sticky top-0 bg-secondary/50 backdrop-blur-sm border-b border-border">
              <Link to={`/courses/${slug}`} className="flex items-center space-x-2 text-sm">
                <ChevronLeft className="h-4 w-4" />
                <span>Back to Course</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="md:hidden">
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-4">
              <h2 className="font-bold mb-2">{course?.title}</h2>
              <p className="text-sm text-muted-foreground mb-4">{lessons.length} Lessons</p>
              
              <div className="space-y-1">
                {lessons.map((lesson, index) => (
                  <Button
                    key={lesson.id}
                    variant={currentLesson?.id === lesson.id ? "secondary" : "ghost"}
                    className="w-full justify-start text-left h-auto py-2"
                    onClick={() => handleLessonClick(lesson)}
                  >
                    <div className="flex items-center w-full">
                      <div className="flex-shrink-0 mr-3">
                        {lessonProgress[lesson.id] ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-secondary text-foreground text-xs">
                            {index + 1}
                          </span>
                        )}
                      </div>
                      <span className="truncate">{lesson.title}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1 overflow-auto h-full">
            {/* Mobile header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-secondary/10 border-b border-border">
              <Button variant="outline" size="sm" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-4 w-4 mr-2" />
                Lessons
              </Button>
              <Link to="/" className="flex items-center text-sm text-muted-foreground">
                <Home className="h-4 w-4 mr-1" />
                Home
              </Link>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : currentLesson ? (
              <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8">
                  <h1 className="text-2xl font-bold mb-6">{currentLesson.title}</h1>
                  
                  <div 
                    className="prose prose-stone dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: currentLesson.content || '' }} 
                  />
                </div>
                
                <Separator className="my-8" />
                
                <div className="flex justify-between items-center">
                  <Button 
                    variant="outline" 
                    onClick={navigateToPrevLesson}
                    disabled={lessons.findIndex(l => l.id === currentLesson.id) === 0}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous Lesson
                  </Button>
                  
                  <div className="flex space-x-2">
                    {lessonProgress[currentLesson.id] ? (
                      <Button disabled variant="outline" className="text-green-500">
                        <Check className="mr-2 h-4 w-4" />
                        Completed
                      </Button>
                    ) : (
                      <Button onClick={markLessonAsComplete}>
                        <Check className="mr-2 h-4 w-4" />
                        Mark as Complete
                      </Button>
                    )}
                    
                    <Button 
                      onClick={navigateToNextLesson}
                      disabled={lessons.findIndex(l => l.id === currentLesson.id) === lessons.length - 1}
                    >
                      Next Lesson
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full px-4">
                <div className="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mb-4">
                  <PlayCircleIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-bold mb-2">No lesson selected</h2>
                <p className="text-muted-foreground mb-6 text-center">Select a lesson from the sidebar to start learning</p>
                <Button onClick={() => setSidebarOpen(true)} className="md:hidden">
                  <Menu className="mr-2 h-4 w-4" />
                  View Lessons
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </motion.div>
  );
};

export default CoursePlayer;
