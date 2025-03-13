
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, PlusCircle } from 'lucide-react';
import CourseList from './CourseList';
import CourseForm from './CourseForm';
import { DbCourse, Category } from '@/types/admin';

interface CourseManagementProps {
  courses: DbCourse[];
  categories: Category[];
  newCourse: {
    title: string;
    description: string;
    slug: string;
    icon: string;
    category_id: string;
    isPro: boolean;
    isFree: boolean;
    isTutorial: boolean;
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
            <CourseForm 
              newCourse={newCourse}
              setNewCourse={setNewCourse}
              isEditing={isEditing}
              categories={categories}
              handleAddCourse={handleAddCourse}
              handleUpdateCourse={handleUpdateCourse}
            />
          </DialogContent>
        </Dialog>
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
