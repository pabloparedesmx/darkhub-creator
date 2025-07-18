
import React, { useState, useEffect } from 'react';
import { Tool } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface CourseToolsProps {
  courseId: string;
}

const CourseTools = ({ courseId }: CourseToolsProps) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourseTools = async () => {
      try {
        setIsLoading(true);

        // Fetch the tools associated with this course
        const { data, error } = await supabase
          .from('course_tools')
          .select('tool_id, tools(*)')
          .eq('course_id', courseId);
          
        if (error) throw error;

        // Extract the tool objects from the response
        const toolsData = data.map(item => {
          // Check if tools property exists and is not null
          if (item.tools) {
            // First cast to unknown, then to Tool to avoid TypeScript error
            const toolData = item.tools as unknown;
            // Now check if it's a valid Tool object
            if (typeof toolData === 'object' && toolData !== null && !Array.isArray(toolData) && 'id' in toolData && 'name' in toolData) {
              return toolData as Tool;
            }
            console.error('Unexpected tool data structure:', item.tools);
          }
          return null;
        }).filter(Boolean) as Tool[]; // Remove any null values

        setTools(toolsData);
      } catch (error) {
        console.error('Error fetching course tools:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchCourseTools();
    }
  }, [courseId]);

  // Function to render favicon (either as emoji or image)
  const renderFavicon = (favicon: string) => {
    // Check if the favicon is a URL (starts with http:// or https:// or has image extensions)
    const isUrl = /^(https?:\/\/|www\.)|(\.(png|jpg|jpeg|svg|webp|ico)$)/i.test(favicon);
    
    if (isUrl) {
      return (
        <Avatar className="h-10 w-10 mr-3">
          <img src={favicon} alt="Icono de herramienta" className="h-full w-full object-contain" />
          <AvatarFallback>🔧</AvatarFallback>
        </Avatar>
      );
    }

    // If not a URL, render as emoji
    return <div className="mr-3 text-2xl">{favicon || '🔧'}</div>;
  };

  if (isLoading) {
    return (
      <div className="mt-8 animate-pulse">
        <h3 className="text-xl font-semibold mb-4 bg-muted h-7 w-40 rounded"></h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-20 bg-muted rounded"></div>
          <div className="h-20 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (tools.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 mb-8">
      <h3 className="text-xl font-semibold mb-4">Necesitarás</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map(tool => (
          <div 
            key={tool.id} 
            className="p-4 border border-border dark:border-blue-500/20 rounded-lg bg-card shadow-sm dark:shadow-blue-500/5 flex items-start hover:border-primary/20 transition-colors"
          >
            {renderFavicon(tool.favicon)}
            <div className="flex-1">
              <h4 className="font-medium">{tool.name}</h4>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{tool.description}</p>
              <Button size="sm" variant="outline" className="text-xs dark:border-blue-500/30" asChild>
                <a href={tool.url} target="_blank" rel="noopener noreferrer">
                  Visitar Herramienta <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseTools;
