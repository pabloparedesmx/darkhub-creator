
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { Tool } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';

interface CourseToolAssociationProps {
  courseId: string;
  isOpen: boolean;
  onClose: () => void;
}

const CourseToolAssociation = ({ courseId, isOpen, onClose }: CourseToolAssociationProps) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch all tools
  useEffect(() => {
    const fetchTools = async () => {
      try {
        const { data, error } = await supabase
          .from('tools')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        // Process tool names to remove prefix
        const processedTools = data.map(tool => {
          if (tool.name && tool.name.startsWith('Herramienta: ')) {
            return {
              ...tool,
              name: tool.name.replace('Herramienta: ', '')
            };
          }
          return tool;
        });
        
        setTools(processedTools as Tool[]);
      } catch (error) {
        console.error('Error fetching tools:', error);
      }
    };
    
    fetchTools();
  }, []);

  // Fetch existing course-tool associations
  useEffect(() => {
    const fetchCourseTools = async () => {
      if (!courseId || !isOpen) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('course_tools')
          .select('tool_id')
          .eq('course_id', courseId);
        
        if (error) throw error;
        
        const toolIds = data.map(item => item.tool_id);
        setSelectedTools(toolIds);
      } catch (error) {
        console.error('Error fetching course tools:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourseTools();
  }, [courseId, isOpen]);

  const handleToggleTool = (toolId: string) => {
    setSelectedTools(prev => {
      if (prev.includes(toolId)) {
        return prev.filter(id => id !== toolId);
      } else {
        return [...prev, toolId];
      }
    });
  };

  const handleSave = async () => {
    if (!courseId) return;
    
    try {
      setIsSaving(true);
      
      // First, delete all existing associations
      const { error: deleteError } = await supabase
        .from('course_tools')
        .delete()
        .eq('course_id', courseId);
      
      if (deleteError) throw deleteError;
      
      // Then, insert new associations
      if (selectedTools.length > 0) {
        const newAssociations = selectedTools.map(toolId => ({
          course_id: courseId,
          tool_id: toolId
        }));
        
        const { error: insertError } = await supabase
          .from('course_tools')
          .insert(newAssociations);
        
        if (insertError) throw insertError;
      }
      
      toast({
        title: "Success",
        description: "Course tools updated successfully"
      });
      
      onClose();
    } catch (error) {
      console.error('Error saving course tools:', error);
      toast({
        title: "Error",
        description: "Failed to update course tools",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Course Tools</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {tools.length === 0 ? (
                <p className="text-center text-muted-foreground">No tools available</p>
              ) : (
                tools.map(tool => (
                  <div key={tool.id} className="flex items-start space-x-3 p-2 rounded hover:bg-muted/50">
                    <Checkbox 
                      id={`tool-${tool.id}`} 
                      checked={selectedTools.includes(tool.id)}
                      onCheckedChange={() => handleToggleTool(tool.id)}
                    />
                    <div className="flex-1">
                      <label htmlFor={`tool-${tool.id}`} className="flex items-center cursor-pointer font-medium">
                        {tool.favicon && <span className="mr-2">{tool.favicon}</span>}
                        {tool.name}
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">{tool.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} disabled={isLoading || isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseToolAssociation;
