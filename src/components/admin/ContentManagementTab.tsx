
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, PlusCircle, MoreVertical, Edit, Trash } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import CategoryBadge from '@/components/ui/CategoryBadge';
import { supabase } from "@/lib/supabase";
import { Database } from '@/lib/database.types';
import { useAuth } from '@/contexts/AuthContext';

// Type for category from database
type Category = Database['public']['Tables']['categories']['Row'];

// Type for course from database with badges
type DbCourse = Database['public']['Tables']['courses']['Row'] & {
  badges: Array<'pro' | 'free' | 'tutorial'>;
  toolName?: string;
};

interface ContentManagementTabProps {
  courses: DbCourse[];
  setCourses: React.Dispatch<React.SetStateAction<DbCourse[]>>;
  categories: Category[];
  isLoading: boolean;
}

const ContentManagementTab = ({ courses, setCourses, categories, isLoading }: ContentManagementTabProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    slug: '',
    icon: '',
    category_id: '',
    isPro: false,
    isFree: false,
    isTutorial: false,
  });
  const [selectedCourse, setSelectedCourse] = useState<DbCourse | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddCourse = async () => {
    const { title, description, slug, icon, category_id, isPro, isFree, isTutorial } = newCourse;
    
    if (!title || !description || !slug) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
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
          author_id: user?.id
        }])
        .select('*, categories(name)')
        .single();
      
      if (error) throw error;
      
      const badges: Array<'tutorial' | 'pro' | 'free'> = [];
      if (isPro) badges.push('pro');
      if (isFree) badges.push('free');
      if (isTutorial) badges.push('tutorial');
      
      const newCourseItem: DbCourse = {
        ...data,
        badges,
        toolName: data.categories ? (data.categories as any).name : undefined
      };
      
      setCourses([newCourseItem, ...courses]);
      
      resetCourseForm();
      
      toast({
        title: "Success",
        description: "Course added successfully",
      });
    } catch (error: any) {
      console.error('Error adding course:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add course",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setCourses(courses.filter(course => course.id !== id));
      
      toast({
        title: "Success",
        description: "Course deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting course:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete course",
        variant: "destructive",
      });
    }
  };

  const handleEditCourse = (course: DbCourse) => {
    setSelectedCourse(course);
    setNewCourse({
      title: course.title,
      description: course.description,
      slug: course.slug,
      icon: course.icon || '',
      category_id: course.category_id || '',
      isPro: course.is_pro,
      isFree: course.is_free,
      isTutorial: course.is_tutorial,
    });
    setIsEditing(true);
  };

  const handleUpdateCourse = async () => {
    if (!selectedCourse) return;
    
    const { title, description, slug, icon, category_id, isPro, isFree, isTutorial } = newCourse;
    
    if (!title || !description || !slug) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('courses')
        .update({
          title,
          description,
          slug,
          icon: icon || '📚',
          category_id: category_id || null,
          is_pro: isPro,
          is_free: isFree,
          is_tutorial: isTutorial
        })
        .eq('id', selectedCourse.id)
        .select('*, categories(name)')
        .single();
      
      if (error) throw error;
      
      const badges: Array<'tutorial' | 'pro' | 'free'> = [];
      if (isPro) badges.push('pro');
      if (isFree) badges.push('free');
      if (isTutorial) badges.push('tutorial');
      
      const updatedCourse: DbCourse = {
        ...data,
        badges,
        toolName: data.categories ? (data.categories as any).name : undefined
      };
      
      setCourses(courses.map(course => 
        course.id === selectedCourse.id ? updatedCourse : course
      ));
      
      setSelectedCourse(null);
      setIsEditing(false);
      resetCourseForm();
      
      toast({
        title: "Success",
        description: "Course updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating course:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update course",
        variant: "destructive",
      });
    }
  };

  const resetCourseForm = () => {
    setNewCourse({
      title: '',
      description: '',
      slug: '',
      icon: '',
      category_id: '',
      isPro: false,
      isFree: false,
      isTutorial: false,
    });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search content..." className="pl-10" />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Course' : 'Add New Course'}</DialogTitle>
              <DialogDescription>
                {isEditing ? 'Update the course details' : 'Create a new course in your platform'}
              </DialogDescription>
            </DialogHeader>
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
                <Textarea 
                  id="courseDescription" 
                  value={newCourse.description} 
                  onChange={(e) => setNewCourse({...newCourse, description: e.target.value})} 
                  placeholder="Brief description of the course"
                  rows={4}
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
            </div>
            <DialogFooter>
              {isEditing ? (
                <Button onClick={handleUpdateCourse}>Update Course</Button>
              ) : (
                <Button onClick={handleAddCourse}>Add Course</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No courses found. Add your first course to get started.</p>
              </CardContent>
            </Card>
          ) : (
            courses.map(course => (
              <Card key={course.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-4">
                      {course.icon && (
                        <div className="flex items-center justify-center w-12 h-12 bg-secondary rounded-md">
                          <span className="text-2xl">{course.icon}</span>
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{course.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{course.description}</p>
                        <div className="flex space-x-2 mb-1">
                          {course.badges.map((badge, index) => (
                            <CategoryBadge key={index} type={badge} />
                          ))}
                        </div>
                        {course.toolName && (
                          <p className="text-xs text-muted-foreground">Category: {course.toolName}</p>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditCourse(course)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteCourse(course.id)}
                          className="text-destructive"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </>
  );
};

export default ContentManagementTab;
