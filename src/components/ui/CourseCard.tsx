
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';

export type Course = {
  id: string;
  title: string;
  description: string;
  badges: Array<'pro' | 'free'>;  // Only 'pro' or 'free' are allowed
  slug: string;
  icon?: string;
  toolName?: string;
  toolIcon?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  toolIds?: string[]; // For filtering
  categoryId?: string; // Add category for filtering
  summary?: string; // Brief summary description
  short_description?: string; // New field for short description
};

interface CourseCardProps {
  course: Course;
  featured?: boolean;
}

const CourseCard = ({ course, featured = false }: CourseCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Use short_description if available, otherwise fallback to cleaned description
  const plainDescription = course.description.replace(/<[^>]*>/g, '');
  const displayText = course.short_description || course.summary || plainDescription;
  
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
  
  return (
    <Link to={`/courses/${course.slug}`}>
      <Card 
        className={`h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 
                    backdrop-blur-sm ${featured ? 'border-blue-500/40' : 'hover:border-blue-500/30'} 
                    relative after:absolute after:inset-0 after:-z-10 after:bg-gradient-to-br 
                    after:from-blue-900/20 after:to-transparent after:opacity-0 hover:after:opacity-100 
                    after:transition-opacity`}
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
                      ? 'bg-purple-900/30 text-purple-300 border border-purple-500/30' 
                      : 'bg-green-900/30 text-green-300 border border-green-500/30'
                  }`}
                >
                  {badge === 'pro' ? 'Pro' : 'Gratis'}
                </span>
              ))}
            </div>
            
            {/* Course title */}
            <div className="px-4 pt-2 pb-3 flex-grow">
              <motion.h3 
                className={`text-lg font-semibold mb-2 ${isHovered ? 'text-blue-400 blue-text-glow' : 'text-blue-50'} transition-all duration-300`}
              >
                {course.title}
              </motion.h3>
              
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {displayText}
              </p>
            </div>
            
            {/* Tool icon at the bottom */}
            <div className="px-4 py-3 border-t border-blue-900/30 bg-blue-950/20 flex items-center">
              {renderToolIcon(course.toolIcon || course.icon)}
              <span className="text-xs text-blue-300 truncate">
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
