
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import CategoryBadge from './CategoryBadge';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

export type Course = {
  id: string;
  title: string;
  description: string;
  badges: Array<'tutorial' | 'pro' | 'free'>;
  slug: string;
  icon?: string;
  toolName?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
};

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Remove HTML tags from description for clean display
  const plainDescription = course.description.replace(/<[^>]*>/g, '');
  
  return (
    <Link to={`/courses/${course.slug}`}>
      <Card 
        className="h-full overflow-hidden transition-all duration-300 hover:shadow-md border-border hover:border-primary/20 backdrop-blur-sm"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-0">
          <div className="flex flex-col h-full">
            {/* Card header with icon */}
            <div className="flex items-center p-4 bg-secondary/30 border-b border-border/50">
              <div className="flex items-center justify-center w-10 h-10 bg-background rounded-md border border-border mr-3">
                <span className="text-lg">{course.icon || '📚'}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {course.badges.map((badge, index) => (
                  <CategoryBadge key={index} type={badge} />
                ))}
                {course.difficulty && (
                  <span className={`text-xs rounded-full px-2 py-0.5 ${
                    course.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                    course.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {course.difficulty}
                  </span>
                )}
              </div>
            </div>
            
            {/* Card content */}
            <div className="p-4 flex-grow">
              <motion.h3 
                className="text-lg font-semibold mb-2"
                animate={{ 
                  color: isHovered ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'
                }}
                transition={{ duration: 0.2 }}
              >
                {course.title}
              </motion.h3>
              
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {plainDescription}
              </p>
            </div>
            
            {/* Card footer */}
            {(course.toolName || course.slug) && (
              <div className="px-4 py-3 text-xs text-muted-foreground border-t border-border/50 bg-muted/20 flex items-center">
                <BookOpen className="h-3 w-3 mr-1" />
                <span className="truncate">
                  {course.toolName ? course.toolName : `/${course.slug}`}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CourseCard;
