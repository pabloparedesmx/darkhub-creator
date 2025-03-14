
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from '@/contexts/AuthContext';
import { Category, DbCourse } from '@/types/admin';
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
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const CourseEditor = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const isNewCourse = !courseId || courseId === 'new';
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [course, setCourse] = useState({
    title: '',
    description: '',
    slug: '',
    icon: '',
    category_id: '',
    isPro: false,
    isFree: false,
    isTutorial: false,
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced'
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('name');
        
        if (categoriesError) throw categoriesError;
        setCategories(categoriesData);
        
        if (!isNewCourse && courseId) {
          const { data: courseData, error: courseError } = await supabase
            .from('courses')
            .select('*')
            .eq('id', courseId)
            .single();
          
          if (courseError) throw courseError;
          
          setCourse({
            title: courseData.title,
            description: courseData.description,
            slug: courseData.slug,
            icon: courseData.icon || '',
            category_id: courseData.category_id || '',
            isPro: courseData.is_pro,
            isFree: courseData.is_free,
            isTutorial: courseData.is_tutorial,
            difficulty: courseData.difficulty || 'beginner'
          });
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
    const { title, description, slug, icon, category_id, isPro, isFree, isTutorial, difficulty } = course;
    
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
      if (isNewCourse) {
        const { error } = await supabase
          .from('courses')
          .insert([{
            title,
            description,
            slug,
            icon: icon || '📚',
            category_id: category_id || null,
            is_pro: isPro,
            is_free: isFree,
            is_tutorial: isTutorial,
            difficulty: difficulty,
            author_id: user?.id
          }]);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Course added successfully",
        });
      } else {
        const { error } = await supabase
          .from('courses')
          .update({
            title,
            description,
            slug,
            icon: icon || '📚',
            category_id: category_id || null,
            is_pro: isPro,
            is_free: isFree,
            is_tutorial: isTutorial,
            difficulty
          })
          .eq('id', courseId);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Course updated successfully",
        });
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
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <label className="text-sm font-medium">Access Settings</label>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isPro"
                      checked={course.isPro}
                      onCheckedChange={(checked) => handleInputChange('isPro', !!checked)}
                    />
                    <label
                      htmlFor="isPro"
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Pro Content
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isFree"
                      checked={course.isFree}
                      onCheckedChange={(checked) => handleInputChange('isFree', !!checked)}
                    />
                    <label
                      htmlFor="isFree"
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Free Content
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
