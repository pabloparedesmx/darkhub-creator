
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import CourseList from './CourseList';
import { DbCourse, Category } from '@/types/admin';

interface CourseManagementProps {
  courses: DbCourse[];
  categories: Category[];
  newCourse: {
    title: string;
    description: string;
    short_description: string; // Added short_description field
    slug: string;
    icon: string;
    category_id: string;
    isPro: boolean;
    isFree: boolean;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
  };
  setNewCourse: (course: any) => void;
  isEditing: boolean;
  isLoading: boolean;
  handleAddCourse: () => void;
  handleUpdateCourse: () => void;
  handleEditCourse: (course: DbCourse) => void;
  handleDeleteCourse: (id: string) => void;
}

const CourseManagement = ({
  courses,
  categories,
  newCourse,
  setNewCourse,
  isEditing,
  isLoading,
  handleAddCourse,
  handleUpdateCourse,
  handleEditCourse,
  handleDeleteCourse
}: CourseManagementProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search content..." className="pl-10" />
        </div>
        <Button asChild>
          <Link to="/admin/courses/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Course
          </Link>
        </Button>
      </div>
      
      <CourseList 
        courses={courses}
        handleEditCourse={handleEditCourse}
        handleDeleteCourse={handleDeleteCourse}
        isLoading={isLoading}
      />
    </div>
  );
};

export default CourseManagement;
