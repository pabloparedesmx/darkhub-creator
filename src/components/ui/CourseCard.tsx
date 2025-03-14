
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';

export type Course = {
  id: string;
  title: string;
  description: string;
  badges: Array<'tutorial'>;
  slug: string;
  icon?: string;
  toolName?: string;
  toolIcon?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  toolIds?: string[]; // Add toolIds for filtering
  summary?: string; // Brief summary description
};

interface CourseCardProps {
  course: Course;
  featured?: boolean;
}

const CourseCard = ({ course, featured = false }: CourseCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Remove HTML tags from description for clean display
  const plainDescription = course.description.replace(/<[^>]*>/g, '');
  const summary = course.summary || plainDescription;
  
  // Function to render tool icon (either as emoji or image)
  const renderToolIcon = (icon?: string) => {
    if (!icon) return null;
    
    // Check if the icon is a URL
    const isUrl = /^(https?:\/\/|www\.)|(\.(png|jpg|jpeg|svg|webp|ico)$)/i.test(icon);
    
    if (isUrl) {
      return (
        <div className="flex-shrink-0 w-6 h-6 rounded-md overflow-hidden mr-1">
          <img src={icon} alt="Tool" className="h-full w-full object-contain" />
        </div>
      );
    }
    
    // If not a URL, render as emoji
    return <span className="mr-1 text-lg">{icon}</span>;
  };
  
  return (
    <Link to={`/courses/${course.slug}`}>
      <Card 
        className={`h-full overflow-hidden transition-all duration-300 hover:shadow-md border-border ${featured ? 'border-primary/40' : 'hover:border-primary/20'} backdrop-blur-sm`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-0">
          <div className="flex flex-col h-full">
            {/* Badges at the top */}
            <div className="flex gap-2 pt-4 px-4">
              {course.badges.map((badge, index) => (
                <span 
                  key={index} 
                  className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  {badge === 'tutorial' ? 'Tutorial' : badge}
                </span>
              ))}
            </div>
            
            {/* Course title */}
            <div className="px-4 pt-2 pb-3 flex-grow">
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
                {summary}
              </p>
            </div>
            
            {/* Tool icon at the bottom */}
            <div className="px-4 py-3 border-t border-border/50 bg-muted/10 flex items-center">
              {renderToolIcon(course.toolIcon || course.icon)}
              <span className="text-xs text-muted-foreground truncate">
                {course.toolName || course.slug}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CourseCard;
