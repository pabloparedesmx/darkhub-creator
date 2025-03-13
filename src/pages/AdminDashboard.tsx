
import { useState } from 'react';
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

const AdminDashboard = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'AI Product Development',
      description: 'Learn how to build AI-powered products from scratch.',
      badges: ['pro'],
      slug: 'ai-product-development',
      icon: '🤖',
      toolName: 'AI Tools',
    },
    {
      id: '2',
      title: 'Growth Marketing',
      description: 'Strategies to grow your product and acquire users.',
      badges: ['tutorial', 'free'],
      slug: 'growth-marketing',
      icon: '📈',
      toolName: 'Marketing',
    },
    {
      id: '3',
      title: 'UX Research',
      description: 'Learn how to conduct user research and analyze results.',
      badges: ['pro'],
      slug: 'ux-research',
      icon: '👥',
      toolName: 'UX Tools',
    },
  ]);

  const [categories, setCategories] = useState([
    { id: '1', name: 'AI Tools', count: 12 },
    { id: '2', name: 'Marketing', count: 8 },
    { id: '3', name: 'UX Tools', count: 5 },
    { id: '4', name: 'Product Management', count: 9 },
  ]);

  const [newCategory, setNewCategory] = useState('');
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    slug: '',
    icon: '',
    toolName: '',
    isPro: false,
    isFree: false,
    isTutorial: false,
  });

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const newCategoryItem = {
      id: (categories.length + 1).toString(),
      name: newCategory,
      count: 0,
    };

    setCategories([...categories, newCategoryItem]);
    setNewCategory('');
    
    toast({
      title: "Success",
      description: "Category added successfully",
    });
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(category => category.id !== id));
    toast({
      title: "Success",
      description: "Category deleted successfully",
    });
  };

  const handleAddCourse = () => {
    const { title, description, slug, icon, toolName, isPro, isFree, isTutorial } = newCourse;
    
    if (!title || !description || !slug) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const badges: Array<'tutorial' | 'pro' | 'free'> = [];
    if (isPro) badges.push('pro');
    if (isFree) badges.push('free');
    if (isTutorial) badges.push('tutorial');

    const newCourseItem: Course = {
      id: (courses.length + 1).toString(),
      title,
      description,
      slug,
      badges,
      icon: icon || '📚',
      toolName: toolName || undefined,
    };

    setCourses([...courses, newCourseItem]);
    
    setNewCourse({
      title: '',
      description: '',
      slug: '',
      icon: '',
      toolName: '',
      isPro: false,
      isFree: false,
      isTutorial: false,
    });

    toast({
      title: "Success",
      description: "Course added successfully",
    });
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
    toast({
      title: "Success",
      description: "Course deleted successfully",
    });
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setNewCourse({
      title: course.title,
      description: course.description,
      slug: course.slug,
      icon: course.icon || '',
      toolName: course.toolName || '',
      isPro: course.badges.includes('pro'),
      isFree: course.badges.includes('free'),
      isTutorial: course.badges.includes('tutorial'),
    });
    setIsEditing(true);
  };

  const handleUpdateCourse = () => {
    if (!selectedCourse) return;
    
    const { title, description, slug, icon, toolName, isPro, isFree, isTutorial } = newCourse;
    
    if (!title || !description || !slug) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const badges: Array<'tutorial' | 'pro' | 'free'> = [];
    if (isPro) badges.push('pro');
    if (isFree) badges.push('free');
    if (isTutorial) badges.push('tutorial');

    const updatedCourses = courses.map(course => {
      if (course.id === selectedCourse.id) {
        return {
          ...course,
          title,
          description,
          slug,
          badges,
          icon: icon || '📚',
          toolName: toolName || undefined,
        };
      }
      return course;
    });

    setCourses(updatedCourses);
    setSelectedCourse(null);
    setIsEditing(false);
    
    setNewCourse({
      title: '',
      description: '',
      slug: '',
      icon: '',
      toolName: '',
      isPro: false,
      isFree: false,
      isTutorial: false,
    });

    toast({
      title: "Success",
      description: "Course updated successfully",
    });
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
                              <Input 
                                id="courseCategory" 
                                value={newCourse.toolName} 
                                onChange={(e) => setNewCourse({...newCourse, toolName: e.target.value})} 
                                placeholder="e.g. AI Tools"
                              />
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
                  
                  <div className="space-y-4">
                    {courses.map(course => (
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
                    ))}
                  </div>
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
