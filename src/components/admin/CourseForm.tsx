
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogFooter } from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RichTextEditor from '@/components/ui/RichTextEditor';
import { Category, Tool } from '@/types/admin';
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface CourseFormProps {
  newCourse: {
    title: string;
    description: string;
    slug: string;
    icon: string;
    category_id: string;
    isPro: boolean;
    isFree: boolean;
    isTutorial: boolean;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
  };
  setNewCourse: (course: any) => void;
  isEditing: boolean;
  categories: Category[];
  handleAddCourse: () => void;
  handleUpdateCourse: () => void;
}

const CourseForm = ({
  newCourse,
  setNewCourse,
  isEditing,
  categories,
  handleAddCourse,
  handleUpdateCourse
}: CourseFormProps) => {
  const { toast } = useToast();
  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedTools, setSelectedTools] = useState<Tool[]>([]);
  const [selectedToolId, setSelectedToolId] = useState<string>('');
  const [isLoadingTools, setIsLoadingTools] = useState<boolean>(true);
  const [courseId, setCourseId] = useState<string | null>(null);

  // Fetch tools
  useEffect(() => {
    const fetchTools = async () => {
      try {
        setIsLoadingTools(true);
        const { data, error } = await supabase
          .from('tools')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        setTools(data || []);
      } catch (error) {
        console.error('Error fetching tools:', error);
      } finally {
        setIsLoadingTools(false);
      }
    };
    
    fetchTools();
  }, []);

  // If editing, fetch existing course-tool relationships
  useEffect(() => {
    if (isEditing && newCourse.title) {
      const fetchCourseId = async () => {
        try {
          // First get the course ID using the title
          const { data: courseData, error: courseError } = await supabase
            .from('courses')
            .select('id')
            .eq('title', newCourse.title)
            .single();
          
          if (courseError) throw courseError;
          
          if (courseData) {
            setCourseId(courseData.id);
            
            // Then fetch all tools associated with this course
            const { data: courseToolsData, error: courseToolsError } = await supabase
              .from('course_tools')
              .select('tools(*)')
              .eq('course_id', courseData.id);
            
            if (courseToolsError) throw courseToolsError;
            
            if (courseToolsData && courseToolsData.length > 0) {
              // Properly type and map the tools data
              const toolsList = courseToolsData.map(item => item.tools as Tool);
              setSelectedTools(toolsList);
            }
          }
        } catch (error) {
          console.error('Error fetching course tools:', error);
        }
      };
      
      fetchCourseId();
    }
  }, [isEditing, newCourse.title]);

  const handleAddTool = async () => {
    if (!selectedToolId) return;
    
    const toolToAdd = tools.find(tool => tool.id === selectedToolId);
    if (!toolToAdd) return;
    
    // Check if tool is already selected
    if (selectedTools.some(tool => tool.id === selectedToolId)) {
      toast({
        title: "Already added",
        description: "This tool is already linked to the course",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedTools([...selectedTools, toolToAdd]);
    setSelectedToolId('');
  };

  const handleRemoveTool = (toolId: string) => {
    setSelectedTools(selectedTools.filter(tool => tool.id !== toolId));
  };

  const handleSubmit = async () => {
    try {
      if (isEditing && courseId) {
        // If editing, first delete all existing relationships
        const { error: deleteError } = await supabase
          .from('course_tools')
          .delete()
          .eq('course_id', courseId);
        
        if (deleteError) throw deleteError;
        
        // Then add new relationships
        if (selectedTools.length > 0) {
          const courseToolsData = selectedTools.map(tool => ({
            course_id: courseId,
            tool_id: tool.id
          }));
          
          const { error: insertError } = await supabase
            .from('course_tools')
            .insert(courseToolsData);
          
          if (insertError) throw insertError;
        }
        
        handleUpdateCourse();
      } else {
        // If adding a new course, first add the course
        handleAddCourse();
        // Then link the tools (this would need to be handled in the parent component)
      }
    } catch (error) {
      console.error('Error saving course tools:', error);
      toast({
        title: "Error",
        description: "Failed to save tool relationships",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="courseTitle">Course Title*</label>
          <Input 
            id="courseTitle" 
            value={newCourse.title} 
            onChange={(e) => setNewCourse({...newCourse, title: e.target.value})} 
            placeholder="e.g. AI Product Development"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="courseSlug">Course Slug*</label>
          <Input 
            id="courseSlug" 
            value={newCourse.slug} 
            onChange={(e) => setNewCourse({...newCourse, slug: e.target.value})} 
            placeholder="e.g. ai-product-development"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="courseDescription">Description*</label>
        <RichTextEditor 
          value={newCourse.description} 
          onChange={(content) => setNewCourse({...newCourse, description: content})} 
          placeholder="Brief description of the course"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="courseIcon">Icon (emoji)</label>
          <Input 
            id="courseIcon" 
            value={newCourse.icon} 
            onChange={(e) => setNewCourse({...newCourse, icon: e.target.value})} 
            placeholder="e.g. 🤖"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="courseCategory">Category</label>
          <select
            id="courseCategory"
            value={newCourse.category_id}
            onChange={(e) => setNewCourse({...newCourse, category_id: e.target.value})}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="courseDifficulty">Difficulty</label>
          <Select
            value={newCourse.difficulty || 'beginner'}
            onValueChange={(value) => setNewCourse({...newCourse, difficulty: value as 'beginner' | 'intermediate' | 'advanced'})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a difficulty level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="font-medium">Course Type</label>
        <div className="flex flex-wrap gap-4 mt-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isPro" 
              checked={newCourse.isPro}
              onCheckedChange={(checked) => setNewCourse({...newCourse, isPro: !!checked})}
            />
            <label
              htmlFor="isPro"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Pro Content
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isFree" 
              checked={newCourse.isFree}
              onCheckedChange={(checked) => setNewCourse({...newCourse, isFree: !!checked})}
            />
            <label
              htmlFor="isFree"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Free Content
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isTutorial" 
              checked={newCourse.isTutorial}
              onCheckedChange={(checked) => setNewCourse({...newCourse, isTutorial: !!checked})}
            />
            <label
              htmlFor="isTutorial"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Tutorial
            </label>
          </div>
        </div>
      </div>
      
      <div className="space-y-2 border-t pt-4">
        <label className="font-medium">Related Tools</label>
        <div className="flex items-end gap-2">
          <div className="flex-grow">
            <select
              value={selectedToolId}
              onChange={(e) => setSelectedToolId(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              disabled={isLoadingTools}
            >
              <option value="">Select a tool</option>
              {tools.map((tool) => (
                <option key={tool.id} value={tool.id}>
                  {tool.favicon || '🔧'} {tool.name}
                </option>
              ))}
            </select>
          </div>
          <Button 
            type="button" 
            onClick={handleAddTool}
            disabled={!selectedToolId || isLoadingTools}
          >
            Add Tool
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedTools.map((tool) => (
            <Badge key={tool.id} variant="secondary" className="flex items-center gap-1">
              <span>{tool.favicon || '🔧'} {tool.name}</span>
              <button 
                type="button" 
                onClick={() => handleRemoveTool(tool.id)}
                className="ml-1 h-4 w-4 rounded-full hover:bg-muted inline-flex items-center justify-center"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {selectedTools.length === 0 && (
            <p className="text-sm text-muted-foreground">No tools added yet.</p>
          )}
        </div>
      </div>
      
      <DialogFooter>
        {isEditing ? (
          <Button onClick={handleSubmit}>Update Course</Button>
        ) : (
          <Button onClick={handleSubmit}>Add Course</Button>
        )}
      </DialogFooter>
    </div>
  );
};

export default CourseForm;
