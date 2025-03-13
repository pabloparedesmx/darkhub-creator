
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Course } from '@/components/ui/CourseCard';
import CourseFilters from '@/components/courses/CourseFilters';
import CourseSearch from '@/components/courses/CourseSearch';
import CourseSort from '@/components/courses/CourseSort';
import CourseGrid from '@/components/courses/CourseGrid';
import { useCourseFilters } from '@/hooks/useCourseFilters';

// Mock course data
const coursesData: Course[] = [
  {
    id: '1',
    title: 'Use Grok 3 DeepSearch to do product research on X',
    description: 'How to use Grok 3\'s DeepSearch more to do detailed product research quickly.',
    badges: ['tutorial', 'pro'],
    slug: 'grok-3-deepsearch-product-research',
    icon: '🔍',
    toolName: 'Grok'
  },
  {
    id: '2',
    title: 'Build a simple to-do list app using Bolt',
    description: 'A walkthrough building in Bolt—perfect if you\'re just starting out creating apps using AI.',
    badges: ['tutorial', 'free'],
    slug: 'build-todo-app-bolt',
    icon: '📝',
    toolName: 'Bolt'
  },
  {
    id: '3',
    title: 'Build an app with AI coding tool Bolt',
    description: 'A walkthrough on how to build a waitlist signup web app with login functionality using Bolt.',
    badges: ['tutorial', 'pro'],
    slug: 'build-app-ai-coding-bolt',
    icon: '🤖',
    toolName: 'Bolt'
  },
  {
    id: '4',
    title: 'Upscale images for better resolution',
    description: 'Learn how to upscale images using Topaz Lab\'s Gigapixel.',
    badges: ['tutorial', 'pro'],
    slug: 'upscale-images-better-resolution',
    icon: '🖼️',
    toolName: 'Topaz Lab'
  },
  {
    id: '5',
    title: 'Build an app with AI coding tool Create',
    description: 'A walkthrough on how to build an app using Create',
    badges: ['tutorial', 'pro'],
    slug: 'build-app-ai-coding-create',
    icon: '🧠',
    toolName: 'Create'
  },
  {
    id: '6',
    title: 'Monitoring and improving the sales pipeline',
    description: 'Monitor your sales performance and engagement data to create insightful reports using Claude.',
    badges: ['tutorial', 'pro'],
    slug: 'monitoring-sales-pipeline',
    icon: '📊',
    toolName: 'Claude'
  },
  {
    id: '7',
    title: 'Google Gemini for data analysis',
    description: 'Learn how to use Google Gemini to analyze complex datasets quickly and effectively.',
    badges: ['tutorial', 'free'],
    slug: 'google-gemini-data-analysis',
    icon: '🔎',
    toolName: 'Google Gemini'
  },
  {
    id: '8',
    title: 'Microsoft Copilot for content creation',
    description: 'Accelerate your writing process using Microsoft Copilot to draft, edit, and refine various content formats.',
    badges: ['tutorial', 'pro'],
    slug: 'microsoft-copilot-content-creation',
    icon: '✍️',
    toolName: 'Microsoft Copilot'
  }
];

const Courses = () => {
  const {
    searchTerm,
    setSearchTerm,
    courses,
    filters,
    setFilters,
    categories,
    setCategories,
    difficulties,
    setDifficulties,
    clearAllFilters,
    setSortOrder
  } = useCourseFilters(coursesData);

  const handleSortChange = (value: string) => {
    setSortOrder(value);
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Browse all courses & tutorials</h1>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters sidebar */}
            <CourseFilters 
              filters={filters}
              setFilters={setFilters}
              categories={categories}
              setCategories={setCategories}
              difficulties={difficulties}
              setDifficulties={setDifficulties}
              clearAllFilters={clearAllFilters}
            />

            {/* Main content */}
            <div className="flex-1">
              <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CourseSearch 
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
                <CourseSort onSortChange={handleSortChange} />
              </div>

              <CourseGrid 
                courses={courses}
                coursesData={coursesData}
                clearAllFilters={clearAllFilters}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default Courses;
