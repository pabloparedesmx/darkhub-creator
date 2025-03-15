
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

export type Course = {
  id: string;
  title: string;
  description: string;
  short_description?: string;
  badges: Array<'pro' | 'free'>;  // Only 'pro' or 'free' are allowed
  slug: string;
  icon?: string;
  toolName?: string;
  toolIcon?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  toolIds?: string[]; // For filtering
  categoryId?: string; // Add category for filtering
  summary?: string; // Brief summary description
};

interface CourseCardProps {
  course: Course;
  featured?: boolean;
}

const CourseCard = ({ course, featured = false }: CourseCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Helper function to decode HTML entities
  const decodeHtmlEntities = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  };
  
  // Prioritize short_description if available and decode HTML entities
  const getRawDisplayText = () => {
    if (course.short_description) return course.short_description;
    if (course.summary) return course.summary;
    return course.description.replace(/<[^>]*>/g, '');
  };
  
  // Get and decode the display text
  const displayText = decodeHtmlEntities(getRawDisplayText());
  
  // Function to render tool icon (either as emoji or image)
  const renderToolIcon = (icon?: string) => {
    if (!icon) return null;
    
    // Check if the icon is a URL
    const isUrl = /^(https?:\/\/|www\.)|(\.(png|jpg|jpeg|svg|webp|ico)$)/i.test(icon);
    
    if (isUrl) {
      return (
        <div className="flex-shrink-0 w-6 h-6 rounded-md overflow-hidden mr-1">
          <img src={icon} alt="Herramienta" className="h-full w-full object-contain" />
        </div>
      );
    }
    
    // If not a URL, render as emoji
    return <span className="mr-1 text-lg">{icon}</span>;
  };

  // Remove "Herramienta: " prefix from toolName if it exists
  const displayToolName = course.toolName && course.toolName.startsWith('Herramienta: ') 
    ? course.toolName.replace('Herramienta: ', '')
    : course.toolName;
  
  // Translate difficulty to Spanish
  const getDifficultyInSpanish = (difficulty?: string) => {
    if (!difficulty) return "";
    
    const translations: Record<string, string> = {
      'beginner': 'Principiante',
      'intermediate': 'Intermedio',
      'advanced': 'Avanzado'
    };
    
    return translations[difficulty] || difficulty;
  };
  
  // Get difficulty badge color class
  const getDifficultyBadgeClasses = (difficulty?: string) => {
    if (!difficulty) return "";
    
    const colorClasses: Record<string, string> = {
      'beginner': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      'intermediate': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
      'advanced': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    };
    
    return colorClasses[difficulty] || 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
  };
  
  return (
    <Link to={`/courses/${course.slug}`}>
      <Card 
        className={`h-full overflow-hidden transition-all duration-300 hover:shadow-md border-border ${featured ? 'border-primary/40' : 'hover:border-primary/20'} backdrop-blur-sm dark:hover:border-cyan-500/40`}
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
                  className={`text-xs px-2 py-1 rounded-full ${
                    badge === 'pro' 
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' 
                    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                  }`}
                >
                  {badge === 'pro' ? 'Pro' : 'Gratis'}
                </span>
              ))}
              
              {course.difficulty && (
                <span 
                  className={`text-xs px-2 py-1 rounded-full ${getDifficultyBadgeClasses(course.difficulty)}`}
                >
                  {getDifficultyInSpanish(course.difficulty)}
                </span>
              )}
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
                {decodeHtmlEntities(course.title)}
              </motion.h3>
              
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {displayText}
              </p>
            </div>
            
            {/* Tool icon at the bottom */}
            <div className="px-4 py-3 border-t border-border/50 bg-muted/10 flex items-center dark:bg-[#071323]/80">
              {renderToolIcon(course.toolIcon || course.icon)}
              <span className="text-xs text-muted-foreground truncate">
                {displayToolName || course.slug}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CourseCard;
