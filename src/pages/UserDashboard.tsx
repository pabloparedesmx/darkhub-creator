
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Bell, CreditCard, Home, Settings, User } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import CourseCard, { Course } from '@/components/ui/CourseCard';

const UserDashboard = () => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'AI Product Development',
      description: 'Learn how to build AI-powered products from scratch.',
      badges: ['pro'],
      slug: 'ai-product-development',
      icon: '🤖',
    },
    {
      id: '2',
      title: 'Growth Marketing',
      description: 'Strategies to grow your product and acquire users.',
      badges: ['tutorial', 'free'],
      slug: 'growth-marketing',
      icon: '📈',
    },
  ]);

  const [savedCourses, setSavedCourses] = useState<Course[]>([
    {
      id: '3',
      title: 'UX Research',
      description: 'Learn how to conduct user research and analyze results.',
      badges: ['pro'],
      slug: 'ux-research',
      icon: '👥',
    },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Dashboard</h1>
            <ThemeToggle />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-3">
              <Card className="bg-secondary/30 backdrop-blur-sm mb-6">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center pt-4 pb-6">
                    <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mb-4">
                      <User className="w-12 h-12 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold mb-1">John Doe</h2>
                    <p className="text-muted-foreground text-sm">john@example.com</p>
                  </div>
                  
                  <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start">
                      <Home className="mr-2 h-5 w-5" />
                      Dashboard
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="mr-2 h-5 w-5" />
                      Profile
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <CreditCard className="mr-2 h-5 w-5" />
                      Subscription
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Bell className="mr-2 h-5 w-5" />
                      Notifications
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="mr-2 h-5 w-5" />
                      Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-secondary/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Subscription</CardTitle>
                  <CardDescription>You are on the Pro plan</CardDescription>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="bg-primary/10 p-4 rounded-md mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Pro Plan</span>
                      <span className="font-semibold">$49/mo</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">Renews on Aug 15, 2023</p>
                    <Button size="sm" variant="outline" className="w-full">Manage Subscription</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-9">
              <Tabs defaultValue="courses">
                <TabsList className="mb-6">
                  <TabsTrigger value="courses">My Courses</TabsTrigger>
                  <TabsTrigger value="saved">Saved</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="courses">
                  <div className="mb-6">
                    <Input 
                      placeholder="Search your courses..." 
                      className="max-w-md"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="saved">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedCourses.map(course => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your personal details</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="firstName">First Name</label>
                            <Input id="firstName" defaultValue="John" />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="lastName">Last Name</label>
                            <Input id="lastName" defaultValue="Doe" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email">Email</label>
                          <Input id="email" type="email" defaultValue="john@example.com" />
                        </div>
                        <Button type="button">Save Changes</Button>
                      </form>
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

export default UserDashboard;
