
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from "@/hooks/use-toast";
import { Course } from '@/components/ui/CourseCard';
import { MoreVertical, PlusCircle, Search, Trash, Edit, Users, DollarSign, ShoppingCart, Book, LayoutDashboard } from 'lucide-react';
import CategoryBadge from '@/components/ui/CategoryBadge';
import { supabase } from "@/lib/supabase";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Database } from '@/lib/database.types';

// Type for category from database
type Category = Database['public']['Tables']['categories']['Row'];

// Type for course from database with badges
type DbCourse = Database['public']['Tables']['courses']['Row'] & {
  badges: Array<'pro' | 'free' | 'tutorial'>;
  toolName?: string;
};

const AdminDashboard = () => {
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [courses, setCourses] = useState<DbCourse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
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
  const [isLoading, setIsLoading] = useState(true);

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
          const badges: Array<'tutorial' | 'pro' | 'free'> = [];
          if (course.is_pro) badges.push('pro');
          if (course.is_free) badges.push('free');
          if (course.is_tutorial) badges.push('tutorial');
          
          return {
            ...course,
            badges,
            toolName: course.categories ? (course.categories as any).name : undefined
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
            <div className="md:col-span-3">
              <Card className="bg-secondary/30 backdrop-blur-sm mb-6">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center pt-4 pb-6">
                    <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mb-4">
                      <Users className="w-12 h-12 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold mb-1">Admin Panel</h2>
                    <p className="text-muted-foreground text-sm">Manage your content</p>
                  </div>
                  
                  <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start">
                      <LayoutDashboard className="mr-2 h-5 w-5" />
                      Dashboard
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Book className="mr-2 h-5 w-5" />
                      Content
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Users className="mr-2 h-5 w-5" />
                      Users
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <DollarSign className="mr-2 h-5 w-5" />
                      Subscriptions
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Orders
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-secondary/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Categories</span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Category</DialogTitle>
                          <DialogDescription>
                            Create a new category for organizing content
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <label htmlFor="categoryName">Category Name</label>
                            <Input 
                              id="categoryName" 
                              value={newCategory} 
                              onChange={(e) => setNewCategory(e.target.value)} 
                              placeholder="e.g. AI Tools, Marketing, etc."
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAddCategory}>Add Category</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                  {isLoading ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {categories.map(category => (
                        <div key={category.id} className="flex justify-between items-center p-2 rounded-md hover:bg-secondary/50">
                          <div>
                            <span className="text-sm font-medium">{category.name}</span>
                            <span className="ml-2 text-xs text-muted-foreground">({category.count})</span>
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-9">
              <Tabs defaultValue="content">
                <TabsList className="mb-6">
                  <TabsTrigger value="content">Content Management</TabsTrigger>
                  <TabsTrigger value="users">Users</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                
                <TabsContent value="content">
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
                </TabsContent>
                
                <TabsContent value="users">
                  <Card>
                    <CardHeader>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>Manage your platform users and their subscriptions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">This feature will be implemented in the next phase.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="analytics">
                  <Card>
                    <CardHeader>
                      <CardTitle>Analytics Dashboard</CardTitle>
                      <CardDescription>View performance metrics for your platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Analytics dashboard will be implemented in the next phase.</p>
                    </CardContent>
                  </Card>
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
