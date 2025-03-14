
import React, { useState, useEffect } from 'react';
import { Tool } from '@/types/admin';
import { supabase } from '@/lib/supabase';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        const toolsData = data
          .map(item => {
            // Check if tools is defined and extract it
            if (item.tools) {
              return item.tools as Tool;
            }
            return null;
          })
          .filter(Boolean) as Tool[]; // Remove any null values
        
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
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Tools Used in This Course</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map(tool => (
          <div 
            key={tool.id} 
            className="p-4 border border-border rounded-lg bg-muted/30 flex items-start"
          >
            <div className="mr-3 text-2xl">{tool.favicon || '🔧'}</div>
            <div className="flex-1">
              <h4 className="font-medium">{tool.name}</h4>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{tool.description}</p>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs"
                asChild
              >
                <a href={tool.url} target="_blank" rel="noopener noreferrer">
                  Visit Tool <ExternalLink className="ml-1 h-3 w-3" />
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
