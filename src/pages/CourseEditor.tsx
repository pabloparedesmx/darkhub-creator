
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from '@/contexts/AuthContext';
import { Category, DbCourse } from '@/types/admin';
import CourseForm from '@/components/admin/CourseForm';

const CourseEditor = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const isNewCourse = !courseId || courseId === 'new';
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  // Fetch categories and course data (if editing)
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
        
        // If editing an existing course, fetch its data
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

    try {
      if (isNewCourse) {
        // Add new course
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
        // Update existing course
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
      
      // Navigate back to admin dashboard
      navigate('/admin');
    } catch (error: any) {
      console.error('Error saving course:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save course",
        variant: "destructive",
      });
    }
  };

  // Define functions that match the existing pattern in CourseManagement
  const handleAddCourse = handleSaveCourse;
  const handleUpdateCourse = handleSaveCourse;

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
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">
          {isNewCourse ? 'Add New Course' : 'Edit Course'}
        </h1>
        
        <CourseForm 
          newCourse={course}
          setNewCourse={setCourse}
          isEditing={!isNewCourse}
          categories={categories}
          handleAddCourse={handleAddCourse}
          handleUpdateCourse={handleUpdateCourse}
        />
        
        <div className="flex justify-end mt-6">
          <Button variant="outline" className="mr-2" onClick={() => navigate('/admin')}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

// We need to add Button which is used within the component
import { Button } from '@/components/ui/button';

export default CourseEditor;
