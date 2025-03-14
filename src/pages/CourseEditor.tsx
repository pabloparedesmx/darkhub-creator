
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from '@/contexts/AuthContext';
import { Category } from '@/types/admin';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from "@/components/ui/checkbox";

const CourseEditor = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const isNewCourse = !courseId || courseId === 'new';
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [tools, setTools] = useState<any[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  
  const [course, setCourse] = useState({
    title: '',
    description: '',
    short_description: '',
    slug: '',
    icon: '',
    category_id: '',
    isPro: false,
    isFree: true,
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced'
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('name');
        
        if (categoriesError) throw categoriesError;
        setCategories(categoriesData);
        
        // Fetch tools
        const { data: toolsData, error: toolsError } = await supabase
          .from('tools')
          .select('*')
          .order('name');
        
        if (toolsError) throw toolsError;
        setTools(toolsData);
        
        if (!isNewCourse && courseId) {
          // Fetch course data
          const { data: courseData, error: courseError } = await supabase
            .from('courses')
            .select('*')
            .eq('id', courseId)
            .single();
          
          if (courseError) throw courseError;
          
          setCourse({
            title: courseData.title,
            description: courseData.description,
            short_description: courseData.short_description || '',
            slug: courseData.slug,
            icon: courseData.icon || '',
            category_id: courseData.category_id || '',
            isPro: courseData.is_pro || false,
            isFree: courseData.is_free || true,
            difficulty: courseData.difficulty || 'beginner'
          });
          
          // Fetch associated tools
          const { data: courseToolsData, error: courseToolsError } = await supabase
            .from('course_tools')
            .select('tool_id')
            .eq('course_id', courseId);
          
          if (courseToolsError) throw courseToolsError;
          
          setSelectedTools(courseToolsData.map(tool => tool.tool_id));
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [courseId, isNewCourse, toast]);

  const handleSaveCourse = async () => {
    const { title, description, short_description, slug, icon, category_id, isPro, isFree, difficulty } = course;
    
    if (!title || !description || !slug) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      let courseIdToUse = courseId;
      
      if (isNewCourse) {
        // Create new course
        const { data, error } = await supabase
          .from('courses')
          .insert([{
            title,
            description,
            short_description,
            slug,
            icon: icon || '📚',
            category_id: category_id || null,
            is_pro: isPro,
            is_free: isFree,
            difficulty: difficulty,
            author_id: user?.id
          }])
          .select();
        
        if (error) throw error;
        courseIdToUse = data[0].id;
        
        toast({
          title: "Success",
          description: "Course added successfully",
        });
      } else {
        // Update existing course
        const { error } = await supabase
          .from('courses')
          .update({
            title,
            description,
            short_description,
            slug,
            icon: icon || '📚',
            category_id: category_id || null,
            is_pro: isPro,
            is_free: isFree,
            difficulty
          })
          .eq('id', courseId);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Course updated successfully",
        });
      }
      
      // Save tool associations
      if (courseIdToUse) {
        // First delete existing associations
        const { error: deleteError } = await supabase
          .from('course_tools')
          .delete()
          .eq('course_id', courseIdToUse);
        
        if (deleteError) throw deleteError;
        
        // Then insert new associations
        if (selectedTools.length > 0) {
          const toolAssociations = selectedTools.map(toolId => ({
            course_id: courseIdToUse,
            tool_id: toolId
          }));
          
          const { error: insertError } = await supabase
            .from('course_tools')
            .insert(toolAssociations);
          
          if (insertError) throw insertError;
        }
      }
      
      navigate('/admin');
    } catch (error: any) {
      console.error('Error saving course:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save course",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setCourse(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleTool = (toolId: string) => {
    setSelectedTools(prev => {
      if (prev.includes(toolId)) {
        return prev.filter(id => id !== toolId);
      } else {
        return [...prev, toolId];
      }
    });
  };

  const generateSlugFromTitle = () => {
    if (!course.slug && course.title) {
      const slug = course.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      handleInputChange('slug', slug);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto py-4 px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Courses
              </Button>
              <h1 className="text-xl font-semibold">
                {isNewCourse ? 'Create New Course' : 'Edit Course'}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                {isSaving ? 'Saving...' : 'Changes will be published immediately'}
              </div>
              <Button 
                onClick={handleSaveCourse} 
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save & Publish'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Info</CardTitle>
                <CardDescription>Core information about the course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">Course Title<span className="text-red-500">*</span></label>
                  <Input
                    id="title"
                    placeholder="e.g. Introduction to AI Development"
                    value={course.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    onBlur={generateSlugFromTitle}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="slug" className="text-sm font-medium">Slug<span className="text-red-500">*</span></label>
                  <div className="flex items-center">
                    <span className="bg-muted px-3 py-2 text-sm rounded-l-md border border-r-0 border-input text-muted-foreground">
                      /courses/
                    </span>
                    <Input
                      id="slug"
                      className="rounded-l-none"
                      placeholder="introduction-to-ai"
                      value={course.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This will be the URL of your course page
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="shortDescription" className="text-sm font-medium">
                    Short Description<span className="text-red-500">*</span> <span className="text-muted-foreground">(max 200 chars)</span>
                  </label>
                  <Textarea
                    id="shortDescription"
                    placeholder="A brief summary that will appear on course cards"
                    value={course.short_description}
                    onChange={(e) => {
                      // Limit to 200 characters
                      const value = e.target.value.slice(0, 200);
                      handleInputChange('short_description', value);
                    }}
                    className="resize-none h-20"
                    maxLength={200}
                  />
                  <p className="text-xs text-muted-foreground">
                    {course.short_description?.length || 0}/200 characters
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">Description<span className="text-red-500">*</span></label>
                  <RichTextEditor 
                    value={course.description} 
                    onChange={(content) => handleInputChange('description', content)} 
                    placeholder="Add details about what this course covers"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Media</CardTitle>
                <CardDescription>Visual elements for the course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="icon" className="text-sm font-medium">Icon (Emoji)</label>
                  <Input
                    id="icon"
                    placeholder="📚"
                    value={course.icon}
                    onChange={(e) => handleInputChange('icon', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Add an emoji that represents this course
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Settings</CardTitle>
                <CardDescription>Configure your course visibility and properties</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={course.category_id}
                    onValueChange={(value) => handleInputChange('category_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty Level</label>
                  <Select
                    value={course.difficulty}
                    onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => 
                      handleInputChange('difficulty', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tools & Technologies</label>
                  <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                    {tools.length === 0 ? (
                      <p className="text-center text-muted-foreground py-2">No tools available</p>
                    ) : (
                      tools.map((tool) => (
                        <div key={tool.id} className="flex items-center space-x-2 py-1.5">
                          <Checkbox 
                            id={`tool-${tool.id}`}
                            checked={selectedTools.includes(tool.id)}
                            onCheckedChange={() => handleToggleTool(tool.id)}
                          />
                          <label 
                            htmlFor={`tool-${tool.id}`} 
                            className="text-sm cursor-pointer"
                          >
                            {tool.name}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Select the tools and technologies used in this course
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Access Type</label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Switch 
                      id="isPro"
                      checked={course.isPro}
                      onCheckedChange={(checked) => handleInputChange('isPro', checked)}
                    />
                    <label htmlFor="isPro" className="text-sm cursor-pointer">
                      Pro Content
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Switch 
                      id="isFree"
                      checked={course.isFree}
                      onCheckedChange={(checked) => handleInputChange('isFree', checked)}
                    />
                    <label htmlFor="isFree" className="text-sm cursor-pointer">
                      Free Access
                    </label>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="mt-6">
                  <Button 
                    onClick={handleSaveCourse} 
                    className="w-full" 
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : (isNewCourse ? 'Create Course' : 'Update Course')}
                  </Button>
                </div>
                
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => navigate('/admin')}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseEditor;
