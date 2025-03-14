
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreVertical, Edit, Trash, BookOpen, Wrench } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DbCourse } from '@/types/admin';
import RichTextContent from '@/components/ui/RichTextContent';
import CourseToolAssociation from './CourseToolAssociation';

interface CourseListProps {
  courses: DbCourse[];
  handleEditCourse: (course: DbCourse) => void;
  handleDeleteCourse: (id: string) => void;
  isLoading: boolean;
}

const CourseList = ({
  courses,
  handleEditCourse,
  handleDeleteCourse,
  isLoading
}: CourseListProps) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isToolDialogOpen, setIsToolDialogOpen] = useState(false);

  const handleManageTools = (courseId: string) => {
    setSelectedCourseId(courseId);
    setIsToolDialogOpen(true);
  };

  // Function to render tool icon (emoji or image)
  const renderToolIcon = (icon?: string) => {
    if (!icon) return '📚';
    
    // Check if the icon is a URL
    const isUrl = /^(https?:\/\/|www\.)|(\.(png|jpg|jpeg|svg|webp|ico)$)/i.test(icon);
    
    if (isUrl) {
      return <img src={icon} alt="Tool" className="h-full w-full object-contain" />;
    }
    
    // If not a URL, render as emoji
    return icon;
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {courses.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No courses found. Add your first course to get started.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {courses.map(course => (
                <Card key={course.id} className="overflow-hidden border border-border hover:border-border/80 transition-all">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Course icon column */}
                      <div className="flex items-center justify-center p-6 bg-secondary/30 md:w-24 md:h-auto">
                        <div className="flex items-center justify-center w-16 h-16 text-3xl bg-background rounded-full border border-border shadow-sm">
                          {renderToolIcon(course.icon)}
                        </div>
                      </div>
                      
                      {/* Course content column */}
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link to={`/courses/${course.slug}`} className="hover:text-primary transition-colors">
                              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                            </Link>
                            {course.badges && course.badges.includes('tutorial') && (
                              <div className="inline-block bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-full text-xs mb-3">
                                Tutorial
                              </div>
                            )}
                            <div className="mb-4">
                              <RichTextContent 
                                content={course.description} 
                                className="line-clamp-2 text-sm text-muted-foreground"
                              />
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <BookOpen className="h-3 w-3 mr-1" />
                              <span>Slug: {course.slug}</span>
                              {course.difficulty && (
                                <span className="ml-3">Difficulty: {course.difficulty}</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="mr-2"
                              onClick={() => handleManageTools(course.id)}
                            >
                              <Wrench className="h-4 w-4 mr-1" />
                              Tools
                            </Button>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link to={`/admin/courses/edit/${course.id}`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </Link>
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
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
      
      {selectedCourseId && (
        <CourseToolAssociation
          courseId={selectedCourseId}
          isOpen={isToolDialogOpen}
          onClose={() => setIsToolDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default CourseList;
