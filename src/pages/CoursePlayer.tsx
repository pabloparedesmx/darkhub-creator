import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight, Play, Lock, Check, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import NewsletterSubscribe from '@/components/ui/NewsletterSubscribe';
import ElevenLabsWidget from '@/components/course/ElevenLabsWidget';

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  content: string | null;
  course_id: string;
  duration?: string;
  completed?: boolean;
  free?: boolean;
}

interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

const CoursePlayer = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<Record<string, boolean>>({});
  
  // Fetch course and lessons
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!slug) return;
      
      setIsLoading(true);
      try {
        // Fetch course details
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('slug', slug)
          .single();
        
        if (courseError) throw courseError;
        
        if (!courseData) {
          navigate('/not-found');
          return;
        }
        
        setCourse(courseData);
        
        // Fetch lessons for this course
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('lessons')
          .select('*')
          .eq('course_id', courseData.id)
          .order('order_index');
        
        if (lessonsError) throw lessonsError;
        
        // If user is logged in, fetch their progress
        let userProgressData: Record<string, boolean> = {};
        
        if (user) {
          const { data: progressData, error: progressError } = await supabase
            .from('progress')
            .select('*')
            .eq('user_id', user.id)
            .in('lesson_id', lessonsData.map(lesson => lesson.id));
          
          if (!progressError && progressData) {
            progressData.forEach(item => {
              userProgressData[item.lesson_id] = item.completed;
            });
          }
        }
        
        setUserProgress(userProgressData);
        
        // Group lessons into mock modules for UI
        // In a real app, you'd have a proper module table
        // For now, we'll create mock modules
        const groupedLessons: Module[] = [
          {
            id: 1,
            title: 'Getting Started',
            lessons: lessonsData.filter((_, index) => index < 3).map(lesson => ({
              ...lesson,
              duration: '10:00', // Mock duration
              completed: userProgressData[lesson.id] || false,
              free: true // Make first few lessons free
            }))
          },
          {
            id: 2,
            title: 'Core Concepts',
            lessons: lessonsData.filter((_, index) => index >= 3 && index < 6).map(lesson => ({
              ...lesson,
              duration: '15:00', // Mock duration
              completed: userProgressData[lesson.id] || false,
              free: false
            }))
          },
          {
            id: 3,
            title: 'Advanced Topics',
            lessons: lessonsData.filter((_, index) => index >= 6).map(lesson => ({
              ...lesson,
              duration: '20:00', // Mock duration
              completed: userProgressData[lesson.id] || false,
              free: false
            }))
          }
        ];
        
        setModules(groupedLessons);
        
        // Set the first lesson as active if none is set
        if (!activeLesson && lessonsData.length > 0) {
          setActiveLesson(lessonsData[0].id);
        }
        
        // Calculate progress
        if (user && lessonsData.length > 0) {
          const completedCount = Object.values(userProgressData).filter(Boolean).length;
          const totalLessons = lessonsData.length;
          setProgress(Math.round((completedCount / totalLessons) * 100));
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
    
    fetchCourseData();
  }, [slug, user, navigate, toast]);
  
  // Get total lessons and completed lessons
  const totalLessons = modules.reduce((total, module) => total + module.lessons.length, 0);
  const completedLessons = Object.values(userProgress).filter(Boolean).length;
  
  // Get current lesson
  const currentLesson = modules
    .flatMap(module => module.lessons)
    .find(lesson => lesson.id === activeLesson);
    
  // Check if user can access this lesson
  const canAccessLesson = currentLesson?.free || user?.subscription === 'pro' || (course?.is_free && user);
  
  // Mark lesson as complete
  const markAsComplete = async () => {
    if (!user || !activeLesson) return;
    
    try {
      // Check if progress entry exists
      const { data: existingProgress, error: checkError } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', activeLesson)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingProgress) {
        // Update existing progress
        const { error: updateError } = await supabase
          .from('progress')
          .update({
            completed: true,
            completed_at: new Date().toISOString()
          })
          .eq('id', existingProgress.id);
        
        if (updateError) throw updateError;
      } else {
        // Insert new progress
        const { error: insertError } = await supabase
          .from('progress')
          .insert({
            user_id: user.id,
            lesson_id: activeLesson,
            completed: true,
            completed_at: new Date().toISOString()
          });
        
        if (insertError) throw insertError;
      }
      
      // Update local state
      setUserProgress({
        ...userProgress,
        [activeLesson]: true
      });
      
      // Recalculate progress
      const newCompletedCount = Object.values({...userProgress, [activeLesson]: true}).filter(Boolean).length;
      setProgress(Math.round((newCompletedCount / totalLessons) * 100));
      
      toast({
        title: "Progress updated",
        description: "Lesson marked as complete",
      });
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive",
      });
    }
  };
  
  // Navigate to next/previous lesson
  const navigateLesson = (direction: 'prev' | 'next') => {
    const allLessons = modules.flatMap(module => module.lessons);
    const currentIndex = allLessons.findIndex(lesson => lesson.id === activeLesson);
    
    if (direction === 'next' && currentIndex < allLessons.length - 1) {
      setActiveLesson(allLessons[currentIndex + 1].id);
    } else if (direction === 'prev' && currentIndex > 0) {
      setActiveLesson(allLessons[currentIndex - 1].id);
    }
  };
  
  // Simulate video playback
  useEffect(() => {
    let timer: number;
    
    if (isPlaying && canAccessLesson) {
      timer = window.setInterval(() => {
        setCurrentTime(prev => {
          // Assuming lesson is 5 minutes long (300 seconds)
          if (prev < 300) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, canAccessLesson]);
  
  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Add ElevenLabs widget */}
      <ElevenLabsWidget />
      
      {/* Header */}
      <header className="bg-background border-b border-border py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link to={`/courses/${slug}`} className="text-muted-foreground hover:text-foreground flex items-center">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to course
            </Link>
          </div>
          
          <div className="flex-1 mx-4">
            <div className="max-w-xl mx-auto">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>{completedLessons} of {totalLessons} lessons completed</span>
                <span>{progress}% complete</span>
              </div>
            </div>
          </div>
          
          <div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={markAsComplete}
              disabled={!user || !currentLesson || userProgress[currentLesson.id]}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {userProgress[currentLesson?.id || ''] ? 'Completed' : 'Mark complete'}
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex flex-col md:flex-row flex-grow">
        {/* Sidebar */}
        <aside className="w-full md:w-80 border-r border-border bg-secondary/10 shrink-0">
          <div className="p-4 border-b border-border">
            <h2 className="font-bold text-lg">Course Content</h2>
          </div>
          
          <ScrollArea className="h-[calc(100vh-10rem)]">
            <div className="p-4">
              {modules.map(module => (
                <div key={module.id} className="mb-6">
                  <h3 className="font-semibold mb-2 text-lg">{module.title}</h3>
                  <div className="space-y-1">
                    {module.lessons.map(lesson => (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson.id)}
                        className={`w-full text-left p-2 rounded-md flex items-center ${
                          activeLesson === lesson.id 
                            ? 'bg-primary/10 text-primary' 
                            : 'hover:bg-secondary/50'
                        }`}
                      >
                        <div className="flex-shrink-0 w-5 h-5 mr-2">
                          {userProgress[lesson.id] ? (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          ) : lesson.free || course?.is_free || user?.subscription === 'pro' ? (
                            <Play className="h-5 w-5" />
                          ) : (
                            <Lock className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${!lesson.free && !course?.is_free && user?.subscription !== 'pro' ? 'text-muted-foreground' : ''}`}>
                              {lesson.title}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {lesson.duration}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </aside>
        
        {/* Video player and content */}
        <main className="flex-grow p-6">
          <div className="max-w-4xl mx-auto">
            {canAccessLesson ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Video player mockup */}
                <div className="bg-black aspect-video rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-16 w-16 rounded-full bg-primary/20 hover:bg-primary/30 text-white"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" />
                          <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" />
                        </svg>
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
                        </svg>
                      )}
                    </Button>
                  </div>
                  
                  {/* Video controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex items-center text-white">
                      <span className="text-sm mr-2">{formatTime(currentTime)}</span>
                      <div className="flex-grow h-1 bg-white/30 rounded-full">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${(currentTime / 300) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm ml-2">05:00</span>
                    </div>
                  </div>
                </div>
                
                {/* Lesson content */}
                <h1 className="text-2xl font-bold mb-4">
                  {currentLesson?.title || 'Lesson Title'}
                </h1>
                
                <div className="prose dark:prose-invert max-w-none">
                  <p>
                    {currentLesson?.description || 'This is the content for this lesson. In a real application, this would contain detailed information, code examples, images, and other learning materials related to the current lesson topic.'}
                  </p>
                  
                  <h2>Learning Objectives</h2>
                  <ul>
                    <li>Understand the key concepts of this topic</li>
                    <li>Learn how to implement the techniques covered</li>
                    <li>Practice with the provided examples</li>
                    <li>Apply knowledge to your own projects</li>
                  </ul>
                  
                  <div dangerouslySetInnerHTML={{ __html: currentLesson?.content || '' }} />
                  
                  <p>
                    Continue exploring the content and make sure to complete the exercises at the end of this lesson
                    to reinforce your understanding.
                  </p>
                </div>
                
                {/* Newsletter signup */}
                <div className="my-8">
                  <NewsletterSubscribe courseTitle={course?.title} />
                </div>
                
                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-4 border-t border-border">
                  <Button 
                    variant="outline" 
                    onClick={() => navigateLesson('prev')}
                    disabled={modules[0]?.lessons[0]?.id === activeLesson}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous Lesson
                  </Button>
                  
                  <Button 
                    onClick={() => navigateLesson('next')}
                    disabled={modules[modules.length - 1]?.lessons[modules[modules.length - 1]?.lessons.length - 1]?.id === activeLesson}
                  >
                    Next Lesson
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Lock className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold mb-2">Premium Content</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  This lesson is available exclusively to Pro subscribers. Upgrade your account to access all content.
                </p>
                <Button>Upgrade to Pro</Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoursePlayer;
