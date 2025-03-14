
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RichTextEditor from '@/components/ui/RichTextEditor';
import { Category } from '@/types/admin';
import { Switch } from '@/components/ui/switch';

interface CourseFormProps {
  newCourse: {
    title: string;
    description: string;
    slug: string;
    icon: string;
    category_id: string;
    isPro: boolean;
    isFree: boolean;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
  };
  setNewCourse: (course: any) => void;
  isEditing: boolean;
  categories: Category[];
  handleAddCourse: () => void;
  handleUpdateCourse: () => void;
}

const CourseForm = ({
  newCourse,
  setNewCourse,
  isEditing,
  categories,
  handleAddCourse,
  handleUpdateCourse
}: CourseFormProps) => {
  return (
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
        <RichTextEditor 
          value={newCourse.description} 
          onChange={(content) => setNewCourse({...newCourse, description: content})} 
          placeholder="Brief description of the course"
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="courseDifficulty">Difficulty</label>
          <Select
            value={newCourse.difficulty || 'beginner'}
            onValueChange={(value) => setNewCourse({...newCourse, difficulty: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a difficulty level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label>Access Type</label>
          <div className="flex items-center space-x-2 mt-4">
            <Switch 
              id="isPro"
              checked={newCourse.isPro}
              onCheckedChange={(checked) => setNewCourse({...newCourse, isPro: checked})}
            />
            <label htmlFor="isPro" className="text-sm cursor-pointer">
              Pro Content
            </label>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Switch 
              id="isFree"
              checked={newCourse.isFree}
              onCheckedChange={(checked) => setNewCourse({...newCourse, isFree: checked})}
            />
            <label htmlFor="isFree" className="text-sm cursor-pointer">
              Free Access
            </label>
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
    </div>
  );
};

export default CourseForm;
