
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight, Play, Lock, Check, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Mock course content
const mockCourseModules = [
  {
    id: 1,
    title: 'Getting Started',
    lessons: [
      { id: 1, title: 'Introduction', duration: '5:20', completed: true, free: true },
      { id: 2, title: 'Setting Up Your Environment', duration: '8:45', completed: true, free: true },
      { id: 3, title: 'Understanding the Basics', duration: '12:30', completed: false, free: true }
    ]
  },
  {
    id: 2,
    title: 'Core Concepts',
    lessons: [
      { id: 4, title: 'Key Features Overview', duration: '10:15', completed: false, free: false },
      { id: 5, title: 'Working with Data', duration: '15:00', completed: false, free: false },
      { id: 6, title: 'Advanced Techniques', duration: '18:20', completed: false, free: false }
    ]
  },
  {
    id: 3,
    title: 'Practical Examples',
    lessons: [
      { id: 7, title: 'Building Your First Project', duration: '20:10', completed: false, free: false },
      { id: 8, title: 'Troubleshooting Common Issues', duration: '14:30', completed: false, free: false },
      { id: 9, title: 'Best Practices', duration: '16:45', completed: false, free: false }
    ]
  }
];

const CoursePlayer = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState(1);
  const [activeLesson, setActiveLesson] = useState(1);
  const [progress, setProgress] = useState(15); // Mock progress percentage
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Calculate total lessons and completed lessons
  const totalLessons = mockCourseModules.reduce((total, module) => total + module.lessons.length, 0);
  const completedLessons = mockCourseModules.reduce((total, module) => 
    total + module.lessons.filter(lesson => lesson.completed).length, 0);
  
  // Check if user can access this lesson
  const currentLesson = mockCourseModules
    .flatMap(module => module.lessons)
    .find(lesson => lesson.id === activeLesson);
    
  const canAccessLesson = currentLesson?.free || user?.subscription === 'pro';
  
  // Mock function to handle marking lesson as complete
  const markAsComplete = () => {
    // In a real app this would update the backend
    toast({
      title: "Progress updated",
      description: "Lesson marked as complete",
    });
    
    // Update local state to show completion
    setProgress(Math.min(progress + (100 / totalLessons), 100));
  };
  
  // Mock function to navigate to next/previous lesson
  const navigateLesson = (direction: 'prev' | 'next') => {
    const allLessons = mockCourseModules.flatMap(module => module.lessons);
    const currentIndex = allLessons.findIndex(lesson => lesson.id === activeLesson);
    
    if (direction === 'next' && currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      setActiveLesson(nextLesson.id);
      
      // Find which module this lesson belongs to
      const moduleForLesson = mockCourseModules.find(module => 
        module.lessons.some(lesson => lesson.id === nextLesson.id)
      );
      if (moduleForLesson) {
        setActiveModule(moduleForLesson.id);
      }
    } else if (direction === 'prev' && currentIndex > 0) {
      const prevLesson = allLessons[currentIndex - 1];
      setActiveLesson(prevLesson.id);
      
      // Find which module this lesson belongs to
      const moduleForLesson = mockCourseModules.find(module => 
        module.lessons.some(lesson => lesson.id === prevLesson.id)
      );
      if (moduleForLesson) {
        setActiveModule(moduleForLesson.id);
      }
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

  return (
    <div className="flex flex-col min-h-screen bg-background">
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
            <Button variant="outline" size="sm">
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark complete
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
              {mockCourseModules.map(module => (
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
                          {lesson.completed ? (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          ) : lesson.free || user?.subscription === 'pro' ? (
                            <Play className="h-5 w-5" />
                          ) : (
                            <Lock className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${!lesson.free && user?.subscription !== 'pro' ? 'text-muted-foreground' : ''}`}>
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
                    This is the content for this lesson. In a real application, this would contain detailed information,
                    code examples, images, and other learning materials related to the current lesson topic.
                  </p>
                  
                  <h2>Learning Objectives</h2>
                  <ul>
                    <li>Understand the key concepts of this topic</li>
                    <li>Learn how to implement the techniques covered</li>
                    <li>Practice with the provided examples</li>
                    <li>Apply knowledge to your own projects</li>
                  </ul>
                  
                  <p>
                    Continue exploring the content and make sure to complete the exercises at the end of this lesson
                    to reinforce your understanding.
                  </p>
                </div>
                
                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-4 border-t border-border">
                  <Button 
                    variant="outline" 
                    onClick={() => navigateLesson('prev')}
                    disabled={activeLesson === 1}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous Lesson
                  </Button>
                  
                  <Button 
                    onClick={() => navigateLesson('next')}
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
