
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import CategoryBadge from './CategoryBadge';
import { motion } from 'framer-motion';

export type Course = {
  id: string;
  title: string;
  description: string;
  badges: Array<'tutorial' | 'pro' | 'free'>;
  slug: string;
  icon?: string;
  toolName?: string;
};

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link to={`/courses/${course.slug}`}>
      <Card 
        className="h-full overflow-hidden transition-all duration-300 bg-secondary/30 hover:bg-secondary/50 border-border hover:border-border/80 backdrop-blur-sm"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-5">
          <div className="flex flex-col h-full">
            <div className="flex items-start justify-between mb-3">
              <div className="flex space-x-1.5">
                {course.badges.map((badge, index) => (
                  <CategoryBadge key={index} type={badge} />
                ))}
              </div>
              
              {course.icon && (
                <div className="flex items-center justify-center w-8 h-8 bg-background rounded-md border border-border">
                  <span className="text-sm">{course.icon}</span>
                </div>
              )}
            </div>
            
            <motion.h3 
              className="text-lg font-semibold mb-2 text-foreground"
              animate={{ 
                color: isHovered ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'
              }}
              transition={{ duration: 0.2 }}
            >
              {course.title}
            </motion.h3>
            
            <p className="text-sm text-muted-foreground mb-4 flex-grow">
              {course.description}
            </p>
            
            {course.toolName && (
              <div className="text-xs text-muted-foreground/80 pt-3 border-t border-border">
                {course.toolName}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CourseCard;
