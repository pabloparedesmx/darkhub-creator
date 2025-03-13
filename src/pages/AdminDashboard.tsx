
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Database } from '@/lib/database.types';

// Import components
import AdminSidebar from '@/components/admin/AdminSidebar';
import CategoriesSection from '@/components/admin/CategoriesSection';
import ContentManagementTab from '@/components/admin/ContentManagementTab';
import UserManagementTab from '@/components/admin/UserManagementTab';
import AnalyticsTab from '@/components/admin/AnalyticsTab';

// Type for category from database
type Category = Database['public']['Tables']['categories']['Row'];

// Type for course from database with badges
type DbCourse = Database['public']['Tables']['courses']['Row'] & {
  badges: Array<'pro' | 'free' | 'tutorial'>;
  toolName?: string;
};

// Type for user profiles
type UserProfile = Database['public']['Tables']['profiles']['Row'];

const AdminDashboard = () => {
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [courses, setCourses] = useState<DbCourse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserLoading, setIsUserLoading] = useState(true);

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
            <AdminSidebar />
            
            {/* Main Content */}
            <div className="md:col-span-9">
              <Tabs defaultValue="content">
                <TabsList className="mb-6">
                  <TabsTrigger value="content">Content Management</TabsTrigger>
                  <TabsTrigger value="users">User Management</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                
                <TabsContent value="content">
                  <ContentManagementTab 
                    courses={courses} 
                    setCourses={setCourses} 
                    categories={categories} 
                    isLoading={isLoading} 
                  />
                </TabsContent>
                
                <TabsContent value="users">
                  <UserManagementTab 
                    users={users} 
                    setUsers={setUsers} 
                    isLoading={isUserLoading} 
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
