
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, CheckCircle, Share2, Bookmark, Copy, Twitter, Facebook, Linkedin } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CategoryBadge from '@/components/ui/CategoryBadge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { DbCourse } from '@/types/admin';

interface CourseContent {
  introduction: string;
  about: string;
  context: string;
  learningObjectives: string[];
  requirements: string[];
}

interface CourseDetailData extends Omit<DbCourse, 'badges'> {
  badges: Array<'tutorial' | 'pro' | 'free'>;
  content?: CourseContent;
  tags?: string[];
  tools?: string[];
  level?: string;
}

const CourseDetails = () => {
  const { slug } = useParams<{slug: string}>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [course, setCourse] = useState<CourseDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState<'not-started' | 'in-progress' | 'completed'>('not-started');
  
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
        
        // For now, we'll create some mock content for the course
        // In a real application, you would have this stored in the database as well
        const courseData: CourseDetailData = {
          ...data,
          badges,
          description,
          toolName: data.categories ? (data.categories as any).name : undefined,
          content: {
            introduction: 'Grok 3\'s release came with DeepSearch mode, a tool that dives deep into a wide range of sources to produce detailed research for you.',
            about: 'Grok is built by X/Twitter, and while other AI companies have released similar tools, Grok has one unique advantage: access to the entire archive of tweets.',
            context: 'As you may know, X is a place where people go to discuss, complain and brainstorm—and you can now tap directly into that for your research.',
            learningObjectives: [
              'Come up with a research subject and prompt',
              'Get Grok to do deep research on X posts/tweets',
              'Review the output report',
              'Get Grok to distill its research'
            ],
            requirements: ['Grok account (with the free plan, you only get a small number of DeepSearch messages per day)'],
          },
          tags: ['Research', 'Product'],
          tools: ['Grok'],
          level: 'Beginner'
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Course link has been copied to clipboard",
      duration: 3000,
    });
  };

  const saveToBookmarks = () => {
    toast({
      title: "Saved",
      description: "Course has been added to your bookmarks",
      duration: 3000,
    });
  };

  const markAsComplete = () => {
    setProgress('completed');
    toast({
      title: "Marked as complete",
      description: "Course has been marked as completed",
      duration: 3000,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex-col">
        <Navbar />
        <div className="flex justify-center items-center flex-grow py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex-col">
        <Navbar />
        <div className="flex justify-center items-center flex-grow py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
            <p className="mb-6">The course you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/courses">Back to Courses</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col"
    >
      <Navbar />
      <main className="flex-grow pt-6 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Breadcrumb */}
          <div className="py-4 mb-2">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/courses" className="flex items-center gap-1 text-muted-foreground">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M5 12L11 6M5 12L11 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Catalog
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>{course.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main content column */}
            <div className="flex-1">
              {/* Course title and description */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.title}</h1>
                <p className="text-lg text-muted-foreground mb-6">
                  {course.content?.introduction || 'Learn how to use this powerful tool effectively.'}
                </p>
                
                {/* Categories */}
                <div className="flex flex-wrap gap-4 mb-8">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {course.tags?.map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary/50 text-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Tools</h3>
                    <div className="flex flex-wrap gap-2">
                      {course.tools?.map((tool, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary/50 text-foreground">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Level</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary/50 text-foreground">
                        {course.level}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course content */}
              {course.content && (
                <div className="space-y-8 mb-8">
                  {/* About section */}
                  <div>
                    <a href="#" className="text-primary hover:underline mb-1 inline-flex items-center">
                      {course.toolName || "Grok"} <span className="ml-1">&rarr;</span>
                    </a>
                    <p className="mb-4">{course.content.about}</p>
                    <p className="mb-6">{course.content.context}</p>
                  </div>
                  
                  {/* Learning objectives */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">In this tutorial you will learn how to:</h3>
                    <ul className="space-y-3 list-disc pl-5">
                      {course.content.learningObjectives.map((item, index) => (
                        <li key={index} className="pl-1">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Requirements */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">You'll need:</h3>
                    <ul className="space-y-3 list-disc pl-5">
                      {course.content.requirements.map((item, index) => (
                        <li key={index} className="pl-1">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Video player or premium content */}
              <div className="bg-secondary/10 border border-border rounded-lg aspect-video flex items-center justify-center mb-8">
                <div className="text-center p-8">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.1378 10.5689L9.60498 6.30252C8.40816 5.52105 6.75 6.3764 6.75 7.83361V16.1664C6.75 17.6236 8.40816 18.479 9.60498 17.6975L16.1378 13.4311C17.2527 12.6962 17.2527 11.3038 16.1378 10.5689Z" fill="currentColor" />
                    </svg>
                  </div>
                  <p className="text-muted-foreground">Premium content available with a Pro subscription</p>
                  <Button variant="default" size="sm" className="mt-4">
                    Upgrade to Pro
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-72 space-y-6">
              {/* Progress indicator */}
              <div className="bg-secondary/20 rounded-lg p-6 border border-border">
                <div className="flex items-center gap-2 mb-6">
                  <span className={`inline-block w-3 h-3 rounded-full ${
                    progress === 'completed' ? 'bg-green-500' : 
                    progress === 'in-progress' ? 'bg-primary' : 'bg-muted'
                  }`}></span>
                  <span className="text-sm">
                    {progress === 'completed' ? 'Completed' : 
                     progress === 'in-progress' ? 'In Progress' : 'Not Started'}
                  </span>
                </div>

                {/* Action buttons */}
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={saveToBookmarks}
                  >
                    <Bookmark className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={markAsComplete}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as complete
                  </Button>
                </div>
              </div>

              {/* Share section */}
              <div className="bg-secondary/20 rounded-lg p-6 border border-border">
                <h3 className="text-lg font-medium mb-4">Share with a friend</h3>
                <Button 
                  variant="outline" 
                  className="w-full mb-4 justify-center"
                  onClick={copyToClipboard}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy to clipboard
                </Button>

                <div className="flex justify-center space-x-4">
                  <Button variant="outline" size="icon" className="rounded-full" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`, '_blank')}>
                    <Twitter className="h-5 w-5" />
                  </Button>
                  
                  <Button variant="outline" size="icon" className="rounded-full" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}>
                    <Facebook className="h-5 w-5" />
                  </Button>
                  
                  <Button variant="outline" size="icon" className="rounded-full" onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}>
                    <Linkedin className="h-5 w-5" />
                  </Button>
                </div>
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
