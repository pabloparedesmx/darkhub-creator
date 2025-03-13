
import { useRef } from 'react';
import { motion } from 'framer-motion';
import CourseCard, { Course } from '@/components/ui/CourseCard';

const featuredCourses: Course[] = [
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
  }
];

const FeaturedCourses = () => {
  const containerRef = useRef(null);

  return (
    <section className="py-20 px-4" ref={containerRef}>
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Most popular courses
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {featuredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
