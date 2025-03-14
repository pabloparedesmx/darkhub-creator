import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Category, DbCourse, UserProfile, Tool } from '@/types/admin';
import { PromptWithCategory } from '@/types/prompt';

// Import refactored components
import AdminSidebar from '@/components/admin/AdminSidebar';
import UserManagement from '@/components/admin/UserManagement';
import CourseManagement from '@/components/admin/CourseManagement';
import ToolManagement from '@/components/admin/ToolManagement';
import PromptManagement from '@/components/admin/PromptManagement';
import AnalyticsTab from '@/components/admin/AnalyticsTab';

const AdminDashboard = () => {
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [courses, setCourses] = useState<DbCourse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [prompts, setPrompts] = useState<PromptWithCategory[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    short_description: '', // Added short_description field
    slug: '',
    icon: '',
    category_id: '',
    isPro: false,
    isFree: true,
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced'
  });
  const [selectedCourse, setSelectedCourse] = useState<DbCourse | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [isToolsLoading, setIsToolsLoading] = useState(true);
  const [isPromptsLoading, setIsPromptsLoading] = useState(true);

  // Check if user is admin, redirect if not
  useEffect(() => {
    if (user && !isAdmin) {
      toast({
        title: "Access denied",
        description: "You don't have permission to access the admin dashboard",
        variant: "destructive",
      });
      navigate('/dashboard');
    }
  }, [user, isAdmin, navigate, toast]);

  // Fetch categories and courses from Supabase
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
        
        // Fetch courses
        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select('*, categories(name)')
          .order('created_at', { ascending: false });
        
        if (coursesError) throw coursesError;
        
        // Map courses to the expected format
        const formattedCourses = coursesData.map(course => {
          const badges: Array<'pro' | 'free'> = [];
          if (course.is_pro) badges.push('pro');
          if (course.is_free) badges.push('free');
          
          return {
            ...course,
            badges,
            toolName: course.categories ? course.categories.name : undefined
          };
        });
        
        setCategories(categoriesData);
        setCourses(formattedCourses);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  // Fetch tools
  useEffect(() => {
    const fetchTools = async () => {
      setIsToolsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('tools')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        setTools(data as Tool[]);
      } catch (error) {
        console.error('Error fetching tools:', error);
        toast({
          title: "Error",
          description: "Failed to load tools",
          variant: "destructive",
        });
      } finally {
        setIsToolsLoading(false);
      }
    };
    
    fetchTools();
  }, [toast]);

  // Fetch user data
  useEffect(() => {
    const fetchUsers = async () => {
      setIsUserLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setUsers(data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive",
        });
      } finally {
        setIsUserLoading(false);
      }
    };
    
    fetchUsers();
  }, [toast]);

  // Fetch prompts
  useEffect(() => {
    const fetchPrompts = async () => {
      setIsPromptsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('prompts')
          .select(`
            *,
            categories (
              name
            )
          `)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setPrompts(data as PromptWithCategory[]);
      } catch (error) {
        console.error('Error fetching prompts:', error);
        toast({
          title: "Error",
          description: "Failed to load prompts",
          variant: "destructive",
        });
      } finally {
        setIsPromptsLoading(false);
      }
    };
    
    fetchPrompts();
  }, [toast]);

  // Function to refetch prompts after changes
  const refetchPrompts = async () => {
    setIsPromptsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select(`
          *,
          categories (
            name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setPrompts(data as PromptWithCategory[]);
    } catch (error) {
      console.error('Error refetching prompts:', error);
    } finally {
      setIsPromptsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name: newCategory }])
        .select()
        .single();
      
      if (error) throw error;
      
      setCategories([...categories, data]);
      setNewCategory('');
      
      toast({
        title: "Success",
        description: "Category added successfully",
      });
    } catch (error: any) {
      console.error('Error adding category:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add category",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setCategories(categories.filter(category => category.id !== id));
      
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  // Add new function to update category name
  const handleUpdateCategory = async (id: string, name: string) => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .update({ name })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setCategories(categories.map(category => 
        category.id === id ? data : category
      ));
      
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating category:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update category",
        variant: "destructive",
      });
    }
  };

  const handleAddCourse = async () => {
    const { title, description, short_description, slug, icon, category_id, isPro, isFree, difficulty } = newCourse;
    
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
          short_description, // Add short_description to the insert
          slug,
          icon: icon || '📚',
          category_id: category_id || null,
          is_pro: isPro,
          is_free: isFree,
          difficulty: difficulty,
          author_id: user?.id
        }])
        .select('*, categories(name)')
        .single();
      
      if (error) throw error;
      
      const badges: Array<'pro' | 'free'> = [];
      if (isPro) badges.push('pro');
      if (isFree) badges.push('free');
      
      const newCourseItem: DbCourse = {
        ...data,
        badges,
        toolName: data.categories ? data.categories.name : undefined
      };
      
      setCourses([newCourseItem, ...courses]);
      
      setNewCourse({
        title: '',
        description: '',
        short_description: '', // Reset short_description
        slug: '',
        icon: '',
        category_id: '',
        isPro: false,
        isFree: true,
        difficulty: 'beginner'
      });
      
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
      short_description: course.short_description || '', // Add short_description with fallback
      slug: course.slug,
      icon: course.icon || '',
      category_id: course.category_id || '',
      isPro: course.is_pro,
      isFree: course.is_free,
      difficulty: course.difficulty || 'beginner'
    });
    setIsEditing(true);
  };

  const handleUpdateCourse = async () => {
    if (!selectedCourse) return;
    
    const { title, description, short_description, slug, icon, category_id, isPro, isFree, difficulty } = newCourse;
    
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
          short_description, // Add short_description to the update
          slug,
          icon: icon || '📚',
          category_id: category_id || null,
          is_pro: isPro,
          is_free: isFree,
          difficulty
        })
        .eq('id', selectedCourse.id)
        .select('*, categories(name)')
        .single();
      
      if (error) throw error;
      
      const badges: Array<'pro' | 'free'> = [];
      if (isPro) badges.push('pro');
      if (isFree) badges.push('free');
      
      const updatedCourse: DbCourse = {
        ...data,
        badges,
        toolName: data.categories ? data.categories.name : undefined
      };
      
      setCourses(courses.map(course => 
        course.id === selectedCourse.id ? updatedCourse : course
      ));
      
      setSelectedCourse(null);
      setIsEditing(false);
      
      setNewCourse({
        title: '',
        description: '',
        short_description: '', // Reset short_description
        slug: '',
        icon: '',
        category_id: '',
        isPro: false,
        isFree: true,
        difficulty: 'beginner'
      });
      
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

  // Tool management functions
  const handleAddTool = async (newTool: Omit<Tool, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('tools')
        .insert([newTool])
        .select()
        .single();
      
      if (error) throw error;
      
      setTools([...tools, data as Tool]);
      
      toast({
        title: "Success",
        description: "Tool added successfully",
      });
    } catch (error: any) {
      console.error('Error adding tool:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add tool",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTool = async (id: string, updatedTool: Partial<Tool>) => {
    try {
      const { data, error } = await supabase
        .from('tools')
        .update(updatedTool)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setTools(tools.map(tool => tool.id === id ? data as Tool : tool));
      
      toast({
        title: "Success",
        description: "Tool updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating tool:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add tool",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTool = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setTools(tools.filter(tool => tool.id !== id));
      
      toast({
        title: "Success",
        description: "Tool deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting tool:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete tool",
        variant: "destructive",
      });
    }
  };

  // Update user role
  const handleUpdateUserRole = async (userId: string, currentRole: 'user' | 'admin') => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole as 'user' | 'admin' } : user
      ));
      
      toast({
        title: "Success",
        description: `User role updated to ${newRole}`,
      });
    } catch (error: any) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Sidebar */}
            <AdminSidebar
              categories={categories}
              newCategory={newCategory}
              setNewCategory={setNewCategory}
              handleAddCategory={handleAddCategory}
              handleDeleteCategory={handleDeleteCategory}
              handleUpdateCategory={handleUpdateCategory}
              isLoading={isLoading}
            />
            
            {/* Main Content */}
            <div className="md:col-span-9">
              <Tabs defaultValue="content">
                <TabsList className="mb-6">
                  <TabsTrigger value="content">Content Management</TabsTrigger>
                  <TabsTrigger value="tools">Tools Management</TabsTrigger>
                  <TabsTrigger value="prompts">Prompts Management</TabsTrigger>
                  <TabsTrigger value="users">User Management</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                
                <TabsContent value="content">
                  <CourseManagement
                    courses={courses}
                    categories={categories}
                    newCourse={newCourse}
                    setNewCourse={setNewCourse}
                    isEditing={isEditing}
                    isLoading={isLoading}
                    handleAddCourse={handleAddCourse}
                    handleUpdateCourse={handleUpdateCourse}
                    handleEditCourse={handleEditCourse}
                    handleDeleteCourse={handleDeleteCourse}
                  />
                </TabsContent>
                
                <TabsContent value="tools">
                  <ToolManagement
                    tools={tools}
                    isLoading={isToolsLoading}
                    handleAddTool={handleAddTool}
                    handleUpdateTool={handleUpdateTool}
                    handleDeleteTool={handleDeleteTool}
                  />
                </TabsContent>
                
                <TabsContent value="prompts">
                  <PromptManagement
                    prompts={prompts}
                    categories={categories}
                    isLoading={isPromptsLoading}
                    refetchPrompts={refetchPrompts}
                  />
                </TabsContent>
                
                <TabsContent value="users">
                  <UserManagement
                    users={users}
                    userSearchTerm={userSearchTerm}
                    setUserSearchTerm={setUserSearchTerm}
                    handleUpdateUserRole={handleUpdateUserRole}
                    isUserLoading={isUserLoading}
                  />
                </TabsContent>
                
                <TabsContent value="analytics">
                  <AnalyticsTab />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
