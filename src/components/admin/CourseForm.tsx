
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabase';
import { Checkbox } from '@/components/ui/checkbox';

interface CourseFormProps {
  newCourse: {
    title: string;
    description: string;
    slug: string;
    icon: string;
    category_id: string;
    isPro: boolean;
    isFree: boolean;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
  };
  setNewCourse: (course: any) => void;
  isEditing: boolean;
  categories: Category[];
  handleAddCourse: () => void;
  handleUpdateCourse: () => void;
  courseId?: string;
}

const CourseForm = ({
  newCourse,
  setNewCourse,
  isEditing,
  categories,
  handleAddCourse,
  handleUpdateCourse,
  courseId
}: CourseFormProps) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [isLoadingTools, setIsLoadingTools] = useState(false);

  // Fetch all tools
  useEffect(() => {
    const fetchTools = async () => {
      try {
        setIsLoadingTools(true);
        const { data, error } = await supabase
          .from('tools')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        setTools(data as Tool[]);
      } catch (error) {
        console.error('Error fetching tools:', error);
      } finally {
        setIsLoadingTools(false);
      }
    };
    
    fetchTools();
  }, []);

  // Fetch existing course-tool associations if editing
  useEffect(() => {
    const fetchCourseTools = async () => {
      if (!courseId || !isEditing) return;
      
      try {
        const { data, error } = await supabase
          .from('course_tools')
          .select('tool_id')
          .eq('course_id', courseId);
        
        if (error) throw error;
        
        const toolIds = data.map(item => item.tool_id);
        setSelectedTools(toolIds);
      } catch (error) {
        console.error('Error fetching course tools:', error);
      }
    };
    
    fetchCourseTools();
  }, [courseId, isEditing]);

  const handleToggleTool = (toolId: string) => {
    setSelectedTools(prev => {
      if (prev.includes(toolId)) {
        return prev.filter(id => id !== toolId);
      } else {
        return [...prev, toolId];
      }
    });
  };

  // Save tool associations when saving course
  const handleSaveWithTools = async () => {
    if (isEditing) {
      await handleUpdateCourse();
    } else {
      await handleAddCourse();
    }
    
    // Tool associations will be saved in the parent component after the course is created/updated
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
            onValueChange={(value) => setNewCourse({...newCourse, difficulty: value})}
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
        <div className="space-y-2">
          <label>Access Type</label>
          <div className="flex items-center space-x-2 mt-4">
            <Switch 
              id="isPro"
              checked={newCourse.isPro}
              onCheckedChange={(checked) => setNewCourse({...newCourse, isPro: checked})}
            />
            <label htmlFor="isPro" className="text-sm cursor-pointer">
              Pro Content
            </label>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Switch 
              id="isFree"
              checked={newCourse.isFree}
              onCheckedChange={(checked) => setNewCourse({...newCourse, isFree: checked})}
            />
            <label htmlFor="isFree" className="text-sm cursor-pointer">
              Free Access
            </label>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">Tools & Technologies</label>
        <p className="text-xs text-muted-foreground mb-2">Select the tools used in this course</p>
        
        {isLoadingTools ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md">
            {tools.length === 0 ? (
              <p className="text-center text-muted-foreground col-span-2">No tools available</p>
            ) : (
              tools.map(tool => (
                <div key={tool.id} className="flex items-start space-x-2 p-2 rounded hover:bg-muted/50">
                  <Checkbox 
                    id={`tool-${tool.id}`} 
                    checked={selectedTools.includes(tool.id)}
                    onCheckedChange={() => handleToggleTool(tool.id)}
                  />
                  <div className="flex-1">
                    <label htmlFor={`tool-${tool.id}`} className="flex items-center cursor-pointer text-sm">
                      {tool.favicon && <span className="mr-2">{tool.favicon}</span>}
                      {tool.name}
                    </label>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      
      <DialogFooter>
        {isEditing ? (
          <Button onClick={handleUpdateCourse} data-selected-tools={JSON.stringify(selectedTools)}>Update Course</Button>
        ) : (
          <Button onClick={handleAddCourse} data-selected-tools={JSON.stringify(selectedTools)}>Add Course</Button>
        )}
      </DialogFooter>
    </div>
  );
};

export default CourseForm;
