
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, Share2, Bookmark, Copy, Twitter, Facebook, Linkedin } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
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
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col"
    >
      <Navbar />
      <main className="flex-grow pt-24 pb-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/courses">Catalog</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{course.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </motion.div>

            {/* Course title and description */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              {/* Use the RichTextEditor in read-only mode to display formatted content */}
              <RichTextEditor value={course.description} onChange={() => {}} readOnly={true} />
            </motion.div>

            {/* Tags and metadata */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mb-8"
            >
              <div className="flex flex-wrap gap-4">
                {course.tags && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {course.tags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {course.tools && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Tools</h3>
                    <div className="flex flex-wrap gap-2">
                      {course.tools.map((tool, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-foreground">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {course.level && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Level</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-foreground">
                        {course.level}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Course content */}
            {course.content && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="bg-secondary/30 rounded-lg p-6 mb-8 border border-border"
              >
                <h2 className="text-xl font-semibold mb-4">Course Introduction</h2>
                <p className="mb-4">{course.content.introduction}</p>
                
                <h3 className="text-lg font-semibold mt-6 mb-2">About {course.toolName || "This Course"}</h3>
                <p className="mb-4">{course.content.about}</p>
                
                <p className="mb-6">{course.content.context}</p>
                
                <h3 className="text-lg font-semibold mb-4">In this tutorial you will learn how to:</h3>
                <ul className="space-y-2 mb-6">
                  {course.content.learningObjectives.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block mr-2 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
                
                <h3 className="text-lg font-semibold mb-4">You'll need:</h3>
                <ul className="space-y-2">
                  {course.content.requirements.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block mr-2 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                <p className="mt-6 text-muted-foreground">Let's see how it's done.</p>
              </motion.div>
            )}

            {/* Video player placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="bg-secondary/10 border border-border rounded-lg aspect-video flex items-center justify-center mb-8"
            >
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
            </motion.div>
          </div>

          {/* Right side panel */}
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="bg-secondary/20 rounded-lg p-6 border border-border"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm text-muted-foreground flex items-center">
                  <span className="inline-block w-2 h-2 bg-primary rounded-full mr-2"></span>
                  Not Started
                </span>
                <div className="flex space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={saveToBookmarks}>
                          <Bookmark className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Save</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => {}}>
                          <CheckCircle className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Mark as complete</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <h3 className="text-lg font-medium mb-4">Share with a friend</h3>
              <div className="mb-4">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center"
                  onClick={copyToClipboard}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy to clipboard
                </Button>
              </div>

              <div className="flex justify-center space-x-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="rounded-full" onClick={() => {}}>
                        <Twitter className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share on Twitter</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="rounded-full" onClick={() => {}}>
                        <Facebook className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share on Facebook</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="rounded-full" onClick={() => {}}>
                        <Linkedin className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share on LinkedIn</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default CourseDetails;
