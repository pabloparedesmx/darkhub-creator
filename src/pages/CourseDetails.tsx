
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, CheckCircle, Share2, Bookmark, Copy, Twitter, Facebook, Linkedin } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CategoryBadge from '@/components/ui/CategoryBadge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { useToast } from "@/hooks/use-toast";

// Mock course detail
const courseDetail = {
  title: 'Use Grok 3 DeepSearch to do product research on X',
  description: 'How to use Grok 3\'s DeepSearch more to do detailed product research quickly.',
  badges: ['tutorial', 'pro'] as ('tutorial' | 'pro' | 'free')[],
  slug: 'grok-3-deepsearch-product-research',
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

const CourseDetails = () => {
  const { slug } = useParams<{slug: string}>();
  const { toast } = useToast();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
              <div className="flex items-center text-sm text-muted-foreground">
                <Link to="/courses" className="flex items-center hover:text-foreground transition-colors">
                  <span className="flex items-center gap-1">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 5C3 3.89543 3.89543 3 5 3H9C10.1046 3 11 3.89543 11 5V9C11 10.1046 10.1046 11 9 11H5C3.89543 11 3 10.1046 3 9V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M13 5C13 3.89543 13.8954 3 15 3H19C20.1046 3 21 3.89543 21 5V9C21 10.1046 20.1046 11 19 11H15C13.8954 11 13 10.1046 13 9V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M3 15C3 13.8954 3.89543 13 5 13H9C10.1046 13 11 13.8954 11 15V19C11 20.1046 10.1046 21 9 21H5C3.89543 21 3 20.1046 3 19V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M13 15C13 13.8954 13.8954 13 15 13H19C20.1046 13 21 13.8954 21 15V19C21 20.1046 20.1046 21 19 21H15C13.8954 21 13 20.1046 13 19V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Catalog
                  </span>
                </Link>
                <span className="mx-2 text-muted-foreground">/</span>
                <span className="text-foreground">{courseDetail.title}</span>
              </div>
            </motion.div>

            {/* Course title and description */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{courseDetail.title}</h1>
              <p className="text-lg text-muted-foreground">{courseDetail.description}</p>
            </motion.div>

            {/* Tags and metadata */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mb-8"
            >
              <div className="flex flex-wrap gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {courseDetail.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Tools</h3>
                  <div className="flex flex-wrap gap-2">
                    {courseDetail.tools.map((tool, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-foreground">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Level</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-foreground">
                      {courseDetail.level}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Course content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-secondary/30 rounded-lg p-6 mb-8 border border-border"
            >
              <h2 className="text-xl font-semibold mb-4">Grok 3's release</h2>
              <p className="mb-4">{courseDetail.content.introduction}</p>
              
              <h3 className="text-lg font-semibold mt-6 mb-2">About Grok</h3>
              <p className="mb-4">{courseDetail.content.about}</p>
              
              <p className="mb-6">{courseDetail.content.context}</p>
              
              <h3 className="text-lg font-semibold mb-4">In this tutorial you will learn how to:</h3>
              <ul className="space-y-2 mb-6">
                {courseDetail.content.learningObjectives.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block mr-2 mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
              
              <h3 className="text-lg font-semibold mb-4">You'll need:</h3>
              <ul className="space-y-2">
                {courseDetail.content.requirements.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block mr-2 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              
              <p className="mt-6 text-muted-foreground">Let's see how it's done.</p>
            </motion.div>

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
