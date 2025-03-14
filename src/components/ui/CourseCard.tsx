
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { supabase } from "@/lib/supabase";

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
};

interface CourseCardProps {
  course: Course;
  featured?: boolean;
}

type ToolInfo = {
  id: string;
  name: string;
  icon: string | null;
};

const CourseCard = ({ course, featured = false }: CourseCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [courseTools, setCourseTools] = useState<ToolInfo[]>([]);
  
  // Remove HTML tags from description for clean display
  const plainDescription = course.description.replace(/<[^>]*>/g, '');
  const summary = course.summary || plainDescription;
  
  // Fetch all tools associated with this course if toolIds are available
  useEffect(() => {
    const fetchCourseTools = async () => {
      if (!course.toolIds || course.toolIds.length === 0) {
        // If no tool IDs, but we have a single tool info, use that
        if (course.toolName && course.toolIcon) {
          setCourseTools([{
            id: 'default',
            name: course.toolName,
            icon: course.toolIcon
          }]);
        }
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('tools')
          .select('id, name, favicon, icon')
          .in('id', course.toolIds);
          
        if (error) throw error;
        
        setCourseTools(data.map(tool => ({
          id: tool.id,
          name: tool.name,
          icon: tool.favicon || tool.icon || null
        })));
      } catch (error) {
        console.error('Error fetching course tools:', error);
      }
    };
    
    fetchCourseTools();
  }, [course.toolIds, course.toolName, course.toolIcon]);
  
  // Function to render tool icon (either as emoji or image)
  const renderToolIcon = (icon?: string) => {
    if (!icon) return null;
    
    // Check if the icon is a URL
    const isUrl = /^(https?:\/\/|www\.)|(\.(png|jpg|jpeg|svg|webp|ico)$)/i.test(icon);
    
    if (isUrl) {
      return (
        <div className="flex-shrink-0 w-6 h-6 rounded-md overflow-hidden">
          <img src={icon} alt="Tool" className="h-full w-full object-contain" />
        </div>
      );
    }
    
    // If not a URL, render as emoji
    return <span className="text-lg">{icon}</span>;
  };
  
  // Render multiple tool icons
  const renderMultipleToolIcons = () => {
    // Determine if we should show only icons (when there are multiple tools)
    const showOnlyIcons = courseTools.length > 1;
    
    if (courseTools.length === 0) {
      // Fallback to course icon if no tools
      return (
        <span className="text-xs text-muted-foreground truncate">
          {renderToolIcon(course.icon)}
          {course.slug}
        </span>
      );
    } else if (courseTools.length === 1) {
      // Only one tool - show icon and name
      return (
        <span className="text-xs text-muted-foreground flex items-center">
          {renderToolIcon(courseTools[0].icon)}
          <span className="ml-1 truncate">{courseTools[0].name}</span>
        </span>
      );
    } else {
      // Multiple tools - show icons only with a flex layout
      return (
        <div className="flex items-center flex-wrap gap-2">
          {courseTools.map((tool) => (
            <div 
              key={tool.id}
              className="flex-shrink-0 tooltip-container" 
              data-tooltip={tool.name}
            >
              {renderToolIcon(tool.icon)}
            </div>
          ))}
        </div>
      );
    }
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
                  {badge === 'pro' ? 'Pro' : 'Free'}
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
            
            {/* Tool icons at the bottom */}
            <div className="px-4 py-3 border-t border-border/50 bg-muted/10 flex items-center">
              {renderMultipleToolIcons()}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CourseCard;
