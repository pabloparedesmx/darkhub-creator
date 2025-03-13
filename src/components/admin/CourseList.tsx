
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreVertical, Edit, Trash } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import CategoryBadge from '@/components/ui/CategoryBadge';
import { DbCourse } from '@/types/admin';

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
        </>
      )}
    </div>
  );
};

export default CourseList;
