import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
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
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface CourseFormProps {
  newCourse: {
    title: string;
    description: string;
    short_description: string;
    slug: string;
    icon: string;
    category_id: string;
    isPro: boolean;
    isFree: boolean;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    cover_image?: string;
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
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  // Handle cover image file selection
  const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      // Check file type and size (max 5MB)
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should not exceed 5MB');
        return;
      }
      
      setCoverImageFile(file);
    }
  };

  // Handle cover image upload to Supabase storage
  const uploadCoverImage = async () => {
    if (!coverImageFile) return null;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Create a unique file name
      const fileExt = coverImageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${courseId || 'new'}_${fileName}`;
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('course_images')
        .upload(filePath, coverImageFile, {
          cacheControl: '3600',
          upsert: true,
        });
      
      if (error) throw error;
      
      // Get public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('course_images')
        .getPublicUrl(data.path);
      
      setUploadProgress(100);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading cover image:', error);
      alert('Failed to upload cover image');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Updated save function to handle image upload
  const handleSaveWithCoverImage = async () => {
    // Upload cover image if a new file was selected
    if (coverImageFile) {
      const publicUrl = await uploadCoverImage();
      if (publicUrl) {
        setNewCourse({...newCourse, cover_image: publicUrl});
      }
    }
    
    // Continue with course save
    if (isEditing) {
      await handleUpdateCourse();
    } else {
      await handleAddCourse();
    }
  };

  // Difficulty levels mapping for display
  const difficultyLabels = {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado'
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
        <label htmlFor="shortDescription">Short Description* (max 200 characters)</label>
        <Textarea
          id="shortDescription"
          value={newCourse.short_description}
          onChange={(e) => {
            // Limit to 200 characters
            const value = e.target.value.slice(0, 200);
            setNewCourse({...newCourse, short_description: value});
          }}
          placeholder="A brief summary that will appear on course cards"
          className="resize-none h-20"
          maxLength={200}
        />
        <p className="text-xs text-muted-foreground">
          {newCourse.short_description?.length || 0}/200 characters
        </p>
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
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">Cover Image (recommended size: 1080 x 450 px)</label>
        <div className="flex flex-col space-y-2">
          {newCourse.cover_image && (
            <div className="relative w-full h-[200px] rounded-md overflow-hidden border border-border">
              <img 
                src={newCourse.cover_image} 
                alt="Cover preview" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => document.getElementById('cover-image-input')?.click()}
              className="flex items-center gap-2"
              disabled={isUploading}
            >
              <Upload className="h-4 w-4" />
              {coverImageFile ? 'Change Image' : 'Upload Image'}
            </Button>
            
            {coverImageFile && (
              <span className="text-sm text-muted-foreground">
                {coverImageFile.name} ({Math.round(coverImageFile.size / 1024)} KB)
              </span>
            )}
            
            <input
              id="cover-image-input"
              type="file"
              accept="image/*"
              onChange={handleCoverImageChange}
              className="hidden"
            />
          </div>
          
          {isUploading && (
            <div className="w-full bg-secondary rounded-full h-2.5 mt-2">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
          
          <p className="text-xs text-muted-foreground">
            Upload a cover image for this course. For best results, use an image that is 1080px wide and 450px tall.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="courseDifficulty">Dificultad</label>
          <Select
            value={newCourse.difficulty || 'beginner'}
            onValueChange={(value) => setNewCourse({...newCourse, difficulty: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un nivel de dificultad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Principiante</SelectItem>
              <SelectItem value="intermediate">Intermedio</SelectItem>
              <SelectItem value="advanced">Avanzado</SelectItem>
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
              onCheckedChange={(checked) => {
                console.log('CourseForm: toggling isFree to', checked);
                setNewCourse({...newCourse, isFree: checked});
              }}
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
          <Button 
            onClick={handleSaveWithCoverImage} 
            data-selected-tools={JSON.stringify(selectedTools)}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Update Course'}
          </Button>
        ) : (
          <Button 
            onClick={handleSaveWithCoverImage} 
            data-selected-tools={JSON.stringify(selectedTools)}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Add Course'}
          </Button>
        )}
      </DialogFooter>
    </div>
  );
};

export default CourseForm;
