
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tool } from '@/types/admin';
import { ExternalLink } from 'lucide-react';
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface CourseToolsProps {
  courseId: string;
}

const CourseTools = ({ courseId }: CourseToolsProps) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('course_tools')
          .select('tools(*)')
          .eq('course_id', courseId);
        
        if (error) throw error;
        
        if (data) {
          const toolsList = data.map(item => item.tools) as Tool[];
          setTools(toolsList);
        }
      } catch (error) {
        console.error('Error fetching course tools:', error);
        toast({
          title: "Error",
          description: "Failed to load related tools",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (courseId) {
      fetchTools();
    }
  }, [courseId, toast]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-6 w-24 bg-muted rounded"></div>
        <div className="h-36 bg-muted rounded"></div>
      </div>
    );
  }

  if (tools.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Related Tools</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <Card key={tool.id} className="hover:border-primary/20 transition-colors">
            <CardContent className="p-4">
              <a 
                href={tool.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start gap-3"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-secondary/20 rounded-md flex items-center justify-center text-xl">
                  {tool.favicon || '🔧'}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{tool.name}</h4>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {tool.description}
                  </p>
                </div>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CourseTools;
